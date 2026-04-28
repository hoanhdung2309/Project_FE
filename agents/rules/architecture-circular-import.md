---
title: Circular Import & Layer Dependencies
impact: CRITICAL
impactDescription: Prevents circular dependencies and enforces monorepo layer boundaries
tags: architecture, circular-import, monorepo, layers, dependencies
---

## Circular Import & Layer Dependencies

**Impact: CRITICAL (prevents circular dependencies and enforces monorepo layer boundaries)**

The project follows a strict layered architecture. Each package has defined **allowed** and **forbidden** imports. Violating these rules causes circular dependencies, unclear boundaries, and harder maintenance. Always respect the dependency flow: **apps → blocks → core**; **ui** and **api** are lower-level; **utils** and **lib** are leaves.

### Layer order (higher layers may import lower layers only)

1. **apps/** — Entry / Routing  
2. **blocks** — Smart UI / Page logic  
3. **core** — Business logic / Data  
4. **ui** (view atoms) and **api** (data access)  
5. **utils** and **lib** — Pure helpers / SDKs  

### Allowed vs forbidden imports (by package)

| Package   | May import              | Must NOT import        |
| --------- | ----------------------- | ---------------------- |
| `apps/*`  | blocks, core, ui, api, utils | —                      |
| `blocks`  | ui, core, api, utils    | apps/*                 |
| `core`    | api, utils              | apps/*, blocks, ui     |
| `ui`      | utils                   | apps/*, blocks, core, api |
| `api`     | utils                   | apps/*, blocks, core, ui, lib |
| `utils`   | —                       | apps/*, blocks, core, ui, lib |
| `lib`     | utils                   | apps/*, blocks, core, ui, api |

**Incorrect (core importing from ui — forbidden):**

```typescript
// packages/core/src/domains/hotel/use-hotel-search.ts
import { Button } from '@vtrip/ui/components/button' // ❌ core must not import ui

export function useHotelSearch() {
  // ...
  return { data, isLoading }
}
```

**Correct (core is headless; only api and utils):**

```typescript
// packages/core/src/domains/hotel/use-hotel-search.ts
import { getHotelSearch } from '@vtrip/api/hotel' // ✅ api
import { formatDate } from '@vtrip/utils/date'    // ✅ utils

export function useHotelSearch() {
  // ...
  return { data, isLoading }
}
```

**Incorrect (ui importing from core or blocks):**

```typescript
// packages/ui/src/components/booking-card.tsx
import { useHotelDetail } from '@vtrip/core/hotel' // ❌ ui must not import core

export function BookingCard() {
  const { data } = useHotelDetail()
  return <div>{data?.name}</div>
}
```

**Correct (blocks use core; ui stays stateless):**

```typescript
// packages/blocks/src/domains/hotel/hotel-card.tsx
import { useHotelDetail } from '@vtrip/core/hotel' // ✅ blocks may import core
import { Card } from '@vtrip/ui/components/card'  // ✅ blocks may import ui

export function HotelCard({ id }: { id: string }) {
  const { data } = useHotelDetail(id)
  return <Card>{data?.name}</Card>
}
```

**Incorrect (blocks importing from apps):**

```typescript
// packages/blocks/src/shared/header.tsx
import { useRouteLoaderData } from '@/root' // ❌ blocks must not import apps/*

export function Header() {
  const data = useRouteLoaderData()
  return <header>...</header>
}
```

**Correct (apps pass data down or use core):**

```typescript
// apps/web/app/routes/_layout.tsx
import { Header } from '@vtrip/blocks/layouts/header'

export function Layout() {
  return <Header />
}
```

```typescript
// packages/blocks/src/shared/header.tsx
export function Header() {
  return <header>...</header>
}
```

### Business logic belongs in `core`, not `blocks`

`blocks` is for **UI composition** — React contexts, layout, rendering. All **business logic** (state orchestration, validation schemas, API call coordination, countdown/timer logic, data transformation) must live in `core` as custom hooks or utility functions. `blocks` components consume these via thin context wrappers.

A **thin context wrapper** in `blocks` must contain **zero** `useState`, `useReducer`, `useMemo`, `useCallback`, or any other stateful/derived logic. It calls core hooks, receives their return values, and passes them into a React context — nothing else. If you need local state (e.g. `hasSubmitted`, form validation gating, loading flags), that state belongs in the core hook, not in the blocks provider.

**Incorrect (business logic in blocks):**

```typescript
// packages/blocks/src/domains/{domain}/{feature}-context.tsx
// ❌ Data fetching, validation, state orchestration in blocks
export function FeatureProvider({ children }) {
  const detail = useQuery(...)              // ❌ API coordination
  const mutation = useMutation(...)         // ❌ mutation logic
  const [id, setId] = useState()            // ❌ business state
  const errors = useMemo(() => validate(data), [data])  // ❌ derived logic
}
```

**Incorrect (state in blocks context wrapper):**

```typescript
// packages/blocks/src/domains/{domain}/{feature}-context.tsx
// ❌ useState in blocks — business state leaking into UI layer
export function FeatureFormProvider({ children }) {
  const form = useFeatureForm()                            // ✅ from core
  const [hasSubmitted, setHasSubmitted] = useState(false)   // ❌ state in blocks
  const markSubmitted = useCallback(...)                    // ❌ logic in blocks
  return <Context value={{ form, hasSubmitted, markSubmitted }}>{children}</Context>
}
```

**Correct (core hook + thin blocks wrapper):**

```typescript
// packages/core/src/domains/{domain}/hooks/use-feature-state.ts
// ✅ All business logic in core — including UI-gating state
export function useFeatureState() {
  const detail = useQuery(...)
  const mutation = useMutation(...)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const markSubmitted = useCallback(...)
  // ...derive errors, visible errors, canSubmit...
  return { detail, errors, visibleErrors, canSubmit, hasSubmitted, markSubmitted }
}

// packages/blocks/src/domains/{domain}/{feature}-context.tsx
// ✅ Pure thin wrapper — NO useState, NO useCallback, NO useMemo
export function FeatureProvider({ children }) {
  const state = useFeatureState()  // from core
  return <Context value={state}>{children}</Context>
}
```

Reference: [Web booking Technical research – §4 Cấu trúc thư mục (Project Structure)](https://vin3s.atlassian.net/wiki/spaces/OP/pages/2485125864/Web+booking+Technical+research#4.-C%E1%BA%A4U-TR%C3%9AC-TH%C6%AF-M%E1%BB%A4C-(PROJECT-STRUCTURE))
