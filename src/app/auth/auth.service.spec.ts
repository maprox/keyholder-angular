import { HttpErrorResponse } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { EncryptingService } from '../encrypting';
import { HttpService } from '../http';
import { AuthService } from './auth.service';
import { Session, User } from './model';

describe('AuthService', () => {
  let httpSubject,
    httpPostSubject,
    httpServiceMock,
    encryptingServiceMock,
    routerMock;

  beforeEach(() => {
    httpSubject = new Subject<Object>();
    httpPostSubject = new Subject<Object>();
    httpServiceMock = {
      getConnectionEvent: () => httpSubject.asObservable(),
      post: jasmine.createSpy().and.returnValue(httpPostSubject)
    };
    encryptingServiceMock = {
      setUser: jasmine.createSpy(),
      getLogin: jasmine.createSpy(),
      getSecret: jasmine.createSpy(),
    };
    routerMock = {
      navigate: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: httpServiceMock
        },
        {
          provide: EncryptingService,
          useValue: encryptingServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
    expect(routerMock.navigate.calls.count()).toEqual(0);
  }));

  it('should logout when auth failed', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();

    const res1 = new HttpErrorResponse({ status: 400 });
    httpSubject.next(res1);
    expect(routerMock.navigate.calls.count()).toEqual(0);

    const res2 = new HttpErrorResponse({ status: 403 });
    httpSubject.next(res2);
    expect(routerMock.navigate.calls.count()).toEqual(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/logout']);
  }));

  it('should not be logged in', inject([AuthService], (service: AuthService) => {
    let sessionFromEvent = 0;

    service.getAuthEvent().subscribe((val) => {
      sessionFromEvent = val;
    });
    expect(sessionFromEvent).toEqual(0);

    const session = service.getSession();
    expect(session).toBeNull();

    expect(service.isLoggedIn()).toBeFalsy();
  }));

  it('should log out', inject([AuthService], (service: AuthService) => {
    let sessionFromEvent = 0;

    service.getAuthEvent().subscribe((val) => {
      sessionFromEvent = val;
    });
    expect(sessionFromEvent).toEqual(0);

    service.logOut();

    expect(sessionFromEvent).toBeUndefined();
    expect(encryptingServiceMock.setUser).toHaveBeenCalledWith(null);
  }));

  it('should sign in', inject([AuthService], (service: AuthService) => {
    let sessionFromEvent: any = null;

    service.getAuthEvent().subscribe((val) => {
      sessionFromEvent = val;
    });

    const username = 'some@example.com';
    const password = 'secret';
    const hash = username + password;
    const user = new User(username, password);

    encryptingServiceMock.getLogin.and.returnValue(username);
    encryptingServiceMock.getSecret.and.returnValue(hash);

    service.signIn(user);

    expect(encryptingServiceMock.setUser).toHaveBeenCalledWith(user);
    expect(encryptingServiceMock.getLogin).toHaveBeenCalled();
    expect(encryptingServiceMock.getSecret).toHaveBeenCalled();

    expect(httpServiceMock.post).toHaveBeenCalledWith('/sign_in', {
      login: username,
      secret: hash
    });

    const sessionData = {
      token: 'some-token',
      data: 'some-data'
    };

    const session = new Session(
      sessionData.token,
      sessionData.data
    );

    httpPostSubject.next(sessionData);

    expect(sessionFromEvent).toEqual(session);

    sessionFromEvent = null;

    expect(service.getSession()).toEqual(session, 'Should return session instance');
    expect(sessionFromEvent).toBeNull('Session should be taken from local cache');
  }));

  it('should sign up', inject([AuthService], (service: AuthService) => {
    let sessionFromEvent: any = null;

    service.getAuthEvent().subscribe((val) => {
      sessionFromEvent = val;
    });

    const username = 'some@example.com';
    const password = 'secret';
    const hash = username + password;
    const user = new User(username, password);

    encryptingServiceMock.getLogin.and.returnValue(username);
    encryptingServiceMock.getSecret.and.returnValue(hash);

    service.signUp(user);

    expect(encryptingServiceMock.setUser).toHaveBeenCalledWith(user);
    expect(encryptingServiceMock.getLogin).toHaveBeenCalled();
    expect(encryptingServiceMock.getSecret).toHaveBeenCalled();

    expect(httpServiceMock.post).toHaveBeenCalledWith('/sign_up', {
      login: username,
      secret: hash
    });

    const sessionData = {
      token: 'some-token',
      data: 'some-data'
    };

    const session = new Session(
      sessionData.token,
      sessionData.data
    );

    httpPostSubject.next(sessionData);

    expect(sessionFromEvent).toEqual(session);

    sessionFromEvent = null;

    expect(service.getSession()).toEqual(session, 'Should return session instance');
    expect(sessionFromEvent).toBeNull('Session should be taken from local cache');
    expect(service.getAuthorizationHeader()).toEqual('Bearer some-token');
  }));

  it('should logout on network error', inject([AuthService], (service: AuthService) => {
    let sessionFromEvent: any = null;

    service.getAuthEvent().subscribe((val) => {
      sessionFromEvent = val;
    });

    const username = 'some@example.com';
    const password = 'secret';
    const hash = username + password;
    const user = new User(username, password);

    encryptingServiceMock.getLogin.and.returnValue(username);
    encryptingServiceMock.getSecret.and.returnValue(hash);

    service.signIn(user);

    expect(encryptingServiceMock.setUser).toHaveBeenCalledWith(user);
    expect(encryptingServiceMock.getLogin).toHaveBeenCalled();
    expect(encryptingServiceMock.getSecret).toHaveBeenCalled();

    expect(httpServiceMock.post).toHaveBeenCalledWith('/sign_in', {
      login: username,
      secret: hash
    });

    expect(sessionFromEvent).toBeNull();
    httpPostSubject.error('No matter which error has happened');

    expect(sessionFromEvent).toBeUndefined();
    expect(encryptingServiceMock.setUser).toHaveBeenCalledWith(null);
    expect(service.getAuthorizationHeader()).toEqual('');
  }));

  it('should check class names for models', () => {
    const user = new User('', '');
    const session = new Session('', '');
    expect(user.getClassName()).toEqual('User');
    expect(session.getClassName()).toEqual('Session');
  });
});
