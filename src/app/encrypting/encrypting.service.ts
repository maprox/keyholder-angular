import { Injectable } from '@angular/core';
import { AES, SHA256, enc } from 'crypto-js';

import { User } from '../auth/model';

@Injectable()
export class EncryptingService {
    private user: User;

    constructor() { }

    setUser(user: User) {
        this.user = user;
    }

    getUser(): User {
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
