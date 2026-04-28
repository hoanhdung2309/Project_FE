## No Magic Numbers — Use Named Constants

**Impact: HIGH (readable, maintainable, single source of truth for business values)**

Numeric or string literals that represent business logic, defaults, or configuration must be extracted into named constants. Magic numbers make code harder to understand and update — when the same value appears in multiple places, a change requires finding every occurrence.

**Incorrect (magic numbers scattered across files):**

```typescript
// In hotel-search-params.ts
adults: parseAsInteger.withDefault(2),
children: parseAsInteger.withDefault(0),
rooms: parseAsInteger.withDefault(1),

// In hotel-checkout-params.ts — same values duplicated
adults: parseAsInteger.withDefault(2),
children: parseAsInteger.withDefault(0),

// In a utility
adults: adults ?? 2,
children: children ?? 0,
```

**Correct (named constants in a constants file):**

```typescript
// packages/core/src/domains/hotel/constants/hotel-booking-limits.ts
export const HOTEL_BOOKING_DEFAULTS = {
  ADULTS: 2,
  CHILDREN: 0,
  INFANTS: 0,
  ROOMS: 1,
} as const

// In hotel-search-params.ts
import { HOTEL_BOOKING_DEFAULTS } from "../constants/hotel-booking-limits"

adults: parseAsInteger.withDefault(HOTEL_BOOKING_DEFAULTS.ADULTS),
children: parseAsInteger.withDefault(HOTEL_BOOKING_DEFAULTS.CHILDREN),
rooms: parseAsInteger.withDefault(HOTEL_BOOKING_DEFAULTS.ROOMS),
```

### When to extract

- Default values for form fields, query params, or API payloads
- Limits (max retries, max length, timeouts)
- Thresholds, counts, or sizes that carry business meaning
- Any numeric literal used in more than one place

### Exceptions (no extraction needed)

- CSS/Tailwind values (`gap-4`, `p-6`)
- Array indices (`[0]`)
- Truly self-evident values in a single-use context (`setHours(0, 0, 0, 0)`)
- Mathematical constants (`* 2` for doubling, `/ 100` for percentage)

### Where to place constants

- Domain-specific: `packages/core/src/domains/{domain}/constants/`
- Shared across domains: `packages/core/src/shared/constants/`

Reference: `packages/core/src/domains/hotel/constants/hotel-booking-limits.ts`.
