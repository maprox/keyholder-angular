export type Base64 = string;

export interface KeyholderEnvelopeBase {
  readonly format: 'keyholder';
  readonly v: 2;
  readonly data: Base64;
}

export interface CryptoJsEvpBytesToKeyKdf {
  readonly name: 'cryptojs-evp-bytes-to-key';
  readonly hash: 'md5';
  readonly iterations: 1;
}

export interface Aes256CbcCipher {
  readonly name: 'aes-256-cbc';
  readonly padding: 'pkcs7';
}

export interface CryptoJsEnvelope extends KeyholderEnvelopeBase {
  readonly kdf: CryptoJsEvpBytesToKeyKdf;
  readonly cipher: Aes256CbcCipher;
}

export interface Argon2idKdf {
  readonly name: 'argon2id';
  readonly m: number;
  readonly t: number;
  readonly p: number;
  readonly salt: Base64;
}

export interface Aes256GcmCipher {
  readonly name: 'aes-256-gcm';
  readonly nonce: Base64;
}

export interface AesGcmEnvelope extends KeyholderEnvelopeBase {
  readonly kdf: Argon2idKdf;
  readonly cipher: Aes256GcmCipher;
}

export type KeyholderEnvelope = CryptoJsEnvelope | AesGcmEnvelope;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBase64(value: unknown): value is Base64 {
  return typeof value === 'string'
    && value.length > 0
    && value.length % 4 === 0
    && /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

export function isCryptoJsEnvelope(value: unknown): value is CryptoJsEnvelope {
  if (!isRecord(value) || !isRecord(value.kdf) || !isRecord(value.cipher)) {
    return false;
  }

  return value.format === 'keyholder'
    && value.v === 2
    && value.kdf.name === 'cryptojs-evp-bytes-to-key'
    && value.kdf.hash === 'md5'
    && value.kdf.iterations === 1
    && value.cipher.name === 'aes-256-cbc'
    && value.cipher.padding === 'pkcs7'
    && isBase64(value.data);
}
