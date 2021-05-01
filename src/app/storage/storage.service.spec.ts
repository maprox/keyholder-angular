import { inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { AuthService } from '../auth';
import { Options } from '../password-generator/model';
import { Container, Folder, Secret } from './model';
import { StorageApiService } from './storage-api.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let storageApiSubject,
    storageApiServiceMock,
    getAuthEventSubject: Subject<Object>,
    authServiceMock: any,
    service: StorageService;

  beforeEach(() => {
    storageApiSubject = new Subject<Object>();
    storageApiServiceMock = {
      save: jasmine.createSpy(),
      load: jasmine.createSpy().and.returnValue(storageApiSubject)
    };
    getAuthEventSubject = new Subject<Object>();
    authServiceMock = {
      getAuthEvent: jasmine.createSpy().and.returnValue(getAuthEventSubject),
    };

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        {
          provide: StorageApiService,
          useValue: storageApiServiceMock
        },
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    });
  });

  beforeEach(inject([StorageService], (storageService: StorageService) => {
    service = storageService;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.isAvailable).toBeFalsy();
    expect(service.isInSearchMode).toBeFalsy();
  });

  it('should check root folder', () => {
    expect(service.getRoot()).toBeUndefined();
    service.setRoot(new Folder('root'));
    expect(service.getRoot()).toEqual(new Folder('root'));
  });

  it('should properly init models', () => {
    const root = getRoot();
    expect(root.getClassName()).toEqual('Folder');

    const container = new Container(root, new Options(), 1.1);
    expect(container.getVersion()).toEqual(1.1);
    expect(container.getClassName()).toEqual('Container');
  });

  it('should set search mode', () => {
    service.setSearchMode(true);
    expect(service.isInSearchMode).toBeTruthy();
    service.setSearchMode(false);
    expect(service.isInSearchMode).toBeFalsy();
  });

  it('should load the storage', () => {
    let loadedRoot;
    service.onChange().subscribe((root) => loadedRoot = root);

    const storageRoot = getRoot();
    const container = new Container(storageRoot, new Options());

    service.load();
    expect(service.isAvailable).toBeFalsy();
    storageApiSubject.next(container);
    expect(service.isAvailable).toBeTruthy();

    service.load();
    // check that second call to the "load" function doesn't request anything from the server
    expect(storageApiServiceMock.load).toHaveBeenCalledTimes(1);
    expect(loadedRoot).toEqual(storageRoot);
  });

  it('should search', () => {
    let currentRoot;
    service.onChange().subscribe((root) => currentRoot = root);

    const storageRoot = getRoot();
    const container = new Container(storageRoot, new Options());

    service.load();
    storageApiSubject.next(container);
    expect(service.isAvailable).toBeTruthy();

    expect(service.isInSearchMode).toBeFalsy();
    service.search('ld');
    expect(service.isInSearchMode).toBeTruthy();
    const actualSearch1 = service.getRoot();
    const expectedSearch1 = new Folder('Search results');
    expectedSearch1.add(new Folder('world!'));
    expectedSearch1.add(new Secret('secret2 bold', 'super-secret!12'));
    expect(actualSearch1).toEqual(expectedSearch1);

    // empty query should return this into default (non search) state
    service.search('');
    expect(service.isInSearchMode).toBeFalsy();
    expect(service.getRoot()).toEqual(storageRoot);
  });

  it('should save the storage', () => {
    const storageRoot = getRoot();

    // do not save in search mode
    service.setSearchMode(true);
    service.save();
    expect(storageApiServiceMock.save).toHaveBeenCalledTimes(0);

    service.setSearchMode(false);
    service.setRoot(storageRoot);
    service.save();
    expect(storageApiServiceMock.save).toHaveBeenCalledTimes(1);
    expect(storageApiServiceMock.save).toHaveBeenCalledWith(storageRoot);
  });

  it('should become unavailable when logged out', () => {
    service.load();
    storageApiSubject.next(new Container(getRoot(), new Options()));
    expect(service.isAvailable).toBeTruthy();

    // let's NOT log out
    getAuthEventSubject.next(true);
    expect(service.isAvailable).toBeTruthy();

    // let's log out
    getAuthEventSubject.next(false);
    expect(service.isAvailable).toBeFalsy();
  });

  function getRoot(): Folder {
    const root = new Folder();

    const folder1 = new Folder('hello');
    folder1.add(new Secret('secret1 alpha', 'super-secret!11'));
    folder1.add(new Secret('secret2 bold', 'super-secret!12'));

    const folder2 = new Folder('virtual');
    folder2.add(new Secret('secret3 theodor', 'super-secret!13'));

    const folder3 = new Folder('world!');

    root.add(folder1);
    root.add(folder2);
    root.add(folder3);

    return root;
  }
});
