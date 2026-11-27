# Versioned container format design

**Date:** 2026-11-26  
**Repo:** `maprox/keyholder-angular`  
**Status:** Approved for implementation

## Intent

Introduce a versioned, self-describing container envelope while keeping the existing CryptoJS encryption unchanged for the first iteration. This separates container-format evolution from the later cryptographic migration and lets raw legacy containers move to the new envelope without changing their plaintext or encryption operation.

The current raw CryptoJS representation is a transition-only legacy input. New application versions must read it, but all new saves and exports use the versioned envelope.

## Current state

- `EncryptingService` calls `AES.encrypt(data, password).toString()` and `AES.decrypt(...)` from CryptoJS.
- `StorageApiService.getEncryptedContainer()` URI-encodes the resulting OpenSSL-compatible string.
- The same encoded string is sent in the `data` form field, stored in `localStorage`, and written to `.kh` backups.
- `loadContainer()` currently expects a decoded raw CryptoJS string, decrypts it, and parses the plaintext JSON into `Container`.
- `Container.version` is inside the encrypted plaintext and cannot select a decryption algorithm. It remains an independent schema-version field.

## Goals

- Detect and read raw legacy containers and versioned `v2` envelopes.
- Describe the KDF and cipher in the envelope rather than inferring them from the ciphertext.
- Keep format version independent from algorithm profile: adding Argon2id/AES-GCM later does not require an envelope version bump.
- Preserve the existing server API, `localStorage` fallback, and `.kh` import/export transport.
- Migrate raw legacy input to `v2 + CryptoJS` on the next successful save.
- Reject malformed or unsupported containers without silently creating an empty replacement.

## Non-goals and anti-goals

- No revision history, container-state versioning, rollback protection, or multi-device conflict resolution.
- No server authentication or backend API redesign.
- No change to `Container.version` or the plaintext folder/secret schema in the first iteration.
- No claim that wrapping CryptoJS improves confidentiality or integrity.
- No Argon2id implementation or new cryptographic dependency in the first iteration.
- No continued writes in the raw legacy representation.

## Approaches considered

### Self-describing JSON envelope — selected

The envelope contains `format`, `v`, named KDF and cipher profiles with their parameters, and `data`. It makes algorithm evolution explicit and permits future KDF cost changes without changing the envelope parser.

### Fixed cryptographic profile per version — rejected

A version-only header would be smaller, but changing KDF parameters or algorithms would require a new format version and another decoder migration. This works against the goal of independent format and algorithm evolution.

### Custom binary header — rejected

A binary format would save little space for this application while making backups, debugging, validation, and migrations harder to inspect and test.

## Envelope model

The transport remains the URI-encoded representation returned by `getEncryptedContainer()`. After the existing single URI decode, a new container is a JSON object matching the relevant profile.

New backups use the `.kh2` extension, which denotes envelope version `v2`, not a particular cryptographic strength. The import file picker accepts both `.kh` and `.kh2`. Extensions are only user-interface hints: decoding still depends on the validated contents, so a renamed file follows the same content-detection path and is never assigned an algorithm from its filename. Server and `localStorage` payloads have no filename and are unaffected. A future incompatible envelope `v3` may use `.kh3`; adding another cryptographic profile within `v2` does not change the extension.

```ts
type Base64 = string;

interface KeyholderEnvelopeBase {
  readonly format: 'keyholder';
  readonly v: 2;
  readonly data: Base64;
}

interface CryptoJsEvpBytesToKeyKdf {
  readonly name: 'cryptojs-evp-bytes-to-key';
  readonly hash: 'md5';
  readonly iterations: 1;
}

interface Aes256CbcCipher {
  readonly name: 'aes-256-cbc';
  readonly padding: 'pkcs7';
}

interface CryptoJsEnvelope extends KeyholderEnvelopeBase {
  readonly kdf: CryptoJsEvpBytesToKeyKdf;
  readonly cipher: Aes256CbcCipher;
}

interface Argon2idKdf {
  readonly name: 'argon2id';
  readonly m: number; // memory cost in KiB
  readonly t: number; // passes over memory
  readonly p: number; // parallelism/lanes
  readonly salt: Base64;
}

interface Aes256GcmCipher {
  readonly name: 'aes-256-gcm';
  readonly nonce: Base64; // 12 bytes for the future profile
}

interface AesGcmEnvelope extends KeyholderEnvelopeBase {
  readonly kdf: Argon2idKdf;
  readonly cipher: Aes256GcmCipher;
}

type KeyholderEnvelope = CryptoJsEnvelope | AesGcmEnvelope;
```

Only `CryptoJsEnvelope` is implemented in the first iteration. The Argon2id/AES-GCM declarations document the agreed extension shape; they are not a requirement to add that algorithm now.

For CryptoJS, `data` is the existing `AES.encrypt(...).toString()` output. Its OpenSSL-compatible representation contains the salt; the IV is derived by EVP_BytesToKey. No duplicate `salt` or `nonce` fields are added.

For the future AES-GCM profile, `data` contains ciphertext followed by the 128-bit authentication tag. The complete header must be authenticated as AAD using a deterministic encoding defined with that profile. AES-GCM must not reuse a nonce with the same key.

## Decoding and migration

Decoding is explicit and fail-closed:

1. Apply the existing transport URI decode exactly once.
2. If the decoded value is a valid `keyholder` envelope, validate its version and select a registered decoder from `kdf.name` and `cipher.name`.
3. Otherwise, attempt the raw legacy CryptoJS decoder.
4. Reject unknown format names, unsupported envelope versions, unknown algorithm names, invalid fields, and decryption failures.
5. Only a genuinely absent container may initialize a new empty `Container`. Invalid or unsupported existing data must surface an error and must not be replaced or saved automatically.

The first successful save of a raw legacy container serializes the current plaintext `Container` and encrypts it with the existing CryptoJS operation, then wraps the result in `CryptoJsEnvelope`. Subsequent saves also write `CryptoJsEnvelope` until the modern profile is introduced.

Old application versions cannot read the new envelope even though its cryptographic operation is unchanged. This is an accepted one-way forward migration; the new application remains backward-readable.

## Validation and profile registry

- TypeScript interfaces do not replace runtime validation of parsed JSON.
- Use explicit runtime guards and a fixed profile registry; do not dynamically instantiate properties named by input.
- The CryptoJS profile accepts exactly `md5`, one iteration, AES-256-CBC, and PKCS7.
- Enforce input and decoded-size limits appropriate to the existing storage before expensive decoding or decryption.
- Reject extra or missing discriminator fields when they make the profile ambiguous. Unknown versions and profiles must produce an unsupported-container error, not a fallback to another algorithm.
- The future Argon2id profile must define safe lower and upper bounds for `m`, `t`, and `p`, plus salt, nonce, tag, and ciphertext lengths, before performing KDF work. Example values `m=65536`, `t=3`, `p=1` are illustrative, not final parameters.

## First-iteration code boundaries

Expected areas of change:

- Add envelope/profile types, runtime guards, and raw-legacy/envelope decoding near the existing encryption code.
- Keep CryptoJS encrypt/decrypt behavior in the legacy cryptographic profile.
- Adapt `StorageApiService` so load, save, `localStorage`, import, and export all use the same codec rather than maintaining separate format logic.
- Preserve `EncryptingService`'s user/password lifecycle and the existing authentication requests; changing that design is outside this iteration.
- Update tests that currently assume every saved value is a raw CryptoJS string.

## Verification

Cover the real paths with existing Jasmine/Karma tooling:

- Decrypt a fixed raw legacy ciphertext and preserve its plaintext `Container` data.
- Round-trip plaintext through `v2 + CryptoJS` and verify the envelope fields and decrypted content.
- Save a loaded raw legacy container and verify that only the `v2` representation is written to API/local storage/export paths.
- Import both `.kh` and `.kh2`, export new backups as `.kh2`, and verify that filename changes do not affect content detection.
- Import and export the same `v2` representation without an extra or missing URI encoding layer.
- Reject unknown `format`, unsupported `v`, unknown KDF/cipher, malformed Base64/JSON, wrong passwords, and corrupted ciphertext without replacing existing data.
- Confirm absent storage still creates a new container.
- Run the production build and the existing unit-test suite.

## Later cryptographic iteration

Add Argon2id/AES-GCM as another profile within envelope `v2`. New saves then use the modern profile while raw legacy and `v2 + CryptoJS` remain readable during the migration period. Raw legacy and CryptoJS envelope writes are disabled once the modern writer is enabled; legacy readers are removed only under a separately agreed end-of-life policy.

## Decisions left to the builder

- Exact file/module names for the codec and profile registry, following the current Angular structure.
- Concrete runtime-guard implementation without adding a validation dependency unless one is justified.
- Error presentation text and the smallest UI/service changes needed to prevent invalid data from being treated as absent storage.
- Exact size limits, based on current usage and test coverage.
