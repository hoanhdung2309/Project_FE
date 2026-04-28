---
paths:
  - "**/*-params.ts"
  - "**/use-*-params.ts"
  - "**/root.tsx"
---

## NUQS for URL Search Params

Use NUQS instead of `useState` or `useSearchParams` for URL state (filters, page, sort, date range).

### Setup

Wrap app root once with `NuqsAdapter`:

```tsx
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
```

### File split

- **Config** in `utils/{domain}-search-params.ts` — parser config + `createSerializer`
- **Hook** in `hooks/use-{domain}-search-params.ts` — thin `useQueryStates(config)` wrapper

Do not mix hook and config in one file. Config must be importable without React.

### Parsers

Always use typed parsers with `.withDefault()`:

```tsx
const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
```

### Serializer

Use `createSerializer(parserConfig)` instead of manual `URLSearchParams`. Define in the same file as parser config.

```tsx
export const serialize = createSerializer(parserConfig)
// serialize("/hotel/search", values) → "/hotel/search?adults=2&rooms=1"
```

`null` values and defaults are auto-omitted.

### Options

- `history: 'push'` — creates browser history entry
- `shallow: false` — triggers router loader re-run
