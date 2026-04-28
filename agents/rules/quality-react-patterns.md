---
paths:
  - "**/*.tsx"
  - "**/hooks/**/*.ts"
---

## React Quality Patterns

**Impact: HIGH (prevents prop drilling, reduces JSX complexity, enforces idiomatic React)**

### 1. No Prop Drilling — Use Hooks and Stores Directly

Components must consume data from custom hooks (`useQuery`, `nuqs`, `zustand`) directly instead of receiving pre-fetched data via props through multiple levels. Prop drilling creates tight coupling, makes refactoring painful, and bloats intermediate component signatures.

**Incorrect (prop drilling through intermediaries):**

```tsx
// Parent fetches, passes down through 2+ levels
function SupplierPage() {
  const { data } = useSupplierResultQuery(params)
  const [sort, setSort] = useQueryState("sort")
  return <SupplierList data={data} sort={sort} onSortChange={setSort} />
}

function SupplierList({ data, sort, onSortChange }) {
  return <FilterBar sort={sort} onSortChange={onSortChange} />
}

function FilterBar({ sort, onSortChange }) {
  return <SortButton sort={sort} onChange={onSortChange} />
}
```

**Correct (each component consumes what it needs):**

```tsx
// Each component hooks into its own data source
function SupplierPage() {
  return <SupplierList />
}

function SupplierList() {
  const { data } = useSupplierResultQuery(params)
  return <FilterBar />
}

function FilterBar() {
  const [sort, setSort] = useQueryState("sort")
  return <SortButton sort={sort} onChange={setSort} />
}
```

**Preferred data sources (use directly in consuming component):**

| Need                  | Hook                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| Server data           | `useQuery` / `useSuspenseQuery` / `useInfiniteQuery` from TanStack Query |
| URL state             | `useQueryState` / `useQueryStates` from nuqs                             |
| Client state (shared) | `useStore` from zustand (create store in core)                           |
| Form state            | `useStore(form.store, selector)` from TanStack Form                      |

### 2. Multi-Branch JSX — Use `<Show>` Component

When JSX return has **more than 1 condition branch**, replace nested ternaries or `&&` chains with the `<Show>` component from `@vtrip/ui/components/switch-case-jsx`. This keeps JSX flat, readable, and easy to extend.

**Incorrect (nested ternaries / multiple `&&` for branching):**

```tsx
function StatusBadge({ status }: { status: string }) {
  return (
    <div>
      {status === "loading" ? (
        <Spinner />
      ) : status === "error" ? (
        <ErrorMessage />
      ) : status === "empty" ? (
        <EmptyState />
      ) : (
        <DataList />
      )}
    </div>
  )
}
```

**Incorrect (multiple `&&` that are mutually exclusive):**

```tsx
function Panel({ role }: { role: string }) {
  return (
    <div>
      {role === "admin" && <AdminPanel />}
      {role === "editor" && <EditorPanel />}
      {role === "viewer" && <ViewerPanel />}
    </div>
  )
}
```

**Correct (Show component for multi-branch):**

```tsx
import { Show } from "@vtrip/ui/components/switch-case-jsx"

function StatusBadge({ status }: { status: string }) {
  return (
    <Show>
      <Show.If condition={status === "loading"}>
        <Spinner />
      </Show.If>
      <Show.If condition={status === "error"}>
        <ErrorMessage />
      </Show.If>
      <Show.If condition={status === "empty"}>
        <EmptyState />
      </Show.If>
      <Show.Else>
        <DataList />
      </Show.Else>
    </Show>
  )
}
```

**When to use each pattern:**

| Branches                         | Pattern                                             |
| -------------------------------- | --------------------------------------------------- |
| 1 condition (show/hide)          | `{condition && <Component />}` — plain `&&` is fine |
| 2+ mutually exclusive conditions | `<Show>` with `<Show.If>` / `<Show.Else>`           |

**Single condition — `&&` is fine, no `<Show>` needed:**

```tsx
{
  items.length > 0 && <ItemCount count={items.length} />
}
```

Reference: `packages/ui/src/components/switch-case-jsx.tsx` (`Show`, `Show.If`, `Show.When`, `Show.Else`).

### 3. Named Boolean Variables — No Inline Compound Conditions

Inline boolean expressions with 2+ conditions in JSX props or ternaries must be extracted into named variables. Named booleans are self-documenting, debuggable, and prevent accidental logic duplication across JSX.

**Incorrect (inline compound booleans):**

```tsx
function PromotionSearch({ state }) {
  return (
    <>
      <Button disabled={!localCode.trim() || state.isSearching}>Search</Button>
      <Footer hasSelection={state.selectedCodes.size > 0} />
      {state.offers.length > 0 ? <OfferList /> : <EmptyState />}
      <Card
        disabled={
          !offer.isApplicable ||
          (!offer.isDefault && !offer.allowCombine && hasDefaultOffer)
        }
      />
    </>
  )
}
```

**Correct (named booleans, logic in core):**

```tsx
// In core hook or util — logic belongs here
const isSearchDisabled = !hasLocalCode || state.isSearching
const hasOffers = state.offers.length > 0
const hasSelection = state.selectedCodes.size > 0

// In core util file
function isOfferDisabled(offer, hasDefaultOffer) { ... }

// In blocks — pure template
function PromotionSearch({ state }) {
  return (
    <>
      <Button disabled={search.isSearchDisabled}>Search</Button>
      <Footer hasSelection={state.hasSelection} />
      {state.hasOffers ? <OfferList /> : <EmptyState />}
      <Card disabled={isOfferDisabled(offer, state.hasDefaultOffer)} />
    </>
  )
}
```

**Rules:**

| Where                                           | What                                              |
| ----------------------------------------------- | ------------------------------------------------- |
| Single simple check (`!open`, `isLoading`)      | Inline is fine                                    |
| 2+ conditions combined (`&&`, `\|\|`)           | Extract to named variable                         |
| Reusable condition across components            | Extract to core hook return or core util function |
| Derived from state (`.size > 0`, `.length > 0`) | Precompute in core orchestrator as `hasX` boolean |
