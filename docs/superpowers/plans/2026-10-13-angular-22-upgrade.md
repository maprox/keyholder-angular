# Angular 12 → 22 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `maprox/keyholder-angular` from Angular 12.2 to stable Angular 22.x with passing production build and unit tests.

**Architecture:** Official one-major-at-a-time `ng update` chain (12→…→22) on branch `upgrade/angular-22` in worktree `.worktrees/upgrade-angular-22`. Keep NgModules; migrate toolchain only when required by that major. Commit after each green major.

**Tech Stack:** Angular CLI/core 22.x, TypeScript (peer), RxJS (peer), zone.js (peer), Karma/Jasmine, ESLint (post-tslint), Node (Docker + local peer), bootstrap 4 / jquery / ngx-clipboard as tolerated.

**Spec:** `docs/superpowers/specs/2026-10-13-angular-22-upgrade-design.md`

## Global Constraints

- Target: latest stable **Angular 22.x** (not next/rc)
- Must update **one major at a time**; never skip majors
- Keep **NgModules** (no standalone/signals migration)
- Worktree: `.worktrees/upgrade-angular-22`, branch `upgrade/angular-22`; checkout root stays on `master`
- After each major: `npx ng build --configuration production` and unit tests must pass before next major
- Third-party: change only if install/build/tests fail
- No secrets in commits; no force-push to `master`

## File map (expected touch set)

- Modify: `package.json`, `package-lock.json`
- Modify: `angular.json`, `tsconfig.json`, `src/tsconfig*.json`, `src/polyfills.ts`, `src/main.ts`, `src/test.ts` as migrations require
- Modify/replace: lint config (`tslint.json` → eslint), remove or stub `protractor.conf.js` / `e2e/` when required
- Modify: `Dockerfile`, `README.md`
- Possibly: `src/app/**/*.ts` for breaking API fixes; `*.spec.ts` for TestBed updates
- Create: `.worktrees/` ignored via `.gitignore`

---

### Task 1: Worktree + baseline

**Files:**
- Modify: `.gitignore` (add `.worktrees/`)
- Create: worktree at `.worktrees/upgrade-angular-22` on branch `upgrade/angular-22`

**Interfaces:**
- Consumes: clean `origin/master`
- Produces: isolated worktree path; branch ready for upgrade commits

- [ ] **Step 1: Ensure `.worktrees/` is gitignored**

```bash
grep -q '^\.worktrees/$' .gitignore || echo '.worktrees/' >> .gitignore
git check-ignore -q .worktrees
```

- [ ] **Step 2: Commit ignore on a temporary path only if needed before worktree**

If `.gitignore` changed and worktree does not exist yet, commit on `master` is undesirable. Prefer: create branch first in-place OR add ignore inside the new branch after `git worktree add`. Safest:

```bash
git worktree add -b upgrade/angular-22 .worktrees/upgrade-angular-22 master
cd .worktrees/upgrade-angular-22
grep -q '^\.worktrees/$' .gitignore || printf '\n.worktrees/\n' >> .gitignore
git add .gitignore
git commit -m "$(cat <<'EOF'
chore: ignore .worktrees directory

EOF
)"
```

- [ ] **Step 3: Install and record baseline**

```bash
cd .worktrees/upgrade-angular-22
npm ci
node -v
npx ng version
```

If `npm ci` fails on host Node (v24), install/use Node 14 or 16 for Angular 12 baseline (fnm/nvm or container). Document the Node version used in the commit message of Task 2 if special.

- [ ] **Step 4: Baseline build (best effort)**

```bash
npx ng build --configuration production
```

If baseline already fails on modern Node, fix Node first; do not start majors on a broken baseline.

- [ ] **Step 5: Commit docs already present (spec + this plan) if not committed**

```bash
git add docs/superpowers/specs/2026-10-13-angular-22-upgrade-design.md \
        docs/superpowers/plans/2026-10-13-angular-22-upgrade.md
git status
git commit -m "$(cat <<'EOF'
docs: add Angular 22 upgrade spec and plan

EOF
)"
```

---

### Task 2: Angular 12 → 13

**Files:**
- Modify: `package.json`, `package-lock.json`, configs touched by schematics

**Interfaces:**
- Consumes: Angular 12 app building on chosen Node
- Produces: Angular **13.x** app with green build + tests

- [ ] **Step 1: Update**

```bash
npx ng update @angular/core@13 @angular/cli@13 --force --allow-dirty
# if peer conflicts: npm install then re-run, or ng update with --migrate-only after aligning versions
```

Follow any schematic prompts; accept official migrations.

- [ ] **Step 2: Fix compile/test breakages** until green.

- [ ] **Step 3: Verify**

```bash
npx ng build --configuration production
npx ng test --watch=false --browsers=ChromeHeadless --code-coverage=false
```

If ChromeHeadless unavailable, use the project’s existing CI browser flags or `Karma` customLaunchers already in `karma.conf.js`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: upgrade Angular 12 to 13

EOF
)"
```

---

### Task 3: Angular 13 → 14

**Files:** same as Task 2 pattern

**Interfaces:**
- Consumes: Angular 13 green
- Produces: Angular **14.x** green

- [ ] **Step 1:** `npx ng update @angular/core@14 @angular/cli@14`
- [ ] **Step 2:** Fix breakages (typed forms, etc. if applicable)
- [ ] **Step 3:** build + headless tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 13 to 14`

---

### Task 4: Angular 14 → 15

**Interfaces:** Consumes 14 → Produces **15.x** green

- [ ] **Step 1:** `npx ng update @angular/core@15 @angular/cli@15`
- [ ] **Step 2:** Apply required TS/Node bumps; fix breakages
- [ ] **Step 3:** build + tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 14 to 15`

---

### Task 5: Angular 15 → 16

**Interfaces:** Consumes 15 → Produces **16.x** green

- [ ] **Step 1:** `npx ng update @angular/core@16 @angular/cli@16`
- [ ] **Step 2:** Fix breakages (e.g. required Node bump)
- [ ] **Step 3:** build + tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 15 to 16`

---

### Task 6: Angular 16 → 17

**Interfaces:** Consumes 16 → Produces **17.x** green

Notes: Angular 17 often introduces application builder / control flow migrations — accept schematics; **do not** force standalone conversion of the whole app.

- [ ] **Step 1:** `npx ng update @angular/core@17 @angular/cli@17`
- [ ] **Step 2:** Keep NgModules; only apply migrations needed for build
- [ ] **Step 3:** build + tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 16 to 17`

---

### Task 7: Angular 17 → 18

**Interfaces:** Consumes 17 → Produces **18.x** green

- [ ] **Step 1:** `npx ng update @angular/core@18 @angular/cli@18`
- [ ] **Step 2:** Fix breakages
- [ ] **Step 3:** build + tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 17 to 18`

---

### Task 8: Angular 18 → 19

**Interfaces:** Consumes 18 → Produces **19.x** green

- [ ] **Step 1:** `npx ng update @angular/core@19 @angular/cli@19`
- [ ] **Step 2:** Fix breakages
- [ ] **Step 3:** build + tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 18 to 19`

---

### Task 9: Angular 19 → 20

**Interfaces:** Consumes 19 → Produces **20.x** green

- [ ] **Step 1:** `npx ng update @angular/core@20 @angular/cli@20`
- [ ] **Step 2:** Fix breakages
- [ ] **Step 3:** build + tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 19 to 20`

---

### Task 10: Angular 20 → 21

**Interfaces:** Consumes 20 → Produces **21.x** green

- [ ] **Step 1:** `npx ng update @angular/core@21 @angular/cli@21`
- [ ] **Step 2:** Fix breakages
- [ ] **Step 3:** build + tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 20 to 21`

---

### Task 11: Angular 21 → 22

**Interfaces:** Consumes 21 → Produces **22.x** green

- [ ] **Step 1:** `npx ng update @angular/core@22 @angular/cli@22`
- [ ] **Step 2:** Align remaining peers to 22.x latest patch
- [ ] **Step 3:** build + tests
- [ ] **Step 4:** Commit `chore: upgrade Angular 21 to 22`

---

### Task 12: Tooling cleanup + Docker + README

**Files:**
- Modify: `Dockerfile` (Node base supported by Angular 22 — typically Node 20 or 22 LTS)
- Modify: `README.md` (replace Angular 12 / Node 12 claims with 22 / current Node)
- Modify: remove or disable protractor/phantomjs/tslint leftovers if still present and unused
- Modify: `package.json` scripts if lint command changed to eslint

**Interfaces:**
- Consumes: Angular 22 green app
- Produces: docs/Docker/tooling aligned; still green build/tests

- [ ] **Step 1: Dockerfile**

Change `FROM node:12` to a Node major listed as supported for Angular 22 (prefer current Node LTS, e.g. `node:22` or `node:20`). Keep nginx install and entrypoint behavior.

- [ ] **Step 2: README**

Replace “Angular 12” / “Node 12” prerequisite text with Angular 22 and the Node version matching Dockerfile/peers.

- [ ] **Step 3: Dead tooling**

If `protractor`, `phantomjs-prebuilt`, `karma-phantomjs-launcher`, `tslint`, `codelyzer` remain and are unused, remove from `package.json` and delete obsolete config files. Ensure `npm test` / `npm run lint` still have working definitions (eslint if migrated).

- [ ] **Step 4: Verify**

```bash
npx ng version   # shows 22.x
npx ng build --configuration production
npx ng test --watch=false --browsers=ChromeHeadless --code-coverage=false
```

- [ ] **Step 5: Commit**

```bash
git commit -am "$(cat <<'EOF'
chore: align Docker, README, and tooling for Angular 22

EOF
)"
```

---

### Task 13: Finish branch — push + MR

**Files:** none beyond git remote

- [ ] **Step 1:** Push branch

```bash
git push -u origin upgrade/angular-22
```

- [ ] **Step 2:** Open PR/MR into `master` (GitHub `gh pr create` or Forgejo API as appropriate for this remote)

Title: `Upgrade Angular 12 → 22`

Body must include summary of majors, Node/Docker change, and test plan checklist.

- [ ] **Step 3:** Return the MR/PR URL to the user.

---

## Plan self-review

1. **Spec coverage:** Goal, one-major chain, NgModules kept, Docker/README, success criteria, MR → Tasks 1–13.
2. **Placeholders:** None; commands are concrete.
3. **Consistency:** Branch name `upgrade/angular-22`, worktree `.worktrees/upgrade-angular-22`, target Angular 22.x throughout.
