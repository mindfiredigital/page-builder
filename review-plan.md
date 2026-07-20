# Code Review Plan — @mindfiredigital/pagebuilder

Scope: `packages/core`, `packages/react`, `packages/web-component`, `packages/cli`, `packages/example`, `documentation`.
Excluded: `packages/angular` (unreleased).

Each top-level category below is judged independently. "Strict" means: absence of an expected practice is a finding, not just active bugs.

---

## 1. Project Structure & File Organization

- 1.1 Monorepo layout sanity (packages/\* boundaries, no cross-package relative imports bypassing package entry points)
- 1.2 File/folder naming consistency (casing convention: PascalCase for components, camelCase for utils, kebab-case for dirs) within and across packages
- 1.3 Separation of concerns per package (src/components, src/services, src/utils, src/types, src/constants clearly split — not dumped in one folder)
- 1.4 Public API surface exposed intentionally via a single entry (index.ts) per package, no deep-import leakage of internals
- 1.5 Orphaned/dead files (unused components, commented-out files, `.bak`/`.old` files, unreferenced scripts)
- 1.6 Consistency of structure between sibling packages (core vs react vs web-component vs cli shouldn't diverge in layout philosophy without reason)
- 1.7 `example/` apps structured as genuine consumer demos, not stale/broken copies

## 2. Types & Constants Hygiene

- 2.1 Types centralized (`types/` or `*.types.ts`) and not redefined ad hoc inline in multiple files
- 2.2 Constants centralized (`constants/` or `*.constants.ts`), no magic strings/numbers scattered in logic
- 2.3 No duplicate/overlapping type definitions across packages that should share a single source of truth (e.g. core vs react vs web-component component config types)
- 2.4 Enums vs string-union usage is consistent
- 2.5 `any`/`unknown`/type-assertion (`as`) usage audited — flag unjustified `any`
- 2.6 Exported types are actually consumed by dependent packages (react/web-component/cli importing core's types) rather than re-declared

## 3. Documentation

- 3.1 Root `README.md` accuracy (install steps, badges, links all valid, matches current package names/versions)
- 3.2 Per-package `README.md` present and accurate (core, react, web-component have one; cli does not — check if needed)
- 3.3 `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE.md` present, current, and internally consistent (they exist — verify content isn't boilerplate/stale)
- 3.4 Inline code documentation: public functions/classes have doc comments (JSDoc/TSDoc) where behavior isn't self-evident
- 3.5 `documentation/` (Docusaurus site) coverage vs actual public API — are all exported components/props documented, any drift between docs and code
- 3.6 CHANGELOG.md accuracy and whether every published package has one (core/react/web-component do; cli does not)
- 3.7 No CODEOWNERS file — ownership/review routing undocumented

## 4. Test Coverage & Quality

- 4.1 Per-package test presence: `core` has ~27 test files; `react`, `web-component`, `cli` have **zero** test files — flag as major gap
- 4.2 Unit test coverage for critical logic (drag/drop, canvas state, export services, history manager) — measure via `jest --coverage` where configured
- 4.3 Integration/E2E coverage for cross-package flows (react wrapper → web-component → core rendering pipeline) — currently none found
- 4.4 Test quality: assertions are meaningful (not just "renders without crashing"), edge cases and error paths covered, no skipped/disabled tests left in
- 4.5 CLI command tests (argument parsing, error handling, file generation) — none present
- 4.6 Test infra consistency: `jest.config.js` only exists for core; other packages lack a runnable test setup entirely
- 4.7 `turbo run test` pipeline — packages without a `test` script silently no-op; confirm this isn't masking "passing" CI

## 5. Code Quality & Standards

- 5.1 ESLint config strictness — current root `eslint.config.mjs` only enables `no-unused-vars`; no `@typescript-eslint/recommended`, no `eslint-plugin-react`/`react-hooks` rules despite React package existing, no import-order/no-cycle rules
- 5.2 ESLint ignores `**/tests/**` and `**/example/**` entirely — test code and example code get zero lint enforcement
- 5.3 Prettier config present and enforced pre-commit (`.prettierrc`, lint-staged) — verify it actually runs and isn't bypassable
- 5.4 TypeScript strictness: root `tsconfig.json` has `strict: true` (good) — verify each package's own `tsconfig.json` doesn't loosen this
- 5.5 Consistent code style across packages (naming, function size, component structure) — look for one-off patterns that diverge from the rest of the codebase
- 5.6 Cyclomatic complexity / oversized files or functions (use `find_large_functions` from the graph)
- 5.7 Commented-out code, `console.log`/`debugger` statements left in source
- 5.8 Consistent error-throwing/handling pattern (custom errors vs generic `Error` vs silent `catch {}`)
- 5.9 Commit message / PR hygiene enforced via commitlint + husky — verify hook actually blocks bad commits locally (not just informational)

## 6. Security

- 6.1 Dependency vulnerabilities (`pnpm audit` across all workspaces) — flag high/critical CVEs, especially in `html2pdf.js`, `jspdf`, `esbuild` (cli)
- 6.2 XSS surface: page builder renders/exports user-authored HTML — check for unsanitized `innerHTML`/`dangerouslySetInnerHTML` usage in canvas rendering and export services
- 6.3 CLI file-system operations (`pagectl`) — path traversal / arbitrary file write when generating output, unsafe use of `esbuild`/dynamic code execution
- 6.4 Export pipeline (PDF/ZIP/HTML generation) — check for injection via user content into generated files
- 6.5 No secrets/tokens committed (`.env`, API keys) — spot-check `.gitignore` coverage and git history for accidental commits
- 6.6 npm publish workflow (`ci.yml`/release workflow) — `NPM_TOKEN`/`GITHUB_TOKEN` scoping, whether `pull_request_target` or similar risky triggers are used (currently push-only, which is safer, but verify no untrusted code execution path)
- 6.7 `SECURITY.md` disclosure process is real/actionable (has a contact/process, not a placeholder)
- 6.8 Third-party script/style injection points (icons, styles copied via `ncp`) reviewed for tampering risk

## 7. Dependency & Package Audit

- 7.1 Outdated/deprecated dependencies (`turbo` version differs between root `^2.6.3` and core's devDep `^1.13.4` — inconsistent!)
- 7.2 Duplicate dependency versions across packages (React 18 pinned in multiple packages — check for drift), `typescript` version differs per package (`^5.2.2` root vs `^5.9.3` core vs `^5.7.3` web-component/cli)
- 7.3 Peer dependency correctness (react package's peerDeps `>=17.0.0` vs devDep `^18.2.0` — verify lower bound is actually tested)
- 7.4 Workspace `workspace:*` protocol usage consistent, no accidental hard-pinned cross-package versions
- 7.5 Unused dependencies declared in `package.json` (audit with a tool or manual cross-check against imports)
- 7.6 License compatibility of all third-party deps with project's MIT license (e.g. `html2pdf.js`, `jspdf` licensing)
- 7.7 `engines` field consistency — root says `node >=12.0.0`, cli says `node >=18.0.0`, CI uses Node 24/20 — decide and align a real minimum supported Node version
- 7.8 `packageManager: pnpm@8.6.0` pinned — confirm it matches what CI/dev actually use

## 8. Performance

- 8.1 Canvas rendering performance under large component trees (drag/drop, grid manager) — any obvious O(n²) patterns or unnecessary re-renders
- 8.2 Bundle size per published package (core/react/web-component) — check for tree-shaking correctness (`sideEffects: false` declared in react/web-component but verify core doesn't break it)
- 8.3 Export services (PDF/ZIP generation) — synchronous/blocking operations on large pages, memory usage
- 8.4 Unnecessary re-renders in React wrapper package (missing memoization, unstable prop references passed to web-component)
- 8.5 Asset handling (icons/styles copied via `ncp`) — check for unoptimized/uncompressed assets shipped in `dist`
- 8.6 Lazy-loading opportunities for heavy features (PDF export libs) not used by every consumer

## 9. Reliability & Maintainability

- 9.1 Error handling consistency across async operations (export, history, drag/drop) — unhandled promise rejections
- 9.2 State management predictability (canvas shared state, history manager) — mutation safety, undo/redo correctness
- 9.3 Backwards compatibility handling across independently-versioned packages (core 1.20.0 / react 1.2.19 / web-component 5.0.14 / cli 0.1.0) — is version compatibility between them documented/enforced anywhere?
- 9.4 Graceful degradation when optional features fail (e.g. export fails, drag handler errors) — does it crash the whole builder or fail isolated
- 9.5 Logging strategy — see §12
- 9.6 Code coupling/cohesion (use graph community cohesion scores — some communities show very low cohesion, e.g. 0.07–0.17, suggesting weak internal organization)
- 9.7 CLI (`pagectl`) at 0.1.0 with zero tests, zero docs beyond package description — maturity/reliability risk for a published package

## 10. Logging & Observability

- 10.1 Presence of any structured logging in core/react/web-component/cli (currently appears to be none beyond stray `console.*`)
- 10.2 Error visibility for consumers — do failures in canvas/export surface actionable messages or silent failures
- 10.3 CLI output/logging clarity (success/error/verbose modes) for a scriptable tool (`pagectl` is described as "self-describing")
- 10.4 No sensitive data (file paths, user content) leaked into logs

## 11. DevOps / CI-CD

- 11.1 **No CI runs on pull requests** — both `.github/workflows/ci.yml` and `release-docs.yml` trigger only on `push: main` / `workflow_dispatch`. There is no automated lint/test/build/typecheck gate before merge. This is the single biggest DevOps gap.
- 11.2 `ci.yml` is actually a deployment/release workflow (misleading name) — no dedicated CI workflow exists
- 11.3 Branch protection rules on `main` (cannot verify from repo alone — flag to check in GitHub settings: required status checks, required reviews)
- 11.4 Release automation (changesets) correctness — auto-generated changesets from commit messages, auto-merge of release PR without human review step
- 11.5 Node version inconsistency across workflows (ci.yml uses Node 24, release-docs.yml uses Node 20) and vs `engines` field
- 11.6 `release-docs.yml` uses `actions/checkout@v2` (outdated) while `ci.yml` uses `@v4` — inconsistent/outdated action pinning
- 11.7 Force-push to `gh-pages` in docs workflow (`git push origin gh-pages --force`) — acceptable for a build-artifact branch but confirm no accidental data loss risk
- 11.8 No caching of pnpm store / turbo remote cache configured in workflows — slower CI, avoidable cost
- 11.9 No Dependabot/Renovate config for automated dependency updates

## 12. Accessibility (a11y)

- 12.1 Generated/exported HTML output — does the page builder produce accessible markup by default (alt text prompts, semantic tags, ARIA where needed)
- 12.2 Builder UI itself (core canvas, sidebar, modals) — keyboard navigation, focus management, ARIA roles
- 12.3 Color contrast in default component styles

## 13. API Design & Cross-Package Consistency

- 13.1 Public component/config API consistency between `core` (vanilla), `react`, and `web-component` wrappers — same feature set exposed identically
- 13.2 Breaking-change surface tracked via changesets for every public API change, not just version bumps
- 13.3 CLI (`pagectl`) command surface — consistent verb/noun naming, `--help` output matches docs

## 14. Licensing & Open-Source Project Hygiene

- 14.1 `LICENSE.md` present and referenced correctly in every package's `package.json` (`"license": "MIT"`)
- 14.2 Issue/PR templates present and used (`.github/ISSUE_TEMPLATE/*`, `PULL_REQUEST_TEMPLATE.md`) — verify PR template is actually informative and enforced
- 14.3 `CODE_OF_CONDUCT.md` / `CONTRIBUTING.md` alignment with actual contribution flow (e.g. does CONTRIBUTING.md mention the changeset process, commit conventions, missing CI-on-PR expectation)

---

## Review Method (for Phase 3)

For each numbered subpoint above:

1. Locate current evidence in the repo (file/line).
2. Mark **OK**, **GAP**, or **RISK**.
3. For every GAP/RISK, write a concrete, actionable fix into `suggest.md`, grouped under the same section numbers, so Phase 4 work can be tracked task-by-task against this plan.
