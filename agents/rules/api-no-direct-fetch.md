## Never Use Raw fetch — Always Use the API Client

**Impact: CRITICAL (consistent auth, headers, error handling, and base URL resolution)**

All HTTP requests to backend services must go through the `api` instance from `@vtrip/core/api`, which uses the `Client` class from `@vtrip/api`. Never use `fetch`, `axios`, or other HTTP libraries directly. The API client automatically handles: JWT token injection, `Accept-Language` and `X-Channel-Id` headers, base URL resolution (SSR vs browser), CORS credentials, JSON parsing, and typed `FetchError` for non-2xx responses.

**Incorrect (raw fetch or axios):**

```typescript
// ❌ In a component, hook, or loader — bypasses auth, headers, error handling
const response = await fetch("/dplatform-hotel/api/v1/hotel/123")
const data = await response.json()

// ❌ Using axios — different error shape, no shared config
import axios from "axios"
const { data } = await axios.get("/api/hotel/123")
```

**Incorrect (creating a new Client/VtripAPI instance per request):**

```typescript
// ❌ New instance loses token state and shared config
import VtripAPI from "@vtrip/api"
const tempApi = new VtripAPI({ baseUrl: "/api" })
const data = await tempApi.hotel.detail.getHotelDetail("123")
```

**Correct (use the shared api instance):**

```typescript
// In packages/core (queries, mutations)
import { api } from "@vtrip/core/api"

const data = await api.hotel.detail.getHotelDetail("123")
```

**Correct (for streaming endpoints):**

```typescript
import { api } from "@vtrip/core/api"

// Uses client.fetchStream for SSE
const { stream, abort } = await api.client.fetchStream("/api/v1/events", {
  method: "GET",
})
```

The single `api` instance is created in `packages/core/src/api.ts` — this is the only place where `new VtripAPI(...)` should be called.

Reference: `packages/core/src/api.ts`, `packages/api/src/client.ts`, `packages/api/src/index.ts`.
