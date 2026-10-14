# Angular 12 → 22 upgrade design

**Date:** 2026-10-13  
**Repo:** `maprox/keyholder-angular`  
**Status:** Approved for implementation

## Goal

Bring the Keyholder Angular frontend from **Angular 12.2** to the current stable **Angular 22.x**, so the app runs on a supported framework, modern Node, and a maintainable toolchain.

## Current state

- `@angular/*` / CLI **~12.2.4**, TypeScript **^4.3.5**, RxJS **^6.5.5**, zone.js **~0.11.4**
- NgModules app under `src/app/` (storage, auth/settings, encrypting, etc.)
- Tooling: **tslint** + codelyzer, **protractor** e2e stub, karma/jasmine, phantomjs remnants
- Docker: `FROM node:12`; README still describes Angular 12
- Third-party: bootstrap 4 + jquery scripts, `ngx-clipboard`, crypto-js, file-saver, font-awesome 4

## Target state

- Angular packages and CLI on **latest stable 22.x** (patch of current active line, e.g. 22.2.x)
- TypeScript, RxJS, zone.js, and Node versions matching Angular 22 peer requirements
- Production `ng build` and unit tests (`ng test` / CI equivalent) pass
- README and Docker base image updated for the new stack
- NgModules retained (no mandatory standalone/signals migration)

## Approach

**One major version at a time** via official `ng update`, as required by Angular’s update policy (update only within one major):

`12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 → 21 → 22`

After each major:

1. Resolve schematics / peer dependency failures
2. Fix compile errors from breaking changes
3. Run production build and unit tests
4. Commit on the feature branch

Tooling migrations that schematics or docs require at a given major (e.g. tslint→eslint, remove protractor) are done **in that major’s step**, not deferred past a broken toolchain.

## In scope

- All `@angular/*`, `@angular-devkit/*`, CLI, compiler-cli, language-service
- TypeScript, RxJS, zone.js, tslib as required by peers
- `angular.json`, `tsconfig*`, polyfills/main as required by migrations
- ESLint migration when Angular removes tslint support
- Removal or neutralization of dead e2e (protractor) / phantomjs if they block install or CI
- Dockerfile Node image bump to a version supported by Angular 22
- README version references and prerequisites
- Minimal third-party bumps only when required for install/build (`ngx-clipboard`, types, etc.)

## Out of scope

- Standalone components / signals rewrite
- Bootstrap 5 redesign or removing jquery (unless a migration forces it)
- New features, UX changes, or backend API changes
- Full e2e suite replacement (Cypress/Playwright) beyond removing broken protractor wiring
- Publishing Docker Hub image (unless already part of existing CI)

## Constraints

- Work on branch `upgrade/angular-22` in `.worktrees/upgrade-angular-22` (repo root stays on `master`)
- No force-push to `master`
- Prefer official schematics over hand-edits when `ng update` provides them
- Do not skip majors
- Secrets never committed

## Success criteria

1. `package.json` Angular packages at **22.x**
2. `npm ci` / install succeeds on supported Node
3. `ng build --configuration production` succeeds
4. Unit tests pass (same entry as today’s `npm test` / `ng test`, headless as needed)
5. Dockerfile uses a Node major supported by Angular 22
6. README no longer claims Angular 12
7. MR opened into `master` with the upgrade

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Long chain of majors; cumulative breakage | One major + build/test gate + commit each time |
| `ngx-clipboard` / bootstrap/jquery incompatible | Upgrade or replace only the broken package; keep UI behavior |
| Node 24 host vs older Angular majors during mid-chain | Use an appropriate Node via nvm/fnm or container for early majors if local Node is too new |
| Test suite relies on removed APIs | Fix tests to current TestBed/async patterns as each major requires |
| Docker build on old Node | Bump base image when Angular peers demand it (final step at latest) |

## Verification

- After each major: build + unit tests
- Final: production build, unit tests, smoke that main modules still compile (app, storage, settings, encrypting)
