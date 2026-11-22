# PoC plan — legacy app → AI-ready → agent-delivered feature

**Owner:** Pradeep (PM; also plays the tech lead) · **Repo:** `prad-n/plyr` (fork of a 2015, pre-AI player) · **Publish target:** Mon 1 Dec

## Decisions (18 Nov)

- Naming: only PM feature requests get an ID (`FEAT-001`). Branches use a type prefix: `docs/...` for documentation, `feature/FEAT-xxx-...` for features.
- PRs target **`uat`**. `master` (the default branch) is left alone until stage 5.
- Stage 3 is **triggered by hand** in Claude Code. Automation in GitHub Actions is a "next phase".
- Phase 2 persistent storage is **Amazon MemoryDB**, done later.

## Stages

| #   | Stage                        | Who                      | What happens                                                                                                                                                                                                                                                                                  | Artifacts (for the repo and the story)                                                                                               | Target     |
| --- | ---------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 1   | **README for agents**        | Agent writes, TL reviews | The agent reads the legacy code and writes a concise README.md: purpose, tech stack, architecture, how to build and test, extension points. The TL reviews and corrects it in a PR.                                                                                                           | `README.md` (before/after diff), branch `docs/update-readme`, PR with TL review comments (brief: `docs/poc/stage-1-readme-brief.md`) | Fri 21 Nov |
| 1b  | **Tests and demo (TL task)** | TL raises, agent builds  | The README review found no tests and no demo. The agent adds a minimal test setup with smoke tests, a local demo page and `pnpm test` in CI, so later feature work can be checked and seen.                                                                                                   | Branch `chore/add-tests-and-demo`, PR with test results and a demo screenshot (brief: `docs/poc/stage-1b-tests-and-demo-brief.md`)   | Mon 24 Nov |
| 2   | **PM feature request**       | PM                       | A plain-English request with a feature ID, business benefit, rationale and priority: like/unlike, saved locally first, then in persistent storage.                                                                                                                                            | `docs/requests/FEAT-001-like-unlike.pdf`                                                                                             | Sat 22 Nov |
| 3   | **TL review → agent build**  | TL, then agent           | The TL checks feasibility and moves the issue to `status:ready-for-dev`, then starts Claude Code by hand. The agent reads the PDF and README, writes an agent-ready spec, creates `feature/FEAT-001-like-unlike`, implements, runs the tests and opens a PR to `uat` that waits for approval. | GitHub issue with status history, `docs/specs/FEAT-001.md` (written by the agent), feature branch, PR with test results              | Wed 26 Nov |
| 4   | **Merge to UAT**             | Human approves           | The TL reviews and approves the PR, then merges it into `uat`. Optional: `uat` publishes a live demo.                                                                                                                                                                                         | Approved PR, merge record, demo link (optional)                                                                                      | Thu 27 Nov |
| 5   | **Onward**                   | Manual                   | Promotion from UAT to master and production stays manual.                                                                                                                                                                                                                                     | Described in the article as "next phases"                                                                                            | —          |

## Human inputs (PM / TL)

1. Setup: fork ✅, private email ✅, create the `uat` branch, branch protection on `uat` and `master` ✅ (18 Nov).
2. Stage 1: review and approve the agent's README. Stage 1b: raise and approve the tests-and-demo task.
3. Stage 2: write the FEAT-001 PDF and attach it to a GitHub issue.
4. Stage 3: check feasibility, change the label, start Claude Code.
5. Stage 4: review and approve the PR, then merge into `uat`.

## Stage 3 trigger prompt (to run in Claude Code)

> Read issue #<N> and its attached PDF, plus README.md. Write `docs/specs/FEAT-001.md` covering scope, acceptance criteria, design, tests and out-of-scope. Then create `feature/FEAT-001-like-unlike`, implement it with tests, run the test suite, and open a PR to `uat` that references the issue. Do not merge. Stay within the spec.

## Guardrails

- The agent can't merge. Branch protection on `uat` and `master` requires a human approval.
- The agent works only on `feature/*` branches, within the spec.
- Every stage that changes code ends in a PR for a human to review.

## Next phases (for the article)

- Automation: a GitHub Action starts stage 3 when the label changes.
- Persistent storage: Amazon MemoryDB behind the like feature's storage interface.
- Real user identity in place of the demo's mock user.

## Running record

- `learnings-log.md`: lessons as they happen, for the article.
