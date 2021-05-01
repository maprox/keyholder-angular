import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { AlertService } from '../alert';
import { HttpService } from './http.service';

describe('HttpService', () => {
  let service: HttpService;
  let httpClientSubject;
  let httpClientMock;
  let httpSpy;
  let alertServiceMock;
  let testData;

  beforeEach(() => {
    httpClientSubject = new Subject<Object>();
    httpSpy = jasmine.createSpy().and.returnValue(httpClientSubject);
    httpClientMock = {
      post: httpSpy,
      get: httpSpy,
      put: httpSpy
    };
    alertServiceMock = {
      error: jasmine.createSpy()
    };
    testData = {
      url: '/some-url',
      contents: {
        string: 'hello string',
        object: {
          x1: '10',
          x2: '20'
        }
      },
      options: {
        headers: (new HttpHeaders()).set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        )
      },
      response: 'test payload',
      expected: {
        url: 'http://localhost:3000/api/some-url',
        contents: {
          string: 'hello string',
          object: 'x1=10&x2=20'
        },
        options: {
          headers: (new HttpHeaders()).set(
            'Content-Type',
            'application/x-www-form-urlencoded'
          )
        }
      }
    };

    TestBed.configureTestingModule({
      providers: [
        HttpService,
        {
          provide: HttpClient,
          useValue: httpClientMock
        },
        {
          provide: AlertService,
          useValue: alertServiceMock
        }
      ]
    });
  });

  beforeEach(inject([HttpService], (httpService: HttpService) => {
    service = httpService;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post string without options', () => {
    service.post(testData.url, testData.contents.string);
    service.put(testData.url, testData.contents.string);

    expect(httpClientMock.post).toHaveBeenCalledWith(
      testData.expected.url,
      testData.expected.contents.string,
      testData.expected.options
    );
    expect(httpClientMock.put).toHaveBeenCalledWith(
      testData.expected.url,
      testData.expected.contents.string,
      testData.expected.options
    );
  });

  it('should post json without options', () => {
    service.post(testData.url, testData.contents.object);
    service.put(testData.url, testData.contents.object);

    expect(httpClientMock.post).toHaveBeenCalledWith(
      testData.expected.url,
      testData.expected.contents.object,
      testData.expected.options
    );
    expect(httpClientMock.put).toHaveBeenCalledWith(
      testData.expected.url,
      testData.expected.contents.object,
      testData.expected.options
    );
  });

  it('should post string with options', () => {
    testData.options.headers = testData.options.headers
      .set('Content-Type', 'text/plain')
      .set('X-Some-Header', 'Test Header');

    service.post(testData.url, testData.contents.string, testData.options);
    service.put(testData.url, testData.contents.string, testData.options);

    expect(httpClientMock.post).toHaveBeenCalledWith(
      testData.expected.url,
      testData.expected.contents.string,
      testData.options
    );
    expect(httpClientMock.put).toHaveBeenCalledWith(
      testData.expected.url,
      testData.expected.contents.string,
      testData.options
    );
  });

  it('should get without options', () => {
    service.get(testData.url);

    expect(httpClientMock.get).toHaveBeenCalledWith(
      testData.expected.url,
      testData.expected.options
    );
  });

  it('should get with options', () => {
    testData.options.headers = testData.options.headers
      .set('Content-Type', 'text/plain')
      .set('X-Some-Header', 'Test Header');

    service.get(testData.url, testData.options);

    expect(httpClientMock.get).toHaveBeenCalledWith(
      testData.expected.url,
      testData.options
    );
  });

  it('should notify listeners about connection', () => {
    let response = null;
    service.get(testData.url).subscribe((value) => {
      response = value;
    });

    let isConnected = null;
    service.getConnectionEvent().subscribe((value) => {
      isConnected = value;
    });

    expect(response).toBeNull();
    expect(isConnected).toBeNull();

    httpClientSubject.next(testData.response);

    expect(response).toEqual(testData.response);
    expect(isConnected).toBeTruthy();

    isConnected = null; // reset the flag

    // try another url
    service.get(testData.url + 'another').subscribe((value) => { response = value; });

    httpClientSubject.next(testData.response + 'another');

    expect(response).toEqual(testData.response + 'another');
    expect(isConnected).toBeNull();
  });

  it('should handle failure with unknown error', () => {
    let response = null;
    service.get(testData.url).subscribe(
      (value) => { response = value; },
      (value) => {
        response = {
          failed: true,
          error: value
        };
      }
    );

    let isConnected = null;
    service.getConnectionEvent().subscribe((value) => {
      isConnected = value;
    });

    const error = new HttpErrorResponse({ error: new Error('Some unknown error') });

    httpClientSubject.error(error);

    expect(alertServiceMock.error).toHaveBeenCalledWith(
      'Unknown error occurred, please try again later.'
    );
    expect(response).toEqual({
      failed: true,
      error: error
    });
    expect(isConnected).toBeNull();
  });

  it('should handle network failure', () => {
    let response = null;
    service.get(testData.url).subscribe(
      (value) => { response = value; },
      (value) => {
        response = {
          failed: true,
          error: value
        };
      }
    );

    let isConnected = null;
    service.getConnectionEvent().subscribe((value) => {
      isConnected = value;
    });

    const error = new HttpErrorResponse({ status: 0 });

    httpClientSubject.error(error);

    expect(alertServiceMock.error).toHaveBeenCalledWith(
      'Network error, please check your connection.'
    );
    expect(response).toEqual({
      failed: true,
      error: error
    });
    expect(isConnected).toBeFalsy();

    alertServiceMock.error.calls.reset();

    // check that no errors are being displayed
    service.get(testData.url).subscribe(
      (value) => { response = value; },
      (value) => {
        response = {
          failed: true,
          error: value
        };
      }
    );

    httpClientSubject.error(new HttpErrorResponse({ status: 500 }));

    expect(alertServiceMock.error).toHaveBeenCalledTimes(0);
  });

  it('should handle backend failure', () => {
    let response = null;
    service.get(testData.url).subscribe(
      (value) => { response = value; },
      (value) => {
        response = {
          failed: true,
          error: value
        };
      }
    );

    let isConnected = null;
    service.getConnectionEvent().subscribe((value) => { isConnected = value; });

    const error = new HttpErrorResponse({
      status: 403,
      error: 'Hello, this is an error'
    });

    httpClientSubject.error(error);

    expect(alertServiceMock.error).toHaveBeenCalledWith(
      'Backend returned code 403, body was: Hello, this is an error'
    );
    expect(response).toEqual({
      failed: true,
      error: error
    });
    expect(isConnected instanceof HttpErrorResponse).toBeTruthy();
  });
});
