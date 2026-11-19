# Plyr

> [!IMPORTANT]
> Upstream Plyr is deprecated and receives security updates only; its authors now build [Video.js 10](https://videojs.org?utm_source=plyr). This fork (`prad-n/plyr`) keeps the 3.8.5 code as a legacy codebase for an AI-delivery proof of concept (see [docs/poc/PLAN.md](docs/poc/PLAN.md)). The full user documentation (every option, method and event) is in the [upstream README](https://github.com/sampotts/plyr#readme) and in [CONTROLS.md](CONTROLS.md).

## Purpose

Plyr is a browser media player library. You give it a `<video>`, an `<audio>`, or a `<div>` that wraps a YouTube or Vimeo `<iframe>` (or has `data-plyr-provider` and `data-plyr-embed-id`). Plyr hides the native controls and adds its own accessible controls, captions, a settings menu, fullscreen and keyboard shortcuts, plus a single JavaScript API that works the same for every provider.

## Tech stack

| Area             | What the code uses                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language         | Plain JavaScript ES modules in `src/js`, not type-checked. Types are hand-written in `src/js/plyr.d.ts`. TypeScript is used only in `tasks/` and `site/`.               |
| Styles and icons | Sass (`src/sass`), PostCSS (custom properties resolved, Autoprefixer, cssnano). SVG icons (`src/sprite`) are combined into a sprite with svgstore and svgo.             |
| Build            | `tasks/build.ts` runs [Vite+](https://viteplus.dev) (`vite-plus` 1.3.0) in library mode, with target `es2019`.                                                          |
| Output (`dist/`) | `plyr.mjs` (ES module) and `plyr.js` (UMD), each plain or `polyfilled`, each with `.min` and source map; `plyr.css`; `plyr.svg`.                                        |
| Runtime          | Node `^22.18.0 \|\| >=24.11.0` (`.nvmrc`: 22), pnpm 12.4.2 (enforced with `only-allow pnpm`).                                                                           |
| Browsers         | `browserslist`: the last 2 versions of Chrome, Edge, Firefox, Safari, iOS and Opera. The polyfilled build adds `CustomEvent` and `URL`.                                 |
| Runtime deps     | `rangetouch` (touch on range inputs), `custom-event-polyfill`, `url-polyfill`. `loadjs` is in `package.json` but not imported in `src/` (`TODO(TL): verify` it can go). |
| Quality checks   | `vp lint` (Oxlint), `vp fmt` (Oxfmt), Stylelint, remark (link check), `tsc` for `tasks/` and `site/`. **No test framework and no tests.**                               |
| External SDKs    | Loaded at runtime from `config.urls`: YouTube IFrame API, Vimeo Player API, Google IMA (ads).                                                                           |

## Architecture

`src/js/plyr.js` holds the `Plyr` class. The other modules are plain objects whose methods run with `this` set to the player (`module.fn.call(player)`).

1. **Setup (constructor).** Config is merged in this order: `config/defaults.js`, then `Plyr.defaults`, then the constructor `options`, then the element's `data-plyr-config` JSON. The constructor works out `type` (video or audio) and `provider` (html5, youtube or vimeo; see `config/types.js`). It then creates `Listeners` and `Storage`, wraps the media in a container `<div>`, runs `media.setup`, creates `Fullscreen` and calls `ui.build`. Ads and preview thumbnails start if they are enabled.
2. **Providers.** `media.js` hands off to `html5.js`, `plugins/youtube.js` or `plugins/vimeo.js`. The embed plugins load their SDK and add HTML5-style methods and properties (`play`, `pause`, `currentTime` and so on) to `player.media`. They also fire HTML5-style events, so the rest of the code doesn't need to know the provider.
3. **UI.** `ui.js` builds the interface (poster, title, state classes). `controls.js` creates the controls bar from `config.controls`: buttons, progress, time, volume and the settings menu (captions, quality, speed). `captions.js` handles text tracks, `fullscreen.js` handles native, fallback and iOS fullscreen, and `source.js` swaps media through the `player.source` setter.
4. **Events.** `listeners.js` holds keyboard shortcuts (`handleKey`), global and container listeners, and the control bindings. Each control handler goes through `proxy`, which calls a user handler from `config.listeners` first; if that returns `false`, the default handler is skipped. Every name in `config.events` is re-dispatched from `player.media` to the container as a bubbling `CustomEvent` with `detail.plyr`. `player.on()` listens on the container.
5. **State.** `storage.js` keeps user preferences in `localStorage` under `config.storage.key` (default `plyr`) as one JSON object. Current keys: `volume`, `muted`, `speed`, `quality`, `captions`, `language`. If `localStorage` is blocked, it quietly does nothing.
6. **Other modules.** `support.js` (feature detection), `console.js` (debug logging), `plugins/ads.js` (Google IMA), `plugins/preview-thumbnails.js` (VTT sprite thumbnails), and `utils/` (DOM, events, i18n, numbers, time and URL helpers).
7. **Styles.** `src/sass/plyr.scss` imports `settings/` (Sass variables and CSS custom properties), `components/` (one file per control), `plugins/`, `states/` and `types/`. Class names follow BEM (`plyr__control--overlaid`) and are checked by Stylelint.

Other folders: `site/` is the plyr.io page, which is a Video.js 10 landing page and **doesn't use Plyr**. `tasks/` holds the build, sprite and CDN deploy (S3, `deploy.json`) scripts.

## Extension points

**Add a control (for example a toggle button):**

1. Add its name to `controls` in `src/js/config/defaults.js` (and to the list in `CONTROLS.md`).
2. Add a selector under `selectors.buttons` (for example `like: '[data-plyr="like"]'`), a label under `i18n`, and a `listeners` key set to `null`.
3. Render it in `controls.create()` (`src/js/controls.js`) with `createButton.call(this, '<name>', defaultAttributes)`. For a pressed/unpressed toggle, add a `case` in `createButton` that sets `toggle`, `label`, `labelPressed`, `icon` and `iconPressed`.
4. Add an icon at `src/sprite/plyr-<name>.svg`. It ends up in `dist/plyr.svg` (see the icon quirk below).
5. Bind it in `Listeners.controls()` (`src/js/listeners.js`): `this.bind(elements.buttons.<name>, 'click', handler, '<name>')`.
6. Style it in `src/sass/components/` and update `src/js/plyr.d.ts`.

**Add an option:** give it a default in `src/js/config/defaults.js`, read it as `this.config.<option>`, and add it to `Options` in `plyr.d.ts`. Users can also set it through `data-plyr-config`.

**Add an event:** fire it with `triggerEvent.call(player, player.media, '<name>', false, detail)` from `utils/events.js`, add the name to `events` in `defaults.js` so that it reaches the container (and `player.on`), and add it to the event maps in `plyr.d.ts`.

**Persist a user setting:** use `this.storage.set({ key: value })` and `this.storage.get('key')`. A new backend would replace or wrap `src/js/storage.js`.

## Develop

```bash
pnpm install          # pnpm only; npm and yarn are blocked
pnpm build:player     # builds dist/ (JS bundles, plyr.css, plyr.svg)
pnpm lint             # Oxlint, Stylelint and remark: what CI runs
pnpm fmt:check        # formatting check (CI); pnpm fmt fixes it
pnpm typecheck        # tsc for tasks/ and site/ only
pnpm dev              # plyr.io site at http://localhost:3000 (doesn't load Plyr)
pnpm build            # build:player, then build:site
```

CI (`.github/workflows/ci.yml`) runs `lint`, `fmt:check` and `typecheck` on every PR. It also runs `build:player` plus `node tasks/deploy.ts --dry-run` when `src/` or `tasks/` change, and `build:site` when `site/` changes.

## Known quirks

- **No tests and no demo.** There is no `test` script and there are no test files. Under pnpm 12, `pnpm test` exits 0 without running anything. The site doesn't use Plyr, so to see the player you need your own HTML page that loads `dist/plyr.css` and `dist/plyr.js`. `TODO(TL): verify` which test framework and demo page the stage 3 feature should add.
- **Build output is frozen.** The output must keep matching the published 3.8.x CDN files (see `AGENTS.md`). Don't change the `es2019` target, the CSS toolchain or the pinned `cssnano`, `sass`, `postcss-merge-rules` and `postcss-minify-selectors` versions.
- **Icons come from the CDN by default.** `iconUrl` defaults to `https://cdn.plyr.io/3.8.5/plyr.svg`, so a new icon in `src/sprite/` doesn't show until `iconUrl` points at the local `dist/plyr.svg`.
- **Legacy browser code.** IE and old Edge checks remain (`utils/browser.js`, `browser.isIE` in listeners and controls), even though these browsers aren't targeted.
- **Mutable `this`.** Modules use `fn.call(player)` and the player keeps many mutable fields. There are 24 `TODO`s in `src/js`, most of them in `plyr.js` and `controls.js`.
- **Upstream references.** `package.json`, the version banners and the remark link check (`repository:"sampotts/plyr"`) still point at `sampotts/plyr`. Release automation (release-please) targets `master`.
- **Sass warnings.** The build prints a Sass deprecation warning (`mixed-decls`); it is harmless.

## Credits

Plyr is developed by [@sam_potts](https://twitter.com/sam_potts) / [sampotts.dev](http://sampotts.dev) with help from the awesome [contributors](https://github.com/sampotts/plyr/graphs/contributors). It was originally ported from [PayPal's Accessible HTML5 Video Player](https://github.com/paypal/accessible-html5-video-player).

- [Cloudflare](https://www.cloudflare.com/) for providing the CDN and DNS services.
- [Sentry](https://sentry.io/) for error logging service on the demo website.
- [Fastly](https://fastly.com/) for CDN services in the past.
- [An awesome guide for Plyr in Japanese!](http://syncer.jp/how-to-use-plyr-io) by [@arayutw](https://twitter.com/arayutw)

This project exists thanks to all the people who contribute ([contribute](CONTRIBUTING.md)).

<a href="https://github.com/sampotts/plyr/graphs/contributors"><img src="https://opencollective.com/plyr/contributors.svg?width=890&button=false" /></a>

## Copyright and License

[The MIT license](LICENSE.md)
