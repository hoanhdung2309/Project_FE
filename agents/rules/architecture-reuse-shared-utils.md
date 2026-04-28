## Reuse Shared Utilities — Do Not Reinvent

**Impact: HIGH (prevents duplication, ensures consistent behavior across the codebase)**

Before writing a new helper function, always search the existing codebase for utilities that already handle the same concern. Common areas like formatting (price, date, currency), string manipulation, URL construction, and form helpers are likely already solved. Duplicating logic leads to inconsistent behavior, harder maintenance, and bundle bloat.

### Process

1. **Search first** — Before writing any utility logic, search `packages/core/src/shared/utils/`, `packages/utils/src/`, `packages/lib/src/`, and the relevant domain `utils/` folder for existing functions.
2. **Reuse if found** — Import and use the existing utility. Do not copy-paste or rewrite inline.
3. **Extend if close** — If an existing utility almost fits, extend it with an option rather than creating a parallel version.
4. **Create only as last resort** — If nothing exists, create the utility in the correct location (see below).

### Common patterns to check before writing

| Concern | Search for |
|---------|-----------|
| Formatting numbers, prices, currency | `shared/utils/price` |
| Date formatting, night calculation | `shared/utils/date`, `lib/i18n/date-fns` |
| Building asset or page URLs | `shared/utils/asset`, `shared/utils/web-url` |
| Form scroll, field focus, error display | `shared/utils/form` |
| String manipulation (capitalize, slugify, parse) | `utils/string`, `shared/utils/string` |
| Locale path, language switching | `shared/utils/locale-path` |
| Query key creation, query option types | `lib/react-query` |
| URL search param serialization | domain-specific `utils/*-params` files |
| Domain display labels (composite strings) | `domains/{domain}/utils/` |
| Domain constants (status, limits, defaults) | `domains/{domain}/constants/` |
| Safe non-negative numbers (guard NaN, null, negative) | `@vtrip/utils/number` (`safePositive`) |
| CSS class merging with `className` prop | `@vtrip/ui/lib/utils` (`cn`) |

**Incorrect (reimplementing what already exists):**

```typescript
// ❌ Inline formatting — a shared formatter exists
const display = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)

// ❌ Manual date math — a shared calculator exists
const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))

// ❌ Hardcoded env URL — a shared URL builder exists
const url = `${import.meta.env.VITE_WEB_CDN_ASSET_URL}/assets/images/hero.png`

// ❌ Inline composite label — extract to a domain util
const label = `${item.typeName} - ${item.planName}`

// ❌ Inline status-to-style mapping — extract to a domain constant/util
const style = status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"

// ❌ Template literal className — cn() utility exists
<div className={`rounded-lg ${className}`} />
```

**Correct (search, find, import):**

```typescript
import { formatCurrency } from "@vtrip/core/shared/utils/price.utils"
import { calculateNights } from "@vtrip/core/shared/utils/date"
import { webAsset } from "@vtrip/core/shared/utils/asset"
import { formatItemLabel } from "@vtrip/core/domains/{domain}/utils/item-label"
import { getStatusStyle } from "@vtrip/core/domains/{domain}/constants/status"
import { cn } from "@vtrip/ui/lib/utils"

const display = formatCurrency(price)
const nights = calculateNights(checkIn, checkOut)
const url = webAsset("/assets/images/hero.png")
const label = formatItemLabel(item.typeName, item.planName)
const style = getStatusStyle(status)
<div className={cn("rounded-lg", className)} />
```

### Where to create new utilities

When no existing utility fits:

| Scope | Location |
|-------|----------|
| **Shared across domains** | `packages/core/src/shared/utils/` |
| **Domain-specific** | `packages/core/src/domains/{domain}/utils/` |
| **Pure generic helpers** (no project imports) | `packages/utils/src/` |
| **Framework/SDK wrappers** | `packages/lib/src/` |

Always export the function and reuse it — do not inline logic that could be shared.

Reference: `packages/core/src/shared/utils/`, `packages/utils/src/`, `packages/lib/src/`.
