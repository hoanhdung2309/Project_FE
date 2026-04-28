# Asset Handling — Icons, Images, CDN

Rules and patterns for managing static assets exported from Figma.

---

## Icon Decision Tree

```
Is the icon already in @vtrip/ui/icons (~1,044 icons)?
├── YES → Import and use directly
│   import { AlertTriangleIcon } from "@vtrip/ui/icons"
│   import { SearchIcon } from "@vtrip/ui/icons"
│
└── NO → Is the SVG simple (few paths, <20 lines)?
    ├── YES → Create React component
    │   Location: packages/ui/src/icons/<kebab-case>.tsx
    │   Export: PascalCaseIcon
    │   Re-export from: packages/ui/src/icons/index.tsx
    │
    └── NO (complex/large SVG) → Put as static asset
        Location: apps/<app>/public/assets/icons/<name>.svg
        Reference: webAsset("/assets/icons/<name>.svg")
```

**When unsure:** Ask the user — do not invent a location.

---

## Icon Component Pattern

File: `packages/ui/src/icons/<kebab-case>.tsx`

```tsx
import type { IconProps } from "./types"

const MyCustomIcon = ({ color = "currentColor", ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill={color} d="M..." />
  </svg>
)

export { MyCustomIcon }
```

Then add to barrel: `packages/ui/src/icons/index.tsx`

```tsx
export { MyCustomIcon } from "./my-custom"
```

### IconProps Interface

```tsx
interface IconProps extends React.ComponentPropsWithRef<"svg"> {
  children?: never
  color?: string
}
```

### Icon Usage

```tsx
import { AlertTriangleIcon, SearchIcon } from "@vtrip/ui/icons"

<AlertTriangleIcon className="text-destructive size-4" />
<SearchIcon className="text-muted-foreground size-5" />
```

---

## Image Placement

All images go in `apps/<app>/public/assets/images/`. Public assets MUST be under `public/assets/`.

### webAsset() Function

```typescript
// packages/core/src/shared/utils/asset.ts
export function webAsset(
  path: string,
  host: string = env.VITE_WEB_DOMAIN_URL ?? ""
): string
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | Asset path (e.g., `/assets/images/hero.png`) |
| `host` | string | `VITE_WEB_DOMAIN_URL` | CDN/origin host |

### Basic Usage (In Shared Packages)

```tsx
import { webAsset } from "@vtrip/core/shared/utils/asset"

// MUST use webAsset in shared packages (blocks, core)
<img
  src={webAsset("/assets/images/hero.png")}
  alt="Welcome banner"
  width={1200}
  height={600}
  className="w-full h-auto"
/>
```

### With Aspect Ratio Container (Prevents CLS)

```tsx
<div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
  <img
    src={webAsset("/assets/images/feature.jpg")}
    alt="Feature preview"
    className="size-full object-cover"
    width={800}
    height={450}
  />
</div>
```

### Custom CDN Host

```tsx
import { env } from "@vtrip/env/client"
import { webAsset } from "@vtrip/core/shared/utils/asset"

// Hotel app assets from hotel CDN
<img
  src={webAsset("/assets/images/hotel-hero.jpg", env.VITE_HOTEL_CDN_ASSET_URL)}
  alt="Hotel hero"
/>
```

### Large/Complex SVG Icon as Static Asset

```tsx
<img
  src={webAsset("/assets/icons/hero-illustration.svg")}
  alt="Hero illustration"
  width={600}
  height={400}
/>
```

---

## Rules

1. **NEVER hardcode** `/assets/...` paths directly in shared packages — always use `webAsset()`
2. **ALWAYS set dimensions** — `width`/`height` attributes or aspect-ratio container to prevent CLS
3. **ALWAYS provide `alt`** — meaningful text for content images, empty `alt=""` for decorative
4. Public assets MUST be under `public/assets/` — never at root of `public/`
5. In app code (`apps/*`), also prefer `webAsset()` for consistency
6. Decorative images: use `aria-hidden="true"` and `pointer-events-none`

---

## Asset Directory Structure

```
apps/web/public/assets/
├── favicon.ico
├── images/
│   ├── hero.png
│   ├── destinations/
│   └── promotions/
├── icons/
│   ├── logo-green-trip.svg
│   └── hero-illustration.svg
└── locales/
    ├── vi/translation.json    ← generated, do not edit
    └── en/translation.json    ← generated, do not edit
```

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_WEB_CDN_ASSET_URL` | Web app CDN origin |
| `VITE_WEB_DOMAIN_URL` | Web app domain (default for webAsset) |
| `VITE_HOTEL_CDN_ASSET_URL` | Hotel app CDN origin |

Source: `packages/core/src/shared/utils/asset.ts`, `agents/rules/design/`
