# `lib/core` — Business Logic Layer

Headless layer: data fetching, state hooks, domain logic, validation. Components in `app/` and `components/` consume these hooks — they never call `apiClient` directly or hold non-trivial state/effects.

## Structure

```
lib/core/
  auth/           session, login/register/logout, email/password validation
  cart/           cart state + persistence
  products/       product queries + tier transformation + pricing
  orders/         order queries/mutations, status helpers, adjust flow
  inventory/      batch queries + status derivation
  users/          admin user role/status/password mutations
  shared/
    api-paths.ts  central URL constants
    validation/   email/password/phone validators
```

## Rules

- Hooks only (no JSX). Return plain values/callbacks.
- Date/time via `date-fns` re-exported from `lib/utils/date.ts`.
- Reuse existing utilities — check `lib/utils/` first.
- No direct `localStorage`/`document.cookie` outside `auth/session.ts`.
- Components subscribe to these hooks directly (no prop drilling).
