---
name: documentation-lookup
description: Resolve library/API behavior via Context7 MCP and primary vendor docs before writing code
type: project-skill
---

# documentation-lookup

Before writing code that touches an external library, framework, or API — look it up. Do not guess API shapes from training data; they drift.

## Lookup priority

1. **GitHub code search** (`gh search code`, `gh search repos`) — find real usage in the wild
2. **Context7 MCP** (`mcp__context7__resolve-library-id`, then `mcp__context7__query-docs`) — curated, versioned docs
3. **Primary vendor docs** (direct URL from the package's `repository` / `homepage` field in its registry listing)
4. **Exa** — broader web search, only when 1–3 don't answer the question

## Packages this repo will pull in (PRs 2–6)

| Package | Why | Docs entry point |
|---------|-----|------------------|
| prettier | Formatter | https://prettier.io/docs/en/ |
| eslint, @eslint/js | JS lint (flat config) | https://eslint.org/docs/latest/ |
| stylelint, stylelint-config-standard | CSS lint | https://stylelint.io/ |
| html-validate | HTML lint | https://html-validate.org/ |
| @playwright/test | E2E | https://playwright.dev/docs/intro |
| @axe-core/playwright | A11y scan | https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright |
| sharp-cli (or Squoosh CLI) | Image pipeline | https://github.com/vseventer/sharp-cli |

## Prompts that work

- `mcp__context7__resolve-library-id "@playwright/test"` → get stable ID
- `mcp__context7__query-docs` with a specific question: *"How do I configure projects for desktop and mobile viewport in playwright.config.ts?"*

Ask narrow questions. Broad ones ("how does Playwright work") waste tokens and return boilerplate.

## What to record when you look something up

If the finding is non-obvious and likely to recur, capture it:

- **Behavior-of-the-tool fact** → inline code comment (one short line, the WHY)
- **Project decision based on the finding** → `tasks/plan.md` or `tasks/lessons.md`
- **Version-specific quirk** → note in the relevant skill's SKILL.md

## What NOT to do

- Don't paste full docs into the conversation — link or cite the section
- Don't trust unversioned blog posts over the vendor's release notes
- Don't refactor code based on a Stack Overflow answer without checking the vendor doc
- Don't invent option names, flag names, or API shapes
