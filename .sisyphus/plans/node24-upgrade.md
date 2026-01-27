# Node 24 LTS Upgrade + Dependency Updates

## Context

### Original Request
Upgrade to Node.js LTS (24), update all packages.

### Interview Summary
**Key Decisions**:
- Strict Node 24+ enforcement (engines >=24.0.0)
- Update ALL 8 outdated packages to latest

**Research Findings**:
- Node 24 LTS active since Oct 2025, latest 24.13.0
- Compatible with Next.js 15, React 19, Tailwind CSS 4
- No breaking changes expected

### Metis Review
**Guardrails Applied**:
- No config file drift (biome.json, eslint, tsconfig, next.config unchanged)
- No source code changes (app/, utils/, globals.d.ts untouched)
- No scope expansion (only listed packages, no audit fixes)
- Clean package-lock regeneration (not incremental update)

---

## Work Objectives

### Core Objective
Upgrade Node.js version from 22 to 24 LTS and update all packages to latest.

### Concrete Deliverables
- `.nvmrc` → 24
- `package.json` → engines >=24.0.0, updated dep versions
- `.github/workflows/ci-cd.yml` → node-version: '24'
- `package-lock.json` → regenerated for Node 24/npm

### Definition of Done
- [x] `node --version` outputs v24.x.x
- [x] `npm run build` exits 0
- [x] `npm run dev` starts without errors
- [x] `npm run lint` exits 0

### Must Have
- Node version 24 in .nvmrc, package.json engines, CI workflow
- All 8 packages updated to latest

### Must NOT Have (Guardrails)
- Changes to config files (biome.json, tsconfig.json, next.config.ts, postcss.config.mjs)
- Changes to source code (app/, utils/, globals.d.ts)
- New dependencies or scripts
- npm audit fixes or security patches (out of scope)
- Config changes to fix new lint rules (revert package if needed)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (no test files in project)
- **User wants tests**: N/A
- **QA approach**: Manual verification via build/dev/lint commands

### Manual QA Procedures
Each task verified via shell commands with expected output.

---

## Task Flow

```
Task 0 (baseline) → Task 1 (Node refs) → Task 2 (switch Node) → Task 3 (deps) → Task 4 (verify)
```

## Parallelization

All tasks are SEQUENTIAL (each depends on previous).

---

## TODOs

- [x] 0. Verify Baseline (Node 22)

  **What to do**:
  - Run build and lint on current Node 22 to confirm starting state is green

  **Must NOT do**:
  - Make any changes

  **Parallelizable**: NO (must complete before any changes)

  **References**:
  - `package.json:11-24` - Script definitions for build/lint commands

  **Acceptance Criteria**:
  - [x] `node --version` → v22.x.x
  - [x] `npm run build` → exits 0
  - [x] `npm run lint` → exits 0

  **Commit**: NO

---

- [x] 1. Update Node Version References

  **What to do**:
  - Update `.nvmrc` from `22` to `24`
  - Update `package.json` engines.node from `>=22.0.0` to `>=24.0.0`
  - Update `.github/workflows/ci-cd.yml` node-version from `'22'` to `'24'`

  **Must NOT do**:
  - Change any other fields or formatting
  - Update dependencies yet

  **Parallelizable**: NO (must complete before Node switch)

  **References**:
  - `.nvmrc:1` - Single line containing Node version
  - `package.json:48-50` - engines field
  - `.github/workflows/ci-cd.yml:26` - node-version in lint job

  **Acceptance Criteria**:
  - [x] `.nvmrc` contains `24`
  - [x] `package.json` engines.node is `>=24.0.0`
  - [x] CI workflow node-version is `'24'`

  **Commit**: NO (group with deps)

---

- [x] 2. Switch to Node 24

  **What to do**:
  - Install Node 24 if not present
  - Switch to Node 24
  - Delete node_modules and package-lock.json for clean slate

  **Must NOT do**:
  - Run npm install yet (deps not updated)

  **Parallelizable**: NO (must complete before dep updates)

  **References**:
  - nvm docs for install/use commands

  **Acceptance Criteria**:
  - [x] `node --version` → v24.x.x
  - [x] `npm --version` → v10.x.x or higher
  - [x] `node_modules/` deleted
  - [x] `package-lock.json` deleted

  **Commit**: NO

---

- [x] 3. Update Dependencies

  **What to do**:
  - Update package.json with latest versions for all 8 packages:
    - react: 19.2.3 → 19.2.4
    - react-dom: 19.2.3 → 19.2.4
    - next: 16.1.1 → 16.1.5
    - eslint-config-next: 16.1.1 → 16.1.5
    - @biomejs/biome: 2.3.10 → 2.3.13
    - @types/node: 25.0.3 → 25.0.10
    - @types/react: 19.2.7 → 19.2.9
    - lefthook: 2.0.13 → 2.0.15
  - Run `npm install` to generate fresh package-lock.json

  **Must NOT do**:
  - Update any packages not in the list above
  - Add new dependencies
  - Run npm audit fix

  **Parallelizable**: NO (must complete before verify)

  **References**:
  - `package.json:26-46` - dependencies and devDependencies sections
  - npm docs for install command behavior

  **Acceptance Criteria**:
  - [x] All 8 packages at latest versions in package.json
  - [x] `package-lock.json` regenerated (exists, lockfileVersion 3)
  - [x] `node_modules/` populated
  - [x] `npm ls` shows no peer dep warnings

  **Commit**: NO (group with version refs)

---

- [x] 4. Verify & Commit

  **What to do**:
  - Run full verification suite
  - If lint errors from new rules: revert affected package, do NOT change config
  - Create single atomic commit with all changes

  **Must NOT do**:
  - Modify config files to fix lint errors
  - Skip any verification step

  **Parallelizable**: NO (final step)

  **References**:
  - `package.json:11-24` - Script definitions

  **Acceptance Criteria**:
  - [x] `npm run build` → exits 0
  - [x] `npm run dev` → starts, shows "Ready" (Ctrl+C to stop)
  - [x] `npm run lint` → exits 0 (no errors)
  - [x] No changes to: biome.json, tsconfig.json, next.config.ts, postcss.config.mjs
  - [x] No changes to: app/, utils/, globals.d.ts

  **Commit**: YES
  - Message: `chore: upgrade to node 24 lts, update all deps`
  - Files: `.nvmrc`, `package.json`, `package-lock.json`, `.github/workflows/ci-cd.yml`
  - Pre-commit: `npm run build && npm run lint`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 4 | `chore: upgrade to node 24 lts, update all deps` | .nvmrc, package.json, package-lock.json, .github/workflows/ci-cd.yml | npm run build && npm run lint |

---

## Success Criteria

### Verification Commands
```bash
node --version        # Expected: v24.x.x
npm run build         # Expected: exit 0
npm run dev           # Expected: "Ready" message, no errors
npm run lint          # Expected: exit 0
```

### Final Checklist
- [x] Node 24 in all version files
- [x] All 8 packages at latest
- [x] Build/dev/lint all pass
- [x] No config file changes
- [x] No source code changes
- [x] Single atomic commit
