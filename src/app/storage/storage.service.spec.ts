import { TestBed, inject } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../auth';
import { StorageApiService } from './storage-api.service';

import { StorageService } from './storage.service';

describe('StorageService', () => {
    let storageApiServiceMock,
        isLoggedIn = true,
        authSubject: Subject<Object>,
        authServiceMock: any;

    beforeEach(() => {
        storageApiServiceMock = {};
        authSubject = new Subject<Object>();
        authServiceMock = {
            isLoggedIn() {
                return isLoggedIn;
            },
            getAuthEvent() {
                return authSubject.asObservable();
            },
            signIn: jasmine.createSpy(),
            signUp: jasmine.createSpy()
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

    it('should be created', inject([StorageService], (service: StorageService) => {
        expect(service).toBeTruthy();
    }));
});
