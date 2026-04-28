## Use Mutation State Directly — Do Not Duplicate with useState

**Impact: HIGH (avoids redundant state, leverages TanStack Query's built-in reactivity)**

`useMutation` from TanStack Query already exposes `.error`, `.data`, `.isSuccess`, `.isPending`, etc. as reactive state. Do not create separate `useState` to capture values from `onSuccess`/`onError` callbacks — derive what you need from the mutation's own state.

**Incorrect (duplicating mutation state with useState):**

```typescript
function useSubmit() {
  const mutation = useCreateMutation()
  // ❌ Redundant state — mutation.error already holds this
  const [submitError, setSubmitError] = useState<Error | null>(null)

  const handleSubmit = useCallback(() => {
    setSubmitError(null)
    mutation.mutate(payload, {
      onError: (error) => {
        setSubmitError(error) // ❌ Duplicates mutation.error
      },
      onSuccess: (data) => {
        if (!data.id) {
          setSubmitError(new Error("missing id")) // ❌ Extra state
        }
      },
    })
  }, [mutation])

  return { handleSubmit, error: submitError }
}
```

**Correct (derive from mutation state):**

```typescript
function useSubmit() {
  const mutation = useCreateMutation()

  const handleSubmit = useCallback(() => {
    mutation.mutate(payload)
  }, [mutation])

  // Derive error info from mutation's built-in state
  const bookingError = useMemo(
    () => deriveError(
      mutation.error,
      mutation.isSuccess && !mutation.data?.data?.id
    ),
    [mutation.error, mutation.isSuccess, mutation.data]
  )

  return {
    handleSubmit,
    isSubmitting: mutation.isPending,
    bookingError,
  }
}
```

### Key rules

| Concern | How |
|---------|-----|
| Error state | Use `mutation.error` — already typed as `FetchError` |
| Success data | Use `mutation.data` — already typed as response |
| Loading state | Use `mutation.isPending` |
| Derived error classification | `useMemo` over `mutation.error` + `mutation.data`, not `useState` in callbacks |
| Backend error message | Extract from `(mutation.error as FetchError).jsonError?.message` — prioritize showing it over FE i18n |
| Reset error | Call `mutation.reset()` if needed, or it resets on next `.mutate()` |

### When `onSuccess`/`onError` callbacks ARE appropriate

Callbacks are fine for **side-effects that don't set React state** — e.g. clearing storage, invalidating queries, navigating, or resetting external resources. The rule only forbids using callbacks to duplicate mutation state into `useState`.

```typescript
// ✅ OK — side-effect, not state duplication
mutation.mutate(payload, {
  onSuccess: (response) => {
    if (response.data?.id) {
      clearStorage()                           // external cleanup
      queryClient.invalidateQueries({ queryKey: keys.all }) // cache invalidation
      navigate("/success")                     // navigation
    }
  },
})

// ❌ BAD — duplicating mutation state into useState
mutation.mutate(payload, {
  onSuccess: (data) => setResult(data),     // mutation.data already has this
  onError: (err) => setError(err),          // mutation.error already has this
})
```

### Do NOT

- Create `useState` to mirror `mutation.error` or `mutation.data`
- Use `onSuccess`/`onError` callbacks to set local state that duplicates mutation state
- Store derived values (like error codes) in `useState` — derive them with `useMemo`
- Use `useEffect` watching `mutation.isSuccess` when `onSuccess` callback suffices

Reference: `packages/core/src/domains/hotel/hooks/use-checkout-submit.ts`.
