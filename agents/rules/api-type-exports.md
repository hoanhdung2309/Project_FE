## API Type Export and Import Conventions

**Impact: MEDIUM (clean imports, no leaking internals)**

Each API domain module re-exports its types via `export type * from "./types"` in the domain's `index.ts`. The main `packages/api/src/index.ts` re-exports all domains with `export * from "./domain"`. Consumers import types from `@vtrip/api` (top-level) or `@vtrip/api/types/<domain>` (direct). Always use `import type` for type-only imports. Do not import internal classes (`Client`, domain classes) outside of `packages/api` — only import the `api` instance from `@vtrip/core/api`.

**Incorrect (importing internals or missing `type` keyword):**

```typescript
// ❌ Importing the Client class directly in app/block code
import { Client } from "@vtrip/api"

// ❌ Importing domain class instead of using api instance
import { SearchAvailability } from "@vtrip/api"
const search = new SearchAvailability(client)

// ❌ Non-type import for types — increases bundle size
import { HotelDetailResponse } from "@vtrip/api"
```

**Correct (type imports from barrel):**

```typescript
// ✅ Types from top-level barrel
import type { RecommendationResponse, FetchError } from "@vtrip/api"

// ✅ Types from domain-specific path
import type { CreateBookingPayload } from "@vtrip/api/types/booking"

// ✅ API instance from core (not from api package directly)
import { api } from "@vtrip/core/api"
```

**Adding types for a new domain:**

1. Define types in `packages/api/src/<domain>/types.ts`
2. Re-export in `packages/api/src/<domain>/index.ts` with `export type * from "./types"`
3. Re-export the domain in `packages/api/src/index.ts` with `export * from "./<domain>"`
4. If needed, add a path export in `packages/api/package.json` under `"exports"`

Reference: `packages/api/package.json` (exports map), `packages/api/src/index.ts`.
