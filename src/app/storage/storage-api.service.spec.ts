import { inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { EncryptingService } from '../encrypting';
import { PasswordGeneratorService } from '../password-generator';
import { Options } from '../password-generator/model';
import { Container, Folder, Secret } from './model';
import { HttpService } from '../http';
import { StorageApiService } from './storage-api.service';

describe('StorageApiService', () => {
  let service: StorageApiService,
    httpService,
    encryptingService,
    passwordGeneratorService,
    options,
    httpClientSubject,
    httpSpy;

  beforeEach(() => {
    localStorage.clear();

    httpClientSubject = new Subject<Object>();
    httpSpy = jasmine.createSpy().and.returnValue(httpClientSubject);
    httpService = {
      get: httpSpy,
      put: httpSpy
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

  it('should save storage to localStorage', () => {
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

  it('should load data from server when failed to decrypt', () => {
    const onSuccess = jasmine.createSpy();
    const onFailure = jasmine.createSpy();
    const encryptedRoot = 'EnCr YPt=eeed!';
    const encodedEncryptedRoot = encodeURIComponent(encryptedRoot);

    service.load().subscribe(onSuccess, onFailure);

    expect(httpService.get).toHaveBeenCalledWith('/storage', {responseType: 'text'});
    expect(onSuccess).toHaveBeenCalledTimes(0);
    expect(onFailure).toHaveBeenCalledTimes(0);

    httpClientSubject.next(encodedEncryptedRoot);
    expect(encryptingService.decrypt).toHaveBeenCalledWith(encryptedRoot);
    expect(onSuccess).toHaveBeenCalledTimes(0);
    expect(onFailure).toHaveBeenCalledTimes(0);
  });

  it('should load data from server when successfully decrypted', () => {
    const onSuccess = jasmine.createSpy();
    const onFailure = jasmine.createSpy();
    const encryptedContainer = 'EnCr YPt=eeed!';
    const root = getRoot();
    const container = new Container(root, options);
    const data = JSON.stringify(container);

    service.load().subscribe(onSuccess, onFailure);

    encryptingService.decrypt.and.returnValue(data);
    httpClientSubject.next(encryptedContainer);
    expect(encryptingService.decrypt).toHaveBeenCalledWith(encryptedContainer);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(container);
    expect(onFailure).toHaveBeenCalledTimes(0);
  });

  it('should load data from localStorage', () => {
    const onSuccess = jasmine.createSpy();
    const onFailure = jasmine.createSpy();
    const encryptedRoot = 'EnCr YPt=eeed!';
    const root = getRoot();
    const container = new Container(root, options);
    const data = JSON.stringify(root);

    service.load().subscribe(onSuccess, onFailure);

    localStorage.setItem('storage', encryptedRoot);
    encryptingService.decrypt.and.returnValue(data);
    httpClientSubject.error();
    expect(encryptingService.decrypt).toHaveBeenCalledWith(encryptedRoot);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(container);
  });

  /**
   * @return {Folder}
   */
  function getRoot() {
    const root = new Folder();
    (root.add(new Folder('test')) as Folder).add(new Secret(
      'secret',
      'super-secret!11'
    ));

    return root;
  }
});
