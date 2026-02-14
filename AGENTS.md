# AGENTS.md

## README Sync Requirements

- Keep `README.md` up to date in every change that modifies gameplay behavior, controls, scoring, spawning, obstacle mechanics, or rendering.
- If an obstacle type is added/removed/renamed, update the obstacle behavior table and the corresponding image links in `README.md` in the same commit.
- Do not merge gameplay code changes while `README.md` behavior descriptions are stale.
- `obstacleId` documentation must describe catalog metadata only unless runtime behavior explicitly depends on it.

## Versioning Requirements

- Bump the project version on every code change by updating `package.json` (and `package-lock.json` when present).
- Keep the splash screen version text in sync with the bumped version in both `src/main.ts` and `dist/main.js`.
