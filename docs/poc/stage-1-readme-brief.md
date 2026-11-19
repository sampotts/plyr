# Stage 1 brief — Agent writes the README for the legacy app

**Status:** Ready to run · **Repo:** `prad-n/plyr` · **Reviewer:** Tech lead (Pradeep)

## Ask the agent

Read the Plyr codebase and rewrite `README.md` so that an agent (or a new developer) can tell whether a requested feature is feasible and where it would go. Keep it concise, about 1–2 screens.

## The README must cover

1. **Purpose:** what the player does, in two or three lines.
2. **Tech stack:** language, build tool, test framework, runtime and browser targets, main dependencies.
3. **Architecture:** the main modules and how they fit together: player core, controls/UI, config and options, events, plugins or providers (YouTube/Vimeo), styles.
4. **Extension points:** where you add a new control, option or event.
5. **Develop:** install, build, test and run the demo. Every command must work as written.
6. **Known quirks:** anything legacy, outdated or surprising that the agent found.

## Rules for the agent

- Base every statement on the code. Mark anything it isn't sure of with `TODO(TL): verify`.
- Keep the licence and credits.
- Change only the docs and agent settings; no source code.
- Add `.claude/settings.json` with deny rules for `gh pr merge` and for `git push` to `master` or `uat`.
- Work on branch `docs/update-readme`. Open a PR to `uat`. Don't merge.

## Tech lead review

Correct anything wrong, resolve each `TODO(TL)`, then approve. Note each correction in the learnings log, because each one shows what an agent can and can't work out on its own.
