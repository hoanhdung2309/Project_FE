# Build, Test & Development Commands

All commands below are run from the **repository root** using **pnpm**.

## Development Commands

- `pnpm dev` - Start development (Turbo watch) for all apps; continues on failure
- `pnpm dev:web` - Start development for web app and its dependencies (`-F @vtrip/web...`)

## Build Commands

- `pnpm build` - Build all packages and apps (Turbo)
- `pnpm build:web` - Build web app and its dependencies only
- `pnpm clean` - Remove `.cache`, `.turbo`, `node_modules` (git clean)
- `pnpm clean:workspaces` - Run `clean` in each workspace (Turbo)

## Lint & Type Check

- `pnpm lint` - Run ESLint across the codebase (Turbo, with cache)
- `pnpm lint:fix` - Run ESLint and apply safe fixes
- `pnpm typecheck` - Run TypeScript type checking (Turbo, all workspaces)

## Format

- `pnpm format` - Check formatting with Prettier (no write)
- `pnpm format:fix` - Format code with Prettier (write)

## UI (Design System)

- `pnpm ui-add` - Add Shadcn UI component (runs in packages that expose `ui-add`; e.g. `packages/ui`)

## Testing

Unit tests use **Vitest**. When test scripts are added to workspaces, run from root:

- `pnpm turbo run test` - Run tests in all workspaces that define a `test` script
- Or from a specific package: `pnpm --filter @vtrip/core test` (if that package has a `test` script)

## Useful Development Patterns

### Running a single app or package

```bash
# Dev only for one app (e.g. web)
pnpm dev:web

# Build only one app and its dependencies
pnpm build:web

# Run a script in one workspace by name
pnpm --filter @vtrip/web dev
pnpm --filter @vtrip/ui typecheck
```

### Before pushing

```bash
pnpm typecheck
pnpm lint
pnpm format:fix
```

### Environment

- Use `.env` at repo root for local env vars; apps use `dotenv -e ../../.env` via `with-env` where needed (e.g. `apps/web`, `apps/_templates`).
