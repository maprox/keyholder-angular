import { TestBed, inject } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';

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
        const root = service.getRoot();
        expect(service.isRoot()).toBeTruthy();
        expect(service.isRoot(root)).toBeTruthy();
        expect(service.isRoot(new Folder())).toBeFalsy();
        expect(service.isRoot(root)).toBeTruthy();
    });

    it('should change folder', () => {
        const root = service.getRoot();
        const level1 = root.add(new Folder('level1')) as Folder;
        const level2 = new Folder('level2');

        service.openFolder(level1);

        expect(service.getPathAsString()).toEqual('/level1');

        service.openFolder(level2);

        expect(service.getPathAsString()).toEqual('/level1');

        service.openFolder(level1.add(level2) as Folder);

        expect(service.getPathAsString()).toEqual('/level1/level2');

        service.openFolder(level1);

        expect(service.getPathAsString()).toEqual('/level1');
    });

    it('should return parent folder', () => {
        const root = service.getRoot();
        expect(service.getParent()).toBeNull();

        const level1 = root.add(new Folder('level1')) as Folder;

        service.openFolder(level1);

        expect(service.getParent()).toEqual(root);
    });

    it('should return path', () => {
        const root = service.getRoot();
        const mat = root.add(new Folder('mat')) as Folder;

        mat.add(new Folder('reshka'));

        service.openPath('///mat///reshka');

        expect(service.getPathAsString()).toEqual('/mat/reshka');
    });

    it('should save to storage', () => {
        const root = service.getRoot();

        service.save();

        expect(storageApiServiceMock.save).toHaveBeenCalledWith(root);
    });

    it('should load from storage', () => {
        service.load();

        const root = new Folder('root');
        const container = new Container(root, new Options());

        (root.add(new Folder('l1')) as Folder).add(new Folder('l2'));

        storageApiSubject.next(container);

        expect(service.getPathAsString()).toEqual('/');

        service.load('/l1/l2');

        expect(service.getPathAsString()).toEqual('/l1/l2');
        expect(storageApiServiceMock.load).toHaveBeenCalledTimes(1);
    });

    it('should clear cache when logged out', () => {
        service.load();

        storageApiSubject.next();

        expect(service.getPathAsString()).toEqual('/');

        service.load('/l1/l2');
        service.load('/l1/l2');

        expect(service.getPathAsString()).toEqual('/');
        expect(storageApiServiceMock.load).toHaveBeenCalledTimes(1);

        authSubject.next(true); // log out
        storageApiServiceMock.load.calls.reset();
        expect(storageApiServiceMock.load).toHaveBeenCalledTimes(0);

        service.load();
        expect(storageApiServiceMock.load).toHaveBeenCalledTimes(0);

        authSubject.next(false); // log out
        storageApiServiceMock.load.calls.reset();
        expect(storageApiServiceMock.load).toHaveBeenCalledTimes(0);

        service.load('/l1/l2');
        expect(storageApiServiceMock.load).toHaveBeenCalledTimes(1);
    });
});
