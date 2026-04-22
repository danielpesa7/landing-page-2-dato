---
name: coding-standards
description: Formatting, linting, and style rules for the 2Dato landing page (Prettier + ESLint + Stylelint + html-validate)
type: project-skill
---

# coding-standards

How code in this repo should look and the tools that enforce it.

## Tooling (landed in PR 2)

- **Prettier** — formatter for HTML/CSS/JS/MD/YAML/JSON
- **ESLint** (flat config, `@eslint/js`) — JS lint
- **Stylelint** (`stylelint-config-standard`) — CSS lint
- **html-validate** — HTML lint
- **EditorConfig** — whitespace baseline

## Rules of thumb

### HTML

- Lowercase tags and attributes, double-quoted attribute values
- Self-closing void elements without slash (`<img>` not `<img />`)
- One attribute per line when a tag has more than three attributes
- `aria-*` and `data-*` come after standard attributes

### CSS

- Custom property names: kebab-case, semantic (`--color-accent-cyan`, not `--blue`)
- Order inside a rule: layout → box model → typography → visual → motion
- Prefer `rem` for spacing, `em` for font-relative, `px` for hairlines/borders
- No `!important` without a one-line comment explaining why
- Nesting depth ≤ 3 levels

### JavaScript

- ES2022 vanilla, no TypeScript in source files
- `const` by default, `let` only when reassigned, never `var`
- Arrow functions for callbacks; named `function` for top-level init
- Early returns over nested conditionals
- No `console.log` in committed code; `console.warn` / `console.error` OK for genuine error paths
- Prefer `for…of` over index loops; avoid `forEach` when you need `break`

### Commit messages

Conventional Commits. Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.

```
<type>: <imperative summary under 72 chars>

<optional body — wrap at 72, explain WHY not WHAT>
```

No Co-Authored-By trailer (attribution disabled globally).

## Commands (post-PR 2)

```
npm run lint        # eslint + stylelint + html-validate
npm run format      # prettier --write .
npm run check       # prettier --check . && npm run lint
```

CI runs `check` on every PR via `.github/workflows/lint.yml`.

## Formatting commit hygiene

When landing Prettier on a codebase for the first time:

1. Commit the config (`.prettierrc`, `.prettierignore`) alone
2. Commit the reformat (`prettier --write .`) as a **separate** commit tagged `style: initial prettier reformat`
3. Add that reformat commit's SHA to `.git-blame-ignore-revs` so `git blame` stays useful

## Interaction with other skills

- `plankton-code-quality` handles dead-code / dependency hygiene (knip, depcheck, ts-prune where relevant)
- `frontend-patterns` owns semantic and performance rules beyond pure style
