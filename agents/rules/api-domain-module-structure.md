## API Domain Module Structure

**Impact: HIGH (consistent API organization and discoverability)**

Each API domain must follow the standard module structure: a directory with an `index.ts` (domain class aggregating endpoints), a `types.ts` (request/response types), and one file per endpoint group. The domain class receives the `Client` instance and exposes endpoint groups as properties.

**Incorrect (flat files, no domain class):**

```typescript
// packages/api/src/hotel.ts — everything in one file, no structure
export function getHotelDetail(id: string) {
  return fetch(`/api/hotel/${id}`)
}

export function searchHotels(params: SearchParams) {
  return fetch(`/api/hotel/search`)
}
```

**Correct (domain module with class, endpoints, and types):**

```
packages/api/src/hotel/
├── index.ts        # Domain class + re-exports types
├── types.ts        # All request/response types for this domain
├── hotel-detail.ts # Endpoint group: detail
└── hotel-search.ts # Endpoint group: search
```

```typescript
// packages/api/src/hotel/hotel-detail.ts
import type { Client } from "../client"
import type { HotelDetailResponse } from "./types"

export class HotelDetail {
  constructor(private client: Client) {}

  getHotelDetail(id: string, headers?: HeadersInit) {
    return this.client.fetch<HotelDetailResponse>(`/dplatform-hotel/api/v1/hotel/${id}`, {
      method: "GET",
      headers,
    })
  }
}
```

```typescript
// packages/api/src/hotel/index.ts
import type { Client } from "../client"
import { HotelDetail } from "./hotel-detail"
import { HotelSearch } from "./hotel-search"

export class Hotel {
  public detail: HotelDetail
  public search: HotelSearch

  constructor(client: Client) {
    this.detail = new HotelDetail(client)
    this.search = new HotelSearch(client)
  }
}

export type * from "./types"
```

Then register the domain in the main `VtripAPI` class (`packages/api/src/index.ts`).

Reference: `packages/api/src/search-availability/`, `packages/api/src/booking/`, `packages/api/src/iam/`.
