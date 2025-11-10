## Repo quick orientation

This repository is a single Lit-based web component called `hamster-gallery` with an OpenWC / Rollup toolchain and HAX/DDD integrations. Key files:

- `hamster-gallery.js` — main web component (root of repo). See `loadData()` for data + asset loading patterns.
- `hamster.json` — sample data (users, posts) used by the component; images live in `img/`.
- `rollup.config.js` — build configuration. The entry is `index.html`; output goes to `public/`.
- `lib/hamster-gallery.haxProperties.json` and `locales/` — HAX wiring and i18n JSON files.
- `package.json` — scripts and dependencies (start, build, test, release).

## What to know when editing code

- Follow existing pattern: the component lives at the repo root (`hamster-gallery.js`). Additional helper components or HAX wiring belong in `/lib/`.
- Asset resolution MUST use `new URL('./path', import.meta.url).href` (example: `fetch(new URL('./hamster.json', import.meta.url).href)` in `loadData()` and mapping image URLs). The Rollup plugins (`@web/rollup-plugin-import-meta-assets`) expect this.
- Use the `@haxtheweb/d-d-d` and `@haxtheweb/i18n-manager` mixins already applied in the component; they provide design-system tokens and i18n helpers. Inspect `lib/hamster-gallery.haxProperties.json` for HAX configuration patterns.

## Developer commands (run from repo root)

- npm install — install dependencies
- npm start — run dev server (web-dev-server). NOTE: server runs with HTTPS by default; HMR is supported via `--hmr` flag in `web-dev-server.config.mjs` (opt-in).
- npm run build — cleans `public/`, runs Rollup (`rollup.config.js`) and runs `cem analyze`. Build output is `public/` (used by Netlify/Vercel). See `netlify.toml` which expects `public` as the publish dir.
- npm test — runs `web-test-runner` tests in `test/**/*.test.js` (uses `@open-wc/testing` helpers). Tests use fixtures like:
  - `await fixture(html`<hamster-gallery title="..."></hamster-gallery>`);`

## Testing and CI notes

- Tests run in Node via `web-test-runner` with `--node-resolve`. If adding tests, follow the pattern in `test/hamster-gallery.test.js` (a11y audit + basic fixture). Keep tests fast and avoid network calls; prefer local `hamster.json` fetches.

## Conventions and gotchas (project-specific)

- Single file component: the primary component is in the repo root, not inside `src/`. Keep this pattern when adding new components unless there's a strong reason to change it.
- Use design tokens and variables from the DDD/HAX design system (CSS variables prefixed with `--ddd-...`). See `hamster-gallery.js` styles for examples.
- i18n: translations are in `locales/*.json`. Use the existing `I18NMixin` pattern from `@haxtheweb/i18n-manager`.
- HAX properties: update `lib/hamster-gallery.haxProperties.json` when exposing new configurable properties or demo schema changes.

## Integration points / external deps

- Lit (v3) — component library.
- @haxtheweb/d-d-d — design system helpers and base class mixin.
- @haxtheweb/i18n-manager — i18n mixin used by the component.
- Rollup + @web plugins — build pipeline expects `import.meta.url` usage for assets.

## Examples to copy from this repo

- Asset+data loading: `loadData()` in `hamster-gallery.js` uses `fetch(new URL('./hamster.json', import.meta.url).href)` and maps `profileImage` and `postImages` to `new URL(..., import.meta.url).href`.
- Test fixture: `test/hamster-gallery.test.js` shows a minimal fixture and an accessibility check: `await expect(element).shadowDom.to.be.accessible()`.

## When to ask for clarification

- If a requested change affects publishing (version bump, `npm publish`) — check `package.json` scripts (`release`) and confirm with maintainers.
- If you need to change the build entrypoint (currently `index.html`) or output directory (`public/`), call this out — Netlify and other hosting configs assume `public/`.

If anything here is unclear or you want me to include additional examples (e.g., more test snippets or a quick PR checklist), tell me what to add and I will iterate.
