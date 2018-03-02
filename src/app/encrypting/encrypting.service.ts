import { Injectable } from '@angular/core';
import { AES, enc, SHA256 } from 'crypto-js';

import { User } from '../auth/model';
import { SerializerService } from '../serializer';

@Injectable()
export class EncryptingService {
    private user: User;

    constructor() { }

    setUser(user: User) {
        this.user = user;
        sessionStorage.setItem('user', JSON.stringify(this.user));
    }

    getUser(): User {
        if (this.user === undefined) {
            this.user = JSON.parse(
                sessionStorage.getItem('user'),
                SerializerService.getReviver({'User': User})
            );
        }
        return this.user;
    }

    getSecret(): string {
        const user = this.getUser();
        if (!user) {
            return null;
        }
        return SHA256(user.getUsername() + ':' + user.getPassword()).toString();
    }

    encrypt(data: string): string {
        const user = this.getUser();
        if (!user || !data) {
            return null;
        }
        return AES.encrypt(data, user.getPassword()).toString();
    }

    decrypt(data: string): string {
        const user = this.getUser();
        if (!user || !data) {
            return null;
        }
        return AES.decrypt(data, user.getPassword()).toString(enc.Utf8);
    }
}
