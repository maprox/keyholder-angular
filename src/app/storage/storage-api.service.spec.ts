import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth';

import { EncryptingService } from '../encrypting';
import { PasswordGeneratorService } from '../password-generator';
import { Options } from '../password-generator/model';
import { Container, Folder, Secret } from './model';
import { HttpService } from '../http';
import { StorageApiService } from './storage-api.service';

describe('StorageApiService', () => {
  let service: StorageApiService;
  let authService;
  let httpService;
  let encryptingService;
  let passwordGeneratorService;
  let options;
  let httpClientSubject;
  let getAuthEventSubject;
  let httpSpy;

  beforeEach(() => {
    localStorage.clear();

    httpClientSubject = new Subject<Object>();
    httpSpy = jasmine.createSpy().and.returnValue(httpClientSubject);
    httpService = {
      get: httpSpy,
      put: httpSpy
    };
    getAuthEventSubject = new Subject<Object>();
    authService = {
      getAuthEvent: jasmine.createSpy().and.returnValue(getAuthEventSubject),
    };
    encryptingService = {
      encrypt: jasmine.createSpy(),
      decrypt: jasmine.createSpy()
    };
    options = new Options();
    passwordGeneratorService = {
      getOptions: jasmine.createSpy().and.returnValue(options),
      setOptions: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      providers: [
        StorageApiService,
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: HttpService,
          useValue: httpService
        },
        {
          provide: EncryptingService,
          useValue: encryptingService
        },
        {
          provide: PasswordGeneratorService,
          useValue: passwordGeneratorService
        }
      ]
    });
  });

  beforeEach(inject([StorageApiService], (storageApiService: StorageApiService) => {
    service = storageApiService;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save (new) storage to localStorage', () => {
    const root = getRoot();
    const encryptedContainer = 'EnCr YPt=eeed!';
    const container = new Container(root, options);
    encryptingService.encrypt.and.returnValue(encryptedContainer);

    service.save(root);

    expect(passwordGeneratorService.getOptions).toHaveBeenCalled();

    expect(encryptingService.encrypt).toHaveBeenCalledWith(JSON.stringify(container));
    expect(httpService.put).toHaveBeenCalledWith('/storage', {
      data: encodeURIComponent(encryptedContainer)
    });

    expect(localStorage.getItem('storage')).toEqual(null);

    httpClientSubject.next();

    expect(localStorage.getItem('storage')).toEqual(encodeURIComponent(encryptedContainer));
    localStorage.clear();
    expect(localStorage.getItem('storage')).toEqual(null);

    httpClientSubject.error();

    expect(localStorage.getItem('storage')).toEqual(encodeURIComponent(encryptedContainer));
  });

  it('should save loaded storage', () => {
    const root = new Folder('root');
    const container = new Container(root, options);
    const encryptedContainer = 'EnCr YPt=eeed!';
    const newOptions = new Options(22);

    service.load();

    httpClientSubject.next(encryptedContainer);

    passwordGeneratorService.setOptions.and.returnValue(newOptions);

    encryptingService.encrypt.and.returnValue(encryptedContainer);

    service.save(root);

    expect(encryptingService.encrypt).toHaveBeenCalledWith(JSON.stringify(container));

    expect(httpService.put).toHaveBeenCalledWith('/storage', {
      data: encodeURIComponent(encryptedContainer)
    });
  });

  it('should load data from server when failed to decrypt', <any>fakeAsync((): void => {
    const root = new Folder('root');
    const container = new Container(root, options);
    const onSuccess = jasmine.createSpy();
    const encryptedRoot = 'EnCr YPt=eeed!';
    const encodedEncryptedRoot = encodeURIComponent(encryptedRoot);

    service.load().pipe(first()).subscribe(onSuccess);

    expect(httpService.get).toHaveBeenCalledTimes(1);
    expect(httpService.get).toHaveBeenCalledWith('/storage', {responseType: 'text'});
    expect(onSuccess).toHaveBeenCalledTimes(0);

    httpClientSubject.next(encodedEncryptedRoot);
    expect(encryptingService.decrypt).toHaveBeenCalledWith(encryptedRoot);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(container);

    httpService.get = jasmine.createSpy();
    const onSuccess2 = jasmine.createSpy();
    service.load().pipe(first()).subscribe(onSuccess2);
    tick();
    expect(httpService.get).toHaveBeenCalledTimes(0);
    expect(onSuccess2).toHaveBeenCalledTimes(1);
    expect(onSuccess2).toHaveBeenCalledWith(container);
  }));

  it('should load data from server when successfully decrypted', () => {
    const onSuccess = jasmine.createSpy();
    const encryptedContainer = 'EnCr YPt=eeed!';
    const container = new Container(getRoot(), options);
    const data = JSON.stringify(container);

    service.load().subscribe(onSuccess);

    encryptingService.decrypt.and.returnValue(data);
    httpClientSubject.next(encryptedContainer);
    expect(encryptingService.decrypt).toHaveBeenCalledWith(encryptedContainer);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(container);
  });

  it('should load data from localStorage', () => {
    const onSuccess = jasmine.createSpy();
    const encryptedRoot = 'EnCr YPt=eeed!';
    const container = new Container(getRoot(), options);
    const data = JSON.stringify(container);

    service.load().subscribe(onSuccess);

    localStorage.setItem('storage', encryptedRoot);
    encryptingService.decrypt.and.returnValue(data);
    httpClientSubject.error();
    expect(encryptingService.decrypt).toHaveBeenCalledWith(encryptedRoot);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(container);
  });

  it('should try to reload storage from server when logged out', <any>fakeAsync((): void => {
    const onSuccess = jasmine.createSpy();
    const encryptedContainer = 'EnCr YPt=eeed!';
    const container = new Container(getRoot(), options);

    service.load().pipe(first()).subscribe(onSuccess);
    expect(httpService.get).toHaveBeenCalledTimes(1);
    encryptingService.decrypt.and.returnValue(JSON.stringify(container));
    httpClientSubject.next(encryptedContainer);
    expect(onSuccess).toHaveBeenCalledTimes(1);

    httpService.get = jasmine.createSpy().and.returnValue({ subscribe: () => {} });
    const onSuccess2 = jasmine.createSpy();

    service.load().pipe(first()).subscribe(onSuccess2);
    tick();
    expect(httpService.get).toHaveBeenCalledTimes(0);
    expect(onSuccess2).toHaveBeenCalledTimes(1);

    // NOT logged out
    getAuthEventSubject.next(true);
    service.load();
    tick();
    expect(httpService.get).toHaveBeenCalledTimes(0);

    // logged out
    getAuthEventSubject.next(false);
    service.load();
    expect(httpService.get).toHaveBeenCalledTimes(1);
  }));

  function getRoot(): Folder {
    const root = new Folder();
    (root.add(new Folder('test')) as Folder).add(new Secret(
      'secret',
      'super-secret!11'
    ));

    return root;
  }
});
