## Use appUrl for Cross-App and External Navigation

**Impact: HIGH (consistent URL construction, correct routing in dev and production)**

All navigation between apps in the monorepo must use `appUrl` from `@vtrip/core/shared/utils/app-url`. Never use raw `env.VITE_*` domain variables or manual string concatenation for cross-app URLs. The `appUrl` function handles dev/production differences automatically:

- **Dev**: prefixes with the app's CDN_ASSET_URL (each app runs on its own port)
- **Production**: returns path only (nginx routes by path)
- **External app** (`isExternalApp: true`): prefixes with `VITE_WEB_DOMAIN_URL` in production (for the main web app domain)

### Available apps

| AppId | Dev host env var | Use case |
|-------|-----------------|----------|
| `"web"` | `VITE_WEB_DOMAIN_URL` | Main web app (home, auth, shared pages) |
| `"hotel"` | `VITE_HOTEL_CDN_ASSET_URL` | Hotel app |
| `"flight"` | `VITE_FLIGHT_CDN_ASSET_URL` | Flight app |
| `"golf"` | `VITE_GOLF_CDN_ASSET_URL` | Golf app |
| `"explore"` | `VITE_EXPLORE_CDN_ASSET_URL` | Explore/ticket app |
| `"payment"` | `VITE_PAYMENT_CDN_ASSET_URL` | Payment app |

### Internal app navigation (same monorepo, different app)

Use `appUrl(appId, path)` for navigating between apps within the monorepo.

**Incorrect (hardcoded env variable or manual URL):**

```typescript
// ❌ Raw env variable — breaks in production
window.location.href = `${env.VITE_PAYMENT_CDN_ASSET_URL}/payment?orderId=${id}`

// ❌ Hardcoded path — wrong port in dev
window.location.href = `/vi/explore/ticket/search?q=${query}`
```

**Correct (appUrl for internal app navigation):**

```typescript
import { appUrl } from "@vtrip/core/shared/utils/app-url"

// Navigate to payment app
window.location.href = appUrl("payment", `?orderId=${orderId}`)

// Navigate to explore app
window.location.href = appUrl("explore", `/vi/explore/ticket/search?q=${query}`)

// Shorthand helpers also available
import { hotelUrl, exploreUrl } from "@vtrip/core/shared/utils/app-url"
window.location.href = hotelUrl(`/vi/hotel/${hotelId}`)
```

### External app navigation (web app domain)

Use `appUrl(appId, path, { isExternalApp: true })` when navigating to pages hosted on the main web domain (`VITE_WEB_DOMAIN_URL`). This is needed when an app (e.g., hotel) redirects to the web app's pages (e.g., home, auth).

**Incorrect (raw env or webUrl):**

```typescript
// ❌ Raw env variable in JSX
<a href={env.VITE_WEB_DOMAIN_URL}>Home</a>

// ❌ Manual concatenation
window.location.href = `${env.VITE_WEB_DOMAIN_URL}/oauth/logout`
```

**Correct (appUrl with isExternalApp):**

```typescript
import { appUrl } from "@vtrip/core/shared/utils/app-url"

// Logo link to web app home
<a href={appUrl("web", "/", { isExternalApp: true })}>Home</a>

// Redirect to web app on invalid params
throw redirect(appUrl("web", "/", { isExternalApp: true }))

// React Router Navigate
<Navigate to={appUrl("web", "/", { isExternalApp: true })} replace />
```

### When to use which

| Scenario | Pattern |
|----------|---------|
| Navigate to another app in the monorepo | `appUrl("payment", path)` |
| Navigate to the web app domain (home, auth) | `appUrl("web", "/", { isExternalApp: true })` |
| Navigate within the same app | Use React Router `navigate()` or `<Link>` |
| Asset URLs (images, icons) | Use `webAsset()` — not `appUrl` |

### Do NOT

- Use raw `env.VITE_*_CDN_ASSET_URL` or `env.VITE_WEB_DOMAIN_URL` for navigation URLs
- Use the deleted `webUrl()` from `web-url.ts` — it has been replaced by `appUrl`
- Hardcode port numbers or domain names in navigation URLs
- Use `appUrl` for asset URLs (images, fonts) — use `webAsset()` instead

Reference: `packages/core/src/shared/utils/app-url.ts`.
