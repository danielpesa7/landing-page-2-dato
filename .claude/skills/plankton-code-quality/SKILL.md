---
name: plankton-code-quality
description: Static analysis, dead-code removal, dependency hygiene, and consolidation for the 2Dato landing page
type: project-skill
---

# plankton-code-quality

Keep the repo small, dependency-lean, and free of rot. Name is a nod to the `plankton` metaphor: tiny organisms that, unchecked, choke a reef.

## Scope

- Dead CSS selectors and unused custom properties
- Unreferenced image files in `assets/`
- `package.json` devDeps that drifted out of use (post-PR 2)
- Duplicated style blocks that could collapse into a shared class
- Inline styles creeping into `index.html`

## Tools

| Tool | Use when |
|------|----------|
| `knip` | Post-PR 2 — dead exports, unused files, orphan deps |
| `depcheck` | Post-PR 2 — unused / missing `package.json` deps |
| `purgecss --dry-run` | Finds unused CSS selectors against `index.html` + `main.js` |
| `stylelint --report-needless-disables` | Dead `stylelint-disable` pragmas |
| `eslint --report-unused-disable-directives` | Dead ESLint disables |
| `imagemin --lint` / custom find script | Unreferenced images in `assets/` |

## Cadence

- **Every feature PR:** author does a mental pass — "did this leave anything orphaned?"
- **Monthly sweep PR:** `chore/plankton-sweep-YYYY-MM` — run all tools, apply safe removals
- **Before a major design refresh:** full PurgeCSS pass to strip dead selectors first

## Safe-removal rules

- **Never** delete on the first signal. Verify:
  1. No references in HTML/CSS/JS (grep recursive, then grep in `tests/`)
  2. Not part of a public-contract file (CNAME, robots.txt, sitemap.xml)
  3. Not referenced in GitHub Actions workflows
- **Commit style:** one tool per commit inside a sweep PR, e.g.
  - `refactor: remove 14 unused CSS custom properties (purgecss)`
  - `chore: drop 3 unused devDeps (depcheck)`
  - `chore: delete 2 orphan images from assets/ (unreferenced)`
- Add removed public filenames to a short `DELETED.md` section in the PR description so search engines aren't blindsided

## What plankton-code-quality is *not*

- Not a refactor agent — it removes, it doesn't restructure. Restructuring is a separate PR owned by the feature skill.
- Not a formatter — that's `coding-standards`.
- Not a performance agent — perf wins live under `frontend-patterns` (image pipeline, font subset, critical CSS).

## Outputs

Each sweep PR ends with a short table in the PR description:

| Tool | Items flagged | Removed | Kept (with reason) |
|------|---------------|---------|--------------------|
| purgecss | 27 | 24 | 3 (used by dynamic `classList.add` in `main.js`) |
| depcheck | 4 | 3 | 1 (`husky` — used in `prepare` script) |
| ... | | | |

## When in doubt

- Err on the side of keeping. A three-line commit to restore beats a post-mortem about a broken deploy.
- If the tool is noisy, tune its config in the same PR rather than ignoring the finding.
