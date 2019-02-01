import { inject, TestBed } from '@angular/core/testing';
import { AES } from 'crypto-js';

import { User } from '../auth/model';
import { EncryptingService } from './encrypting.service';

describe('EncryptingService', () => {
    let service: EncryptingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EncryptingService
            ]
        });
    });

    beforeEach(inject([EncryptingService], (encryptingService: EncryptingService) => {
        service = encryptingService;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return null without specified user', () => {
        expect(service.getUser()).toBeNull();
        expect(service.getLogin()).toBeNull();
        expect(service.getSecret()).toBeNull();
        expect(service.encrypt('test')).toBeNull();
        expect(service.decrypt('test')).toBeNull();
    });

    it('should set user', () => {
        const username = 'some@example.com';
        const password = 'secret';
        const user = new User(username, password);

        service.setUser(user);
        expect(service.getUser()).toEqual(user);
    });

    it('should get login hash', () => {
        const username = 'some@example.com';
        const password = 'secret';
        const user = new User(username, password);

        service.setUser(user);

        const hash = '605001639c8e97e3f8320e73d494b28a118e59643edb711071aa82aa6cf5991a';
        expect(service.getLogin()).toEqual(hash);
    });

    it('should get secret hash', () => {
        const username = 'some@example.com';
        const password = 'secret';
        const user = new User(username, password);

        service.setUser(user);

        const hash = '7bed9582cee5a6a268b98a98214e42180c5700b135e0453351b2a4a5e033dc39';
        expect(service.getSecret()).toEqual(hash);
    });

    it('should encrypt data', () => {
        const username = 'some@example.com';
        const password = 'secret';
        const user = new User(username, password);

        service.setUser(user);

        const data = 'Hello virtual world!';
        const encryptedData = 'dgdh gfdhgfd hgfdhgfdh gd h';

        // for some reason original AES.encrypt and AES.decrypt fail
        AES.encrypt = jasmine.createSpy().and.returnValue(encryptedData);
        AES.decrypt = jasmine.createSpy().and.returnValue(data);

        expect(service.encrypt(data)).toEqual(encryptedData);
        expect(service.decrypt(encryptedData)).toEqual(data);

        expect(AES.encrypt).toHaveBeenCalledWith(data, password);
        expect(AES.decrypt).toHaveBeenCalledWith(encryptedData, password);
    });
});
