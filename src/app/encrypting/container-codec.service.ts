import { Injectable } from '@angular/core';
import { CryptoJsEnvelope, isCryptoJsEnvelope } from './container-envelope';
import { EncryptingService } from './encrypting.service';

export const MAX_CONTAINER_INPUT_LENGTH = 10 * 1024 * 1024;

const LEGACY_OPENSSL_PREFIX = 'U2FsdGVkX1';

@Injectable()
export class ContainerCodecService {
  constructor(private encrypting: EncryptingService) {}

  encode(plaintext: string): string {
    const data = this.encrypting.encrypt(plaintext);
    if (!data) {
      throw new Error('Unable to encrypt container');
    }

    const envelope: CryptoJsEnvelope = {
      format: 'keyholder',
      v: 2,
      kdf: {
        name: 'cryptojs-evp-bytes-to-key',
        hash: 'md5',
        iterations: 1,
      },
      cipher: {
        name: 'aes-256-cbc',
        padding: 'pkcs7',
      },
      data,
    };

    return JSON.stringify(envelope);
  }

  decode(value: string): string {
    if (typeof value !== 'string' || !value) {
      throw new Error('Container is empty');
    }
    if (value.length > MAX_CONTAINER_INPUT_LENGTH) {
      throw new Error('Container exceeds the input size limit');
    }

    const ciphertext = value.startsWith(LEGACY_OPENSSL_PREFIX)
      ? value
      : this.getEnvelopeCiphertext(value);
    const plaintext = this.encrypting.decrypt(ciphertext);
    if (!plaintext) {
      throw new Error('Unable to decrypt container');
    }

    return plaintext;
  }

  private getEnvelopeCiphertext(value: string): string {
    let envelope: unknown;
    try {
      envelope = JSON.parse(value);
    } catch {
      throw new Error('Container has an unsupported format');
    }

    if (!isCryptoJsEnvelope(envelope)) {
      throw new Error('Container has an unsupported or invalid envelope');
    }
    return envelope.data;
  }
}
