---
paths:
  - "**/*.tsx"
  - "**/hooks/**/*.ts"
---

## Extract Logic into Named Custom Hooks

When a component has 2+ related `useState`, `useEffect` + state, or non-trivial `useCallback`/`useMemo`, extract into a custom hook with a descriptive name and 1-line JSDoc.

Name describes **what**, not **how**: `useCountdown`, `useDialogVisibility`, `useCarouselSelection`.

### Where to place

| Scope | Location |
|-------|----------|
| Used by one component | Co-locate in the same file, above the component |
| Used across a domain | `packages/core/src/domains/{domain}/hooks/` |
| Used across domains | `packages/core/src/shared/hooks/` |
