# Versioned Container Format Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a validated `v2` JSON envelope using the existing CryptoJS encryption, migrate raw legacy containers on save, and export new backups as `.kh2`.

**Architecture:** A new `ContainerCodecService` owns raw-legacy detection, envelope validation, and CryptoJS encrypt/decrypt dispatch. `StorageApiService` delegates all container encoding to that codec and distinguishes absent storage from invalid existing data; import/export continues to use the same URI-encoded transport.

**Tech Stack:** Angular 22, TypeScript 6, CryptoJS 4.1.1, Jasmine/Karma, existing Angular forms and file-saver integration.

**Spec:** `docs/superpowers/specs/2026-11-26-versioned-container-format-design.md`

## Global Constraints

- First iteration uses the existing CryptoJS operation unchanged; do not add Argon2id, AES-GCM, or any dependency.
- Read raw legacy and `v2 + CryptoJS`; write only `v2 + CryptoJS`.
- Preserve the current single `encodeURIComponent`/`decodeURIComponent` transport layer.
- Keep `Container.version`, plaintext schema, authentication requests, backend API, and `localStorage` key unchanged.
- New exports use `.kh2`; import accepts `.kh` and `.kh2`, but only file contents select the decoder.
- Invalid or unsupported existing data must not initialize or overwrite an empty container.
- Do not change unrelated security findings or refactor unrelated modules.
- Do not commit or push unless the user explicitly requests it.

## Review Focus

- Unknown or newer envelope versions: reject explicitly instead of trying raw legacy or another algorithm; pinned by Task 1 unsupported-version tests.
- Structurally valid JSON with missing/invalid discriminators or dangerous future KDF parameters: reject before decryption/KDF work; pinned by Task 1 validation tests.
- Wrong passwords and corrupted ciphertext: surface a load error and preserve existing state; pinned by Task 1 decode tests and Task 2 fail-closed tests.
- Empty, malformed, and genuinely absent storage: only absent storage creates a new container; pinned by Task 2 absent-versus-invalid tests.
- URI encoding and renamed backups: decode exactly once and select by content, never extension; pinned by Task 1 round trips and Task 3 import/export tests.
- Oversized input: reject above the codec's documented encoded-input limit before Base64/decryption work; pinned by Task 1 limit-boundary tests.

---

### Task 1: Envelope Types and Container Codec

**Files:**
- Create: `src/app/encrypting/container-envelope.ts`
- Create: `src/app/encrypting/container-codec.service.ts`
- Create: `src/app/encrypting/container-codec.service.spec.ts`
- Modify: `src/app/encrypting/index.ts`
- Modify: `src/app/storage/storage.module.ts`

**Interfaces:**
- Consumes: existing `EncryptingService.encrypt(data: string): string`, `decrypt(data: string): string`, and `setUser(user: User)`.
- Produces: `ContainerCodecService.encode(plaintext: string): string`, returning an unencoded `v2` JSON string.
- Produces: `ContainerCodecService.decode(value: string): string`, accepting one-time-URI-decoded raw legacy or `v2` JSON and returning plaintext.
- Produces: envelope interfaces and `CryptoJsEnvelope` exactly as defined in the spec; future Argon2id/AES-GCM types are declarations only.

- [ ] **Step 1: Write failing codec tests**

Create `container-codec.service.spec.ts` using real `EncryptingService` and `ContainerCodecService` instances with `User('some@example.com', 'correct horse battery staple')`. Cover:

- `encode()` returns JSON with `format: 'keyholder'`, `v: 2`, exact CryptoJS KDF/cipher discriminators, and a nonempty Base64 `data` value; `decode()` returns the original plaintext including Unicode.
- A fixed raw legacy CryptoJS fixture decrypts to a fixed plaintext. Generate the fixture once with the existing CryptoJS passphrase API, then paste the complete resulting Base64 value into the test rather than generating it during each run.
- The raw fixture and a `.kh2`-style JSON string produce the same plaintext when they contain the same logical data.
- Wrong passwords, truncated/corrupted Base64, malformed JSON, unknown `format`, `v: 3`, unknown KDF/cipher names, an `argon2id` profile with excessive `m`/`t`/`p`, missing `data`, `iterations: 2`, `hash: 'sha256'`, and wrong padding all throw before unsupported KDF work.
- Input exactly at the exported encoded-size limit is processed; input one character above it throws before `EncryptingService.decrypt` is called. Use a spy for this boundary test.
- No test mocks CryptoJS itself for the real raw-legacy and round-trip cases.

- [ ] **Step 2: Run the new spec and verify RED**

Run:

```bash
npx ng test --watch=false --browsers=ChromeHeadless --include=src/app/encrypting/container-codec.service.spec.ts
```

Expected: FAIL because `ContainerCodecService` and the envelope module do not exist.

- [ ] **Step 3: Implement the envelope model and runtime guards**

In `container-envelope.ts`, add the spec's `Base64`, base envelope, CryptoJS, future Argon2id/AES-GCM, and union interfaces. Export a `CryptoJsEnvelope` type guard that validates parsed `unknown` input and all exact discriminators; future profiles are not accepted by the first-iteration codec.

In `container-codec.service.ts`, implement:

```ts
@Injectable()
export class ContainerCodecService {
  constructor(private encrypting: EncryptingService) {}

  encode(plaintext: string): string;
  decode(value: string): string;
}
```

`encode()` encrypts with the existing service and wraps the result in `CryptoJsEnvelope`. `decode()` recognizes raw legacy only by the OpenSSL `Salted__` Base64 prefix (`U2FsdGVkX1`), otherwise parses and validates the JSON envelope, then calls the same existing decrypt operation. Reject empty, malformed, unsupported, oversized, and undecryptable input with an `Error`; never fall back from a recognized but invalid envelope to raw legacy.

Define one exported encoded-input size constant with a documented value appropriate for the existing browser storage. No new library or dynamic property-based decoder lookup.

- [ ] **Step 4: Register and export the codec**

Add `ContainerCodecService` to `StorageModule.providers` and export it plus the envelope types from `src/app/encrypting/index.ts`. Keep `EncryptingService` registered where it is today.

- [ ] **Step 5: Run the codec spec and verify GREEN**

Run the Step 2 command again.

Expected: PASS, including fixed legacy fixture, real encryption round trip, malformed inputs, and size boundary.

### Task 2: Storage Migration and Fail-Closed Loading

**Files:**
- Modify: `src/app/storage/storage-api.service.ts`
- Modify: `src/app/storage/storage-api.service.spec.ts`

**Interfaces:**
- Consumes: `ContainerCodecService.encode()` and `.decode()` from Task 1.
- Produces: `StorageApiService.getEncryptedContainer()` returns `encodeURIComponent(codec.encode(container.serialize()))`.
- Produces: `StorageApiService.loadContainer(data)` accepts decoded raw legacy or `v2`; invalid input returns `null` for the existing import UI, while `loadData()` reports the error without creating a replacement container.

- [ ] **Step 1: Replace encryption spies with codec spies and write failing migration tests**

Update `storage-api.service.spec.ts` providers to supply `ContainerCodecService` with `encode`/`decode` spies and `AlertService` with an `error` spy. Adapt existing assertions from `encryptingService.encrypt/decrypt` to the codec.

Add tests proving:

- Saving serializes the current `Container`, calls `codec.encode`, and sends/stores exactly one URI-encoded layer.
- A raw legacy value returned by the server is passed to `codec.decode`, and the next save writes the codec's `v2` JSON value.
- HTTP failure still loads the same codec path from `localStorage`.
- `null`/`undefined` absent storage creates the initial `Container` and emits it.
- An empty string and invalid nonempty server or local data emit no container, call `AlertService.error`, leave the current container unset, and do not call `passwordGenerator.setOptions` or save.
- Logout followed by an invalid load still cannot expose or overwrite the previous container.

- [ ] **Step 2: Run the storage spec and verify RED**

Run:

```bash
npx ng test --watch=false --browsers=ChromeHeadless --include=src/app/storage/storage-api.service.spec.ts
```

Expected: FAIL because `StorageApiService` still calls `EncryptingService` and converts failed decryption into an initial container.

- [ ] **Step 3: Integrate the codec and separate absent from invalid data**

In `storage-api.service.ts`, replace the `EncryptingService` dependency with `ContainerCodecService` and inject `AlertService`. Keep the existing JSON reviver and model construction.

Change only these responsibilities:

- `loadContainer()` calls `codec.decode(data)` and then parses the plaintext; it returns `null` on decode/decrypt/parse failure as the import component already expects.
- `getEncryptedContainer()` calls `codec.encode(this.container.serialize())` and applies the existing single `encodeURIComponent`.
- `loadData()` initializes a new `Container` only when storage is genuinely absent. For nonempty invalid input it leaves state unchanged, reports a concise load error through `AlertService`, and does not emit a replacement container.

Do not add automatic save after failure or a second URI decode.

- [ ] **Step 4: Run the storage spec and verify GREEN**

Run the Step 2 command again.

Expected: PASS for legacy load, v2 save, local fallback, absent initialization, invalid-data rejection, and logout behavior.

### Task 3: `.kh2` Export and Dual-Extension Import

**Files:**
- Modify: `src/app/import-export/export/export.component.ts`
- Modify: `src/app/import-export/export/export.component.spec.ts`
- Modify: `src/app/import-export/import/import.component.html`
- Modify: `src/app/import-export/import/import.component.spec.ts`

**Interfaces:**
- Consumes: the existing `StorageApiService.getEncryptedContainer()` and `FileIoService` transport unchanged.
- Produces: filenames `storage-backup-<yyyy-MM-ddTHH-mm-ss>.kh2` and file input `accept=".kh,.kh2"`.

- [ ] **Step 1: Write failing filename and picker tests**

Update the export expectation to `storage-backup-2015-02-23T10-30-50.kh2`. Add an import spec assertion that the native file input's `accept` attribute is exactly `.kh,.kh2`. Add an import case whose file is named `renamed.kh` but whose content is the same mocked valid `v2` payload used for `.kh2`; assert the normal `loadContainer`/save path and no filename-based algorithm selection.

- [ ] **Step 2: Run import/export specs and verify RED**

Run:

```bash
npx ng test --watch=false --browsers=ChromeHeadless --include=src/app/import-export/**/*.spec.ts
```

Expected: the old `.kh` filename expectation and old accept attribute fail.

- [ ] **Step 3: Implement the extension changes**

Change only `ExportComponent.getFilename()` to suffix `.kh2` and the import input to `accept=".kh,.kh2"`. Do not add filename parsing or change Blob MIME type, `FileIoService`, or URI handling.

- [ ] **Step 4: Run import/export specs and verify GREEN**

Run the Step 2 command again.

Expected: PASS for `.kh2` export, dual-extension picker, and content-based import.

### Task 4: Full Regression and Deliverable Verification

**Files:**
- Modify only if a regression directly caused by this change is found.
- Remove only generated artifacts created by these verification runs that are not needed in the deliverable.

- [ ] **Step 1: Run the complete unit-test suite**

Run:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Expected: all existing and new Jasmine tests pass. Fix only regressions related to the codec, storage, or import/export changes.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0 with the production configuration, no new TypeScript or Angular template errors.

- [ ] **Step 3: Verify the actual migration path**

Using the real services in the integration specs or a browser smoke run, exercise: raw legacy load → decrypt existing secrets → save → inspect the URI-decoded payload as `v2 + CryptoJS` → reload → export `.kh2` → import it back. Confirm plaintext secrets and `Container.version` are unchanged and no extra URI decode is required by callers.

Expected: the complete cycle preserves data and produces only the new representation on save/export.

- [ ] **Step 4: Inspect the final workspace**

Run:

```bash
git status --short
git diff --check
```

Expected: only intended source, spec, and plan files are changed; no whitespace errors, generated logs, or unwanted test artifacts. Report verification results and the intentional one-way migration limitation. Do not commit unless explicitly asked.
