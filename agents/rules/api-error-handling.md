## Use FetchError for API Error Handling

**Impact: HIGH (typed errors, consistent error handling across the app)**

The API client throws `FetchError` (from `@vtrip/api`) for any HTTP status >= 300. Always type errors as `FetchError` in TanStack Query hooks and mutation handlers. Access `status`, `statusText`, and `jsonError` for structured error information. Do not catch and re-throw generic `Error` — let `FetchError` propagate so consumers get typed HTTP error details.

**Incorrect (untyped error or swallowing FetchError):**

```typescript
// ❌ Generic error type — loses HTTP status and response body
export const useGetHotelQuery = (id: string) =>
  useQuery<HotelDetailResponse, Error>({
    queryKey: hotelKeys.detail(id),
    queryFn: () => api.hotel.detail.getHotelDetail(id),
  })

// ❌ Catching and re-throwing as generic Error
try {
  const data = await api.hotel.detail.getHotelDetail(id)
} catch (e) {
  throw new Error("Failed to fetch hotel")
}
```

**Correct (typed FetchError):**

```typescript
import type { FetchError } from "@vtrip/api"

// In query hooks — FetchError as error type
export const useGetHotelQuery = (
  id: string,
  options?: UseQueryOptionsWrapper<HotelDetailResponse, FetchError>
) =>
  useQuery({
    queryKey: hotelKeys.detail(id),
    queryFn: () => api.hotel.detail.getHotelDetail(id),
    ...options,
  })

// In mutation hooks
export const useCreateBookingMutation = (
  options?: UseMutationOptionsWrapper<CreateBookingPayload, CreateBookingResponse, FetchError>
) =>
  useMutation({
    mutationFn: (body) => api.bookingEngine.booking.createBooking(body),
    ...options,
  })
```

**Correct (handling FetchError in components):**

```typescript
import { FetchError } from "@vtrip/api"

const { error } = useGetHotelQuery(id)

if (error) {
  // Access typed properties
  console.error(error.status)     // HTTP status code
  console.error(error.statusText) // HTTP status text
  console.error(error.jsonError)  // Parsed error response body
}
```

Reference: `packages/api/src/client.ts` (`FetchError` class), `packages/api/src/index.ts`.
