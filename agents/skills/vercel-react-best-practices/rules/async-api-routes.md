---
title: Prevent Waterfall Chains in Loaders and Actions
impact: CRITICAL
impactDescription: 2-10× improvement
tags: loaders, actions, waterfalls, parallelization, react-router
---

## Prevent Waterfall Chains in Loaders and Actions

In React Router 7 route **loaders** and **actions**, start independent operations immediately and await in parallel. Loaders run on the server; sequential `await`s add full network latency.

**Incorrect (config waits for auth, data waits for both):**

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request)
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return { data, config }
}
```

**Correct (auth and config start immediately):**

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const sessionPromise = getSession(request)
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id),
  ])
  return { data, config }
}
```

For dependency chains, use `Promise.all` for independent branches or a helper like `better-all` to maximize parallelism (see Dependency-Based Parallelization).

**Actions (e.g. form submissions):** Apply the same pattern—run independent work in parallel before returning the response.
