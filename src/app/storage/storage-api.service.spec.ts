import { inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs/index';

import { EncryptingService } from '../encrypting';
import { Folder, Secret } from './model';
import { HttpService } from '../http';
import { StorageApiService } from './storage-api.service';

describe('StorageApiService', () => {
    let service: StorageApiService,
        httpService,
        encryptingService,
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
        const encryptedRoot = 'EnCr YPt=eeed!';
        encryptingService.encrypt.and.returnValue(encryptedRoot);

        service.save(root);

        expect(encryptingService.encrypt).toHaveBeenCalledWith(JSON.stringify(root));
        expect(httpService.put).toHaveBeenCalledWith('/storage', {
            data: encodeURIComponent(encryptedRoot)
        });

        expect(localStorage.getItem('storage')).toEqual(null);

        httpClientSubject.next();

        expect(localStorage.getItem('storage')).toEqual(encodeURIComponent(encryptedRoot));
        localStorage.clear();
        expect(localStorage.getItem('storage')).toEqual(null);

        httpClientSubject.error();

        expect(localStorage.getItem('storage')).toEqual(encodeURIComponent(encryptedRoot));
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
        const encryptedRoot = 'EnCr YPt=eeed!';
        const root = getRoot();
        const data = JSON.stringify(root);

        service.load().subscribe(onSuccess, onFailure);

        encryptingService.decrypt.and.returnValue(data);
        httpClientSubject.next(encryptedRoot);
        expect(encryptingService.decrypt).toHaveBeenCalledWith(encryptedRoot);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onSuccess).toHaveBeenCalledWith(root);
        expect(onFailure).toHaveBeenCalledTimes(0);
    });

    it('should load data from localStorage', () => {
        const onSuccess = jasmine.createSpy();
        const onFailure = jasmine.createSpy();
        const encryptedRoot = 'EnCr YPt=eeed!';
        const root = getRoot();
        const data = JSON.stringify(root);

        service.load().subscribe(onSuccess, onFailure);

        localStorage.setItem('storage', encryptedRoot);
        encryptingService.decrypt.and.returnValue(data);
        httpClientSubject.error();
        expect(encryptingService.decrypt).toHaveBeenCalledWith(encryptedRoot);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onSuccess).toHaveBeenCalledWith(root);
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
