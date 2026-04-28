---
title: Avoid Duplicate or Redundant Data in Loader Returns
impact: LOW
impactDescription: reduces payload and avoids duplicate serialization
tags: server, loaders, serialization, react-router
---

## Avoid Duplicate or Redundant Data in Loader Returns

Loader return values are serialized and sent to the client. Do not return the same data in multiple shapes (e.g. both `users` and `usersSorted`). Return one canonical shape and derive the rest in the component.

**Incorrect (duplicates array):**

```typescript
export async function loader() {
  const usernames = await fetchUsernames()
  return {
    usernames,
    usernamesOrdered: [...usernames].sort(),
  }
}
```

**Correct (single source, derive in component):**

```typescript
export async function loader() {
  const usernames = await fetchUsernames()
  return { usernames }
}

function ClientList() {
  const { usernames } = useLoaderData<typeof loader>()
  const sorted = useMemo(() => [...usernames].sort(), [usernames])
  // use sorted for display
}
```

Transformations like `.filter()`, `.map()`, `.toSorted()` create new references and increase payload; do them in the client when the raw data is already loaded.
