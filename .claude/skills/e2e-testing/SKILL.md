---
name: e2e-testing
description: Playwright + axe-core smoke and accessibility testing for the 2Dato landing page
type: project-skill
---

# e2e-testing

Test the live user journeys on a static marketing site.

## Scope

- **Smoke:** page loads, no console errors, all nav anchors resolve, CTAs have valid `href`
- **Interaction:** mobile nav toggle opens/closes, particle canvas initializes, scroll animations trigger, counters run to target
- **Visual regressions:** **not** in scope yet — would need Percy/Chromatic; revisit if design churn accelerates
- **Accessibility:** axe-core scan blocking on `serious` and `critical` in PR 5, extending to `moderate+` in PR 6

## Stack (landed in PR 5)

- **Playwright** — browser automation
- **@axe-core/playwright** — accessibility scanning
- **Node** ≥ 20 (CI uses `actions/setup-node@v4`)

## Layout

```
tests/
  e2e/
    landing.spec.ts       # smoke + interaction
    a11y.spec.ts          # axe scan
  fixtures/
    selectors.ts          # stable data-testid map
playwright.config.ts
.github/workflows/e2e.yml
```

## Config rules

- Two projects: `chromium-desktop` (1440×900) and `chromium-mobile` (Pixel 5 device descriptor)
- `baseURL` comes from env: local = `http://localhost:5173` (served via `npx serve .`), CI = `http://127.0.0.1:8080`
- `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`
- Retries: 2 in CI, 0 locally
- `reporter: [['html', { open: 'never' }], ['github']]`

## Selector discipline

- Prefer `data-testid` over class / text — decouples test from visual design churn
- Add testids in `index.html` edits; never invent a selector that doesn't exist in the HTML

## CI workflow

`.github/workflows/e2e.yml`:

- Trigger: `pull_request`, `push` to `main`
- Matrix: `desktop`, `mobile`
- Steps: checkout → setup-node → `npm ci` → `npx playwright install --with-deps chromium` → start server → `npx playwright test --project=$MATRIX`
- `actions/upload-artifact@v4` for `playwright-report/` and `test-results/` (retain 7 days)

## Flakiness policy

- Any test that fails twice in a week → quarantine with `test.fixme()` and a linked issue
- No `sleep` / arbitrary timeouts; use `expect.poll()` or `await page.waitForSelector()`
- Assert on observable UI state, not on implementation details

## Running locally

```
npm run e2e              # all projects, headless
npm run e2e:ui           # Playwright UI mode for debugging
npm run e2e:a11y         # axe scan only
```

## When to update this skill

- Any time a test stabilizes or flakes repeatedly — capture the root cause
- When adding a new page or major section — add a smoke assertion for it
