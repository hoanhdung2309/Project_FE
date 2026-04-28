---
title: Server vs Client Translation Usage
impact: HIGH
impactDescription: Correct use of i18n in loaders (server) and components (client)
tags: i18n, loaders, useTranslation, react-router, react-i18next
---

## Server vs Client Translation Usage

**Impact: HIGH (correct use of i18n in loaders vs components)**

Use the right i18n API per context: **loaders** run on the server and receive the i18n instance from middleware context; **components** run on client (or during SSR with the same instance) and use the `useTranslation()` hook.

**Incorrect (useTranslation in loader or missing context):**

```tsx
// Loader cannot use hooks
export async function loader() {
  const { t } = useTranslation() // ❌ Invalid: hooks not allowed in loader
  return data({ title: t("title") })
}
```

**Correct (loader: getInstance from context):**

```tsx
import { data } from "react-router"
import { getInstance } from "~/middleware/i18n"
import type { Route } from "./+types/home"

export async function loader({ context }: Route.LoaderArgs) {
  const i18n = getInstance(context)
  return data({ title: i18n.t("hello") })
}
```

**Correct (component: useTranslation):**

```tsx
import { useTranslation } from "react-i18next"

export default function Home() {
  const { t } = useTranslation()
  return <div>{t("hello")}</div>
}
```

For meta, SEO, or any data returned from a loader that includes user-facing text, use `getInstance(context)` and `i18n.t(key)` in the loader. In UI components, use `useTranslation()` and `t(key)`.

Reference: `apps/web/app/middleware/i18n.ts`, `packages/lib/src/i18n/middleware.ts`.
