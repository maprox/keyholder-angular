import { User } from '../auth/model';
import { ContainerCodecService, MAX_CONTAINER_INPUT_LENGTH } from './container-codec.service';
import { CryptoJsEnvelope } from './container-envelope';
import { EncryptingService } from './encrypting.service';

describe('ContainerCodecService', () => {
  const password = 'correct horse battery staple';
  const legacyPlaintext = 'Legacy контейнер 🔐';
  const legacyCiphertext = 'U2FsdGVkX1+s5TVV/Xo7CycKkAFK0SNJAd6tiVxFuWDAlv5lN2wblkYIpYIz7Hk2';
  let encrypting: EncryptingService;
  let service: ContainerCodecService;

  beforeEach(() => {
    encrypting = new EncryptingService();
    encrypting.setUser(new User('some@example.com', password));
    service = new ContainerCodecService(encrypting);
  });

  it('round-trips Unicode plaintext in a v2 CryptoJS envelope', () => {
    const plaintext = '{"message":"Пароль 🔐","value":"p@ss:%20"}';

    const encoded = service.encode(plaintext);
    const envelope = JSON.parse(encoded) as CryptoJsEnvelope;

    expect(envelope).toEqual({
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
      data: envelope.data,
    });
    expect(envelope.data).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    expect(envelope.data.length).toBeGreaterThan(0);
    expect(service.decode(encoded)).toBe(plaintext);
  });

  it('decrypts a fixed raw legacy container', () => {
    expect(service.decode(legacyCiphertext)).toBe(legacyPlaintext);
  });

  it('decrypts the same CryptoJS payload in raw and v2 representations', () => {
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
      data: legacyCiphertext,
    };

    expect(service.decode(JSON.stringify(envelope))).toBe(legacyPlaintext);
    expect(service.decode(legacyCiphertext)).toBe(legacyPlaintext);
  });

  it('rejects a wrong password', () => {
    encrypting.setUser(new User('some@example.com', 'wrong password'));

    expect(() => service.decode(legacyCiphertext)).toThrow();
  });

  it('rejects corrupted Base64 and malformed JSON', () => {
    expect(() => service.decode(`${legacyCiphertext.slice(0, 20)}!invalid`)).toThrow();
    expect(() => service.decode('{')).toThrow();
    expect(() => service.decode('not-a-container')).toThrow();
    expect(() => service.decode('')).toThrow();
  });

  it('rejects unknown formats and newer envelope versions', () => {
    const envelope = JSON.parse(service.encode('test'));

    expect(() => service.decode(JSON.stringify({...envelope, format: 'other'}))).toThrow();
    expect(() => service.decode(JSON.stringify({...envelope, v: 3}))).toThrow();
  });

  it('rejects unsupported KDF and cipher profiles before decrypting', () => {
    const envelope = JSON.parse(service.encode('test'));
    const decrypt = spyOn(encrypting, 'decrypt').and.callThrough();
    const modernWithExcessiveCosts = {
      format: 'keyholder',
      v: 2,
      kdf: {
        name: 'argon2id',
        m: 1024 * 1024 * 1024,
        t: 1000,
        p: 1024,
        salt: 'c2FsdA==',
      },
      cipher: {
        name: 'aes-256-gcm',
        nonce: 'bm9uY2U=',
      },
      data: envelope.data,
    };

    expect(() => service.decode(JSON.stringify({...envelope, kdf: {...envelope.kdf, name: 'unknown'}}))).toThrow();
    expect(() => service.decode(JSON.stringify({...envelope, cipher: {...envelope.cipher, name: 'unknown'}}))).toThrow();
    expect(() => service.decode(JSON.stringify(modernWithExcessiveCosts))).toThrow();
    expect(decrypt).not.toHaveBeenCalled();
  });

  it('rejects missing and inconsistent CryptoJS fields', () => {
    const envelope = JSON.parse(service.encode('test'));
    const {data, ...withoutData} = envelope;

    expect(() => service.decode(JSON.stringify(withoutData))).toThrow();
    expect(() => service.decode(JSON.stringify({...envelope, kdf: {...envelope.kdf, iterations: 2}}))).toThrow();
    expect(() => service.decode(JSON.stringify({...envelope, kdf: {...envelope.kdf, hash: 'sha256'}}))).toThrow();
    expect(() => service.decode(JSON.stringify({...envelope, cipher: {...envelope.cipher, padding: 'none'}}))).toThrow();
  });

  it('enforces the encoded input limit before decrypting', () => {
    const decrypt = jasmine.createSpy('decrypt').and.returnValue('plaintext');
    const encryptingSpy = {decrypt} as unknown as EncryptingService;
    const limitedService = new ContainerCodecService(encryptingSpy);
    const prefix = 'U2FsdGVkX1';
    const atLimit = prefix + 'A'.repeat(MAX_CONTAINER_INPUT_LENGTH - prefix.length);
    const oversized = prefix + 'A'.repeat(MAX_CONTAINER_INPUT_LENGTH - prefix.length + 1);

    expect(limitedService.decode(atLimit)).toBe('plaintext');
    expect(() => limitedService.decode(oversized)).toThrow();
    expect(decrypt).toHaveBeenCalledTimes(1);
  });
});
