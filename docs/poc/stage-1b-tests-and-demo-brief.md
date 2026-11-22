# Stage 1b brief — Add a test setup and a demo page (tech-lead task)

**Raised by:** Tech lead, after the Stage 1 README review found no tests and no demo
**Repo:** `Prad-n/plyr` · **Branch:** `chore/add-tests-and-demo` (from `uat`, after the README PR is merged) · **PR to:** `uat`

## Why

The legacy app has no automated tests and no page that shows the player. Without these, an agent building a feature has nothing to check its work against, and reviewers have nothing to look at. This task adds the minimum safety net before any feature work starts.

## Ask the agent

1. **Test setup**
   - Add a test runner that fits the existing toolchain. Prefer Vitest through Vite+ (`vp test`) if it's available; otherwise add Vitest as a dev dependency. Use a DOM environment (jsdom or happy-dom).
   - Add a `test` script so `pnpm test` really runs the tests.
   - Write a small number of **smoke tests**, about 3 to 5. They should check that a player can be created on a `<video>` element, that the default controls are rendered, and that `play`/`pause` and one event fire as expected. Mock the browser media APIs where needed.
   - Add `pnpm test` to the CI workflow next to lint and typecheck.
2. **Demo page**
   - Add `demo/index.html`. It loads the **local** build (`dist/plyr.css`, `dist/plyr.js`) and sets `iconUrl` to the local `dist/plyr.svg`.
   - Use one openly licensed video (for example Blender's _Sintel_ or _Big Buck Bunny_, CC BY), linked rather than committed if it's large. Add a credit line.
   - Add a `demo` script that builds the player and serves the page locally. Document the URL.
3. **README:** update the "Develop" section with `pnpm test` and `pnpm demo`, and update the "Known quirks" line about missing tests and demo.

## Rules

- Don't change the player's source in `src/` or its build output. Respect `AGENTS.md`: don't change the build target, the CSS toolchain or the pinned versions.
- Keep the new dependencies to the test runner and DOM environment only.
- Before you start, give a short plan: the runner you picked and why, and the tests you'll write.
- Work on the branch above, open a PR to `uat`, and don't merge.

## Done when

- `pnpm test` runs and passes locally and in CI.
- `pnpm demo` shows a working Plyr player with the default controls.
- The PR description lists the tests and includes a screenshot of the demo.

## Out of scope

Full test coverage, refactoring, upgrading dependencies, the like/unlike feature (FEAT-001).
