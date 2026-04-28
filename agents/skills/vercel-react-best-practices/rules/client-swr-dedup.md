---
title: Use TanStack Query for Automatic Deduplication
impact: MEDIUM-HIGH
impactDescription: automatic deduplication and caching
tags: client, tanstack-query, deduplication, data-fetching
---

## Use TanStack Query for Automatic Deduplication

TanStack Query (React Query) provides request deduplication, caching, and revalidation across components. Prefer it over ad-hoc `fetch` + `useState`/`useEffect` for server state.

**Incorrect (no deduplication, each instance fetches):**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
  }, [])
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}
```

**Correct (multiple components share one request/cache):**

```tsx
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((r) => r.json()),
  })
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}
```

**Mutations with invalidation:**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function UpdateButton() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  })
  return <button onClick={() => mutation.mutate(data)}>Update</button>
}
```

Reference: [TanStack Query](https://tanstack.com/query/latest)
