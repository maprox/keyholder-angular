import { Injectable } from '@angular/core';
import { AES, enc, SHA256 } from 'crypto-js';

import { User } from '../auth/model';

const HASH_CALCULATION_ITERATIONS_COUNT = 1;

@Injectable()
export class EncryptingService {
  private user: User = null;

  constructor() { }

  setUser(user: User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  getHash(value): string {
      let hash = value;
      for (let count = 0; count < HASH_CALCULATION_ITERATIONS_COUNT; count += 1) {
          hash = SHA256(hash).toString();
      }
      return hash;
  }

  getLogin(): string {
    const user = this.getUser();
    if (!user) {
      return null;
    }
    return this.getHash(user.getUsername());
  }

  getSecret(): string {
    const user = this.getUser();
    if (!user) {
      return null;
    }
    return this.getHash(user.getUsername() + ':' + user.getPassword());
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
