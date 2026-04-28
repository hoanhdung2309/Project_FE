---
title: Authenticate Route Actions Like API Endpoints
impact: CRITICAL
impactDescription: prevents unauthorized access to server mutations
tags: server, actions, authentication, security, react-router
---

## Authenticate Route Actions Like API Endpoints

**Impact: CRITICAL (prevents unauthorized access to server mutations)**

Route **actions** in React Router 7 (form actions, resource route handlers) are invoked from the client and run on the server. They are exposed as endpoints. Always verify authentication and authorization **inside** each action—do not rely solely on layout or page-level checks, as actions can be triggered directly (e.g. form POST to the route URL).

**Incorrect (no authentication check):**

```typescript
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const userId = formData.get('userId') as string
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**Correct (authentication inside the action):**

```typescript
import { verifySession } from '@/lib/auth'

export async function action({ request }: ActionFunctionArgs) {
  const session = await verifySession(request)
  if (!session) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const userId = formData.get('userId') as string
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw new Response('Forbidden', { status: 403 })
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

Validate input first, then authenticate, then authorize, then perform the mutation.
