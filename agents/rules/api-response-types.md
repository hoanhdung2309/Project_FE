## Use Base Response Wrappers for API Types

**Impact: HIGH (consistent response shape and type safety across domains)**

All API response types must extend the shared base wrappers `DataResponse<T>` or `DataPaginationResponse<T>` from `packages/api/src/types.ts`. This ensures every response has a consistent shape (`code`, `data`, `meta`) and paginated responses include `page`, `pageSize`, `total`, `hasNext`, `hasPrevious`. Define domain-specific data as a separate interface and compose it with the base wrapper.

**Incorrect (ad-hoc response types):**

```typescript
// packages/api/src/hotel/types.ts
// ❌ No base wrapper — inconsistent shape, missing meta/code
export interface HotelDetailResponse {
  id: string
  name: string
  rating: number
}

// ❌ Re-inventing pagination fields
export interface HotelListResponse {
  items: Hotel[]
  currentPage: number
  totalItems: number
}
```

**Correct (extend base wrappers):**

```typescript
// packages/api/src/hotel/types.ts
import type { DataResponse, DataPaginationResponse } from "../types"

// Domain-specific data shape
export interface HotelDetailData {
  id: string
  name: string
  rating: number
}

// Single resource response
export interface HotelDetailResponse extends DataResponse<HotelDetailData> {}

// Paginated list response
export interface HotelListResponse extends DataPaginationResponse<HotelDetailData[]> {}
```

**Request types** do not need a base wrapper — define them as plain interfaces:

```typescript
export interface HotelSearchParams {
  checkIn: string
  checkOut: string
  destination: string
  guests: number
}
```

Reference: `packages/api/src/types.ts` (`DataResponse`, `DataPaginationResponse`, `Meta`).
