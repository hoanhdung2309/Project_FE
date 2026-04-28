---
title: Per-Request Deduplication with React.cache() in Loaders
impact: MEDIUM
impactDescription: deduplicates within request
tags: server, cache, react-cache, deduplication, loaders, react-router
---

## Per-Request Deduplication with React.cache() in Loaders

Use `React.cache()` for server-side request deduplication when multiple loaders or the same loader logic (e.g. auth, DB lookup) runs in one request. Call the cached function from your route loaders.

**Usage:**

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async (request: Request) => {
  const session = await getSession(request)
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id },
  })
})
```

Within a single request, multiple calls to `getCurrentUser(request)` execute the query only once.

**Avoid inline objects as arguments:**

`React.cache()` uses shallow equality (`Object.is`) to determine cache hits. Inline objects create new references each call, preventing cache hits.

**Incorrect (always cache miss):**

```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})
getUser({ uid: 1 })
getUser({ uid: 1 })  // Cache miss
```

**Correct (cache hit):**

```typescript
const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})
getUser(1)
getUser(1)  // Cache hit
```

Use `React.cache()` for database queries, auth checks, and other non-fetch async work shared across loaders or called multiple times in one request.

Reference: [React.cache documentation](https://react.dev/reference/react/cache)
