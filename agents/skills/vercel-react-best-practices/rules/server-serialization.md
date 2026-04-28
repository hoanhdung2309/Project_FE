---
title: Minimize Serialization at Loader Boundaries
impact: HIGH
impactDescription: reduces data transfer size
tags: server, loaders, serialization, react-router
---

## Minimize Serialization at Loader Boundaries

React Router 7 serializes **loader** return values and sends them to the client. Only return fields that the route component actually uses to keep payloads small and improve load time.

**Incorrect (serializes entire user object):**

```typescript
export async function loader({ params }: LoaderFunctionArgs) {
  const user = await fetchUser(params.id)
  return { user }
}

function Profile() {
  const { user } = useLoaderData<typeof loader>()
  return <div>{user.name}</div>
}
```

**Correct (return only what the UI needs):**

```typescript
export async function loader({ params }: LoaderFunctionArgs) {
  const user = await fetchUser(params.id)
  return { name: user.name }
}

function Profile() {
  const { name } = useLoaderData<typeof loader>()
  return <div>{name}</div>
}
```

Return minimal, serializable data from loaders; avoid passing large or nested objects when the component only needs a few fields.
