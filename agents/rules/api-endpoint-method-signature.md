## API Endpoint Method Signature

**Impact: MEDIUM (consistent method signatures across all endpoints)**

Endpoint methods in API domain classes must follow a consistent signature pattern. Use `this.client.fetch<ResponseType>()` with the full service path. Accept required parameters first (path params, query params, or request body), then an optional `headers` parameter for per-request header overrides. Always specify the generic response type on `client.fetch<T>()`.

**Incorrect (inconsistent signatures):**

```typescript
// ❌ No response type generic — result is untyped
getHotelDetail(id: string) {
  return this.client.fetch(`/api/hotel/${id}`, { method: "GET" })
}

// ❌ Headers as required param
searchHotels(params: SearchParams, headers: HeadersInit) {
  return this.client.fetch<SearchResponse>(`/api/hotel/search`, {
    method: "POST",
    body: params,
    headers,
  })
}

// ❌ Mixing query and body in wrong places
getList(body: ListParams) {
  return this.client.fetch<ListResponse>(`/api/hotel`, {
    method: "GET",
    body,  // GET should not have body
  })
}
```

**Correct (GET with query params):**

```typescript
getHotelDetail(id: string, headers?: HeadersInit) {
  return this.client.fetch<HotelDetailResponse>(
    `/dplatform-hotel/api/v1/hotel/${id}`,
    {
      method: "GET",
      headers,
    }
  )
}
```

**Correct (GET with query object):**

```typescript
searchHotels(query: HotelSearchParams, headers?: HeadersInit) {
  return this.client.fetch<HotelSearchResponse>(
    `/dplatform-hotel/api/v1/hotel/search`,
    {
      method: "GET",
      query,
      headers,
    }
  )
}
```

**Correct (POST with body):**

```typescript
createBooking(body: CreateBookingPayload, headers?: HeadersInit) {
  return this.client.fetch<CreateBookingResponse>(
    `/dplatform-booking-engine/api/v1/booking`,
    {
      method: "POST",
      body,
      headers,
    }
  )
}
```

The `client.fetch` automatically serializes `body` to JSON and `query` to query string (via `qs`, skipping nulls).

Reference: `packages/api/src/client.ts`, `packages/api/src/booking/booking.ts`, `packages/api/src/search-availability/recommendation.ts`.
