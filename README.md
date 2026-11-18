# Automation Testing

A stub web app for practicing CI/CD with GitHub Actions. It copies keeper-app's layout: a pnpm monorepo with a Next.js web app, a Hono api and a shared core package, plus Docker images in `infra/docker`.

The app keeps notes in memory: you can list, add and delete them. Restarting the api clears them.

## What is where

| Folder              | What it is                                                                        |
| ------------------- | --------------------------------------------------------------------------------- |
| `apps/web`          | The web app (Next.js 16, React 19, Tailwind 4). Reads from and writes to the api. |
| `apps/api`          | The api (Hono on Node, TypeScript, run with tsx). `/health` and `/api/notes`.     |
| `packages/core`     | Shared code: the note schema (zod), the in-memory store and the app version.      |
| `infra/docker`      | The two images: `Dockerfile.api` and `Dockerfile.web`.                            |
| `infra`             | `docker-compose.yml` runs both images together.                                   |
| `scripts`           | `dev.sh` (local dev) and `smoke-test.sh` (checks a running stack).                |
| `.github/workflows` | The CI/CD pipelines (below).                                                      |

## The stack

Node 20 or later, pnpm 9.12, TypeScript, Vitest, ESLint, Prettier.

## Set up and run

```
corepack enable          # gives you the pnpm version pinned in package.json
pnpm install
pnpm dev                 # api on http://localhost:3001, web on http://localhost:3000
```

Or run both images: `pnpm infra:up`, then `bash scripts/smoke-test.sh`. Stop them with `pnpm infra:down`.

## Test

```
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## The pipelines

| Workflow      | When it runs                                | What it does                                                                                          |
| ------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `ci.yml`      | Every PR, every push to `main`              | Formatting, lint and typecheck; tests on Node 20 and 22; production build kept as an artifact.        |
| `docker.yml`  | Every PR, every push to `main`              | Builds both images, starts them with compose and runs the smoke test. On `main`, pushes them to GHCR. |
| `deploy.yml`  | After Docker succeeds on `main`, or by hand | Simulated deploy to `staging`, then `production`. Nothing is really deployed.                         |
| `release.yml` | Pushing a `v*` tag                          | Tests, builds, and publishes a GitHub Release with generated notes.                                   |

Dependabot (`.github/dependabot.yml`) opens weekly PRs for npm and GitHub Actions updates.

### Things to try

- **Approval gate:** in the repo's Settings → Environments, create `production` and add yourself as a required reviewer. Each deploy then waits for your approval before production.
- **Branch protection:** require the `quality`, `test (node 20)`, `test (node 22)`, `build` and `e2e` checks before merging to `main`.
- **Break the build:** make a test fail on a branch, open a PR, and watch CI block it.
- **Cut a release:** `git tag v0.1.0 && git push origin v0.1.0`.
