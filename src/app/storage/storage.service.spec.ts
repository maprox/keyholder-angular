import { TestBed, inject } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { AuthService } from '../auth';
import { Container, Folder } from './model';
import { Options } from '../password-generator/model';
import { StorageApiService } from './storage-api.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let storageApiSubject,
    storageApiServiceMock,
    authSubject: Subject<Object>,
    authServiceMock: any,
    service: StorageService;

  beforeEach(() => {
    storageApiSubject = new Subject<Object>();
    storageApiServiceMock = {
      save: jasmine.createSpy(),
      load: jasmine.createSpy().and.returnValue(storageApiSubject)
    };
    authSubject = new Subject<Object>();
    authServiceMock = {
      getAuthEvent() {
        return authSubject.asObservable();
      }
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
  });

  it('should check root folder', () => {
    expect(service.getRoot()).toBeUndefined();
    service.setRoot(new Folder('root'));
    expect(service.getRoot()).toEqual(new Folder('root'));
  });

  it('should properly init models', () => {
    const folder = new Folder('test');
    const folders = [folder];
    const items = [];
    const root = new Folder('root', folders, items);
    expect(root.getClassName()).toEqual('Folder');

    const container = new Container(root, new Options(), 1.1);
    expect(container.getVersion()).toEqual(1.1);
    expect(container.getClassName()).toEqual('Container');
  });
});
