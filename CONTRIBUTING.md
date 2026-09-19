# Contributing

We welcome bug reports, feature requests and pull requests. If you want to help us out, please follow these guidelines, in order to avoid redundant work.

## Support

Before asking questions, read our [documentation](https://github.com/sampotts/plyr) and [FAQ](https://github.com/sampotts/plyr/wiki/FAQ).

If these doesn't answer your question

- Use [Stack Overflow](https://stackoverflow.com/) for questions that doesn't directly involve Plyr. This includes for example how to use Javascript, CSS or HTML5 media in general, and how to use other frameworks, libraries and technology.
- Use [our Slack](https://bit.ly/plyr-chat) if you need help using Plyr or have questions about Plyr.

## Commenting

When commenting, keep a civil tone and stay on topic. Don't ask for [support](#support), or post "+1" or "I agree" type of comments. Use the emojis instead.

Asking for the status on issues is discouraged. Unless someone has explicitly said in an issue that it's work in progress, most likely that means no one is working on it. We have a lot to do, and it may not be a top priority for us.

We _may_ moderate discussions. We do this to avoid threads being "hijacked", to avoid confusion in case the content is misleading or outdated, and to avoid bothering people with github notifications.

## Creating issues

Please follow the instructions in our issue templates. Don't use github issues to ask for [support](#support).

## Contributing features and documentation

- If you want to add a feature or make critical changes, you may want to ensure that this is something we also want (so you don't waste your time). Ask us about this in the corresponding issue if there is one, or on [our Slack](https://bit.ly/plyr-chat) otherwise.

- Fork Plyr, and create a new branch in your fork, based on the **develop** branch

- To test locally, install dependencies with `pnpm install` and run `pnpm dev`, which serves the website in `site/` at http://localhost:3000 with hot reloading. Run `pnpm build` to build the player into `dist/` and the website into `site/dist/`, then `pnpm preview` to check the production site.

### Online one-click setup for contributing

You can use Gitpod (a free online VS Code-like IDE) for contributing. With a single click it will launch a workspace and automatically:

- Clone the Plyr repo.
- Install the workspace dependencies with `pnpm install`.
- Run `pnpm dev` in the root directory to start the dev server.

So that you can start straight away.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

- Develop and test your modifications.

- Preferably commit your changes as independent logical chunks, with meaningful messages. Make sure you do not commit unnecessary files or changes, such as the build output, or logging and breakpoints you added for testing.

- If your modifications changes the documented behavior or add new features, document these changes in [README.md](README.md).

- When finished, push the changes to your GitHub repository and send a pull request. Describe what your PR does.

- If the Travis build fails, or if you get a code review with change requests, you can fix these by pushing new or rebased commits to the branch.

## Tooling

A pre-commit hook lints and formats the files you stage (`vp staged`, configured under `staged` in `vite.config.ts` and installed by `pnpm install` through the `prepare` script). If a commit is rejected, fix the reported problems and commit again; formatting fixes are applied for you.

Use Node.js 22.18+ (22.x), 24.11+ or a newer supported release and pnpm 12. Run `pnpm lint` for Oxlint, Stylelint, and Markdown link checks, `pnpm typecheck` for TypeScript, and `pnpm fmt` to format with Oxfmt (`pnpm fmt:check` in CI). The player continues to use Sass; the website uses Tailwind through the Vite plugin.

`pnpm build:player` builds the player into `dist/` with Vite+ (Rolldown and Oxc, no Babel). The JavaScript is lowered to ES2019, which matches the previously published builds: class fields, `??` and `?.` are transpiled for older Safari releases while classes, arrow functions and async/await are kept. The `browserslist` in `package.json` lists the browsers from the README and drives Autoprefixer for the CSS.

## Releases

Releases are automated with [release-please](https://github.com/googleapis/release-please) and GitHub Actions, and every release needs a manual approval:

1. Land changes on `master` using [Conventional Commits](https://www.conventionalcommits.org) (`fix:`, `feat:`, `docs:` and so on). Commits decide the next version and write the changelog. Commits that only touch the website (`site/`) or editor config (`.vscode/`, `.claude/`) are ignored: the site is deployed separately by Vercel and shares no code with the player, so it never triggers or appears in a release. release-please can only exclude whole directories, and a commit counts as soon as it touches one file outside them, so keep site work inside `site/` and give it a `chore(site):` type when it has to touch root files such as `README.md` (`chore` commits are hidden from the changelog and never bump the version). The site has its own `site/pnpm-lock.yaml` for the same reason: `sharedWorkspaceLockfile: false` in `pnpm-workspace.yaml` keeps site dependency changes out of the root lockfile.
2. The **Release** workflow keeps a `chore(release): vX.Y.Z` pull request up to date with the version bump, `CHANGELOG.md`, and the version strings in `README.md`, `src/js/plyr.js`, `src/js/plyr.polyfilled.js` and `src/js/config/defaults.js` (look for the `x-release-please-version` markers). The workflow does not run at all for site-only pushes.
3. Review and merge that pull request when you are ready to release. Merging creates the `vX.Y.Z` tag and GitHub release.
4. The `publish` job then builds the player, publishes `plyr` to npm (via npm trusted publishing, so no npm token is stored) with provenance, uploads the build to `cdn.plyr.io` and attaches a zip to the GitHub release. It runs in the `Production` environment, so you can require a second approval there in the repository settings.

The workflow expects these repository settings: the `RELEASE_APP_ID` variable and `RELEASE_APP_PRIVATE_KEY` secret for a GitHub App with contents and pull request write access (so the release pull request triggers CI), plus the `CF_ACCOUNT_ID`, `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` secrets. npm publishing uses a trusted publisher configured on npmjs.com for `sampotts/plyr`, workflow `release.yml`, environment `Production`. `node tasks/deploy.ts --dry-run` lists what would be uploaded to the CDN without credentials.

CI runs lint, formatting and type checks on every change, and builds the player or the site only when their files changed.

## Website

The `site/` workspace is a small React 19 and TypeScript app built with Vite. There is no router and no server: `pnpm build:site` bundles the page, renders it to static HTML with React, and writes the result to `site/dist/`, which React hydrates in the browser. The demo player is [Video.js 10](https://videojs.org) (`@videojs/react`) streaming from Mux.

Run `pnpm dev` for the dev server at http://localhost:3000, or `pnpm preview` to serve the production build.

The site deploys to Vercel. The Vercel project has its **Root Directory** set to `site`, and `site/vercel.json` supplies the rest: pnpm installs the workspace (the site's dependencies come from `site/pnpm-lock.yaml`), `pnpm build` runs, and `dist` is served as a static site. Because a root directory is set, Vercel skips deployments for commits that change nothing under `site/`. The site has no dependency on the player source, and publishing the player to `cdn.plyr.io` is a separate process (see Releases).
