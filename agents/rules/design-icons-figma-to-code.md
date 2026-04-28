---
title: Icons — Figma to Code
impact: HIGH
impactDescription: Consistent icon usage and correct asset placement
tags: design, icons, figma-to-code, svg, ui
---

## Icons — Figma to Code

**Impact: HIGH (consistent icon usage and correct asset placement)**

When turning Figma icon/frame exports into code: prefer **existing** icons from `@vtrip/ui/icons` or `lucide-react`. For **new** custom icons, use small/simple SVGs as React components in `packages/ui/src/icons/` (kebab-case file, PascalCaseIcon export). For **large or multi-path SVGs**, put the `.svg` file in `apps/{app_name}/public/assets/icons/` (shared assets live centrally in web app) and reference using `webAsset(“/assets/icons/name.svg”)` from `@vtrip/core/shared/utils/asset`. Never hardcode `/assets/...` paths directly in shared packages. Public assets must always live under `public/assets/`. If it’s unclear whether an icon is “large” or app-only, **ask the user** — do not assume.

**Incorrect (inlining huge SVG in component or wrong location):**

```tsx
// In a block or page — raw SVG with many paths bloats JS bundle
function Header() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10 L..." />
      <path d="..." />
      {/* many more paths */}
    </svg>
  )
}
```

**Incorrect (adding large SVG as new file in packages/ui/src/icons/):**

- Putting a 50+ path logo/illustration in `packages/ui/src/icons/` increases bundle size for all apps.

**Correct (reuse or small custom icon in UI package):**

```tsx
import { Search } from "lucide-react"

import { AlertTriangleIcon } from "@vtrip/ui/icons"

;<AlertTriangleIcon className="text-destructive size-4" />
;<Search className="text-muted-foreground size-5" />
```

**Correct (large/complex SVG in public/assets/):**

- Place `apps/{app_name}/public/assets/icons/hero-illustration.svg`. Public assets must always be under `public/assets/`.
- Reference using `webAsset()`:

```tsx
import { webAsset } from "@vtrip/core/shared/utils/asset"

// Default: resolves via VITE_WEB_CDN_ASSET_URL
<img src={webAsset("/assets/icons/hero-illustration.svg")} alt="..." />

// Custom host: resolve from a different app's CDN
import { env } from "@vtrip/env/client"
<img src={webAsset("/assets/icons/hotel-logo.svg", env.VITE_HOTEL_CDN_ASSET_URL)} alt="..." />
```

**Figma-to-code checklist (icons):**

1. Check `@vtrip/ui/icons` and `lucide-react` for an equivalent before creating new assets.
2. New icon: simple SVG → `packages/ui/src/icons/<name>.tsx` (kebab-case), export `PascalCaseIcon`, re-export from barrel.
3. New icon: many paths or large → `apps/{app_name}/public/assets/icons/<name>.svg`, reference via `webAsset("/assets/icons/<name>.svg")`.
4. When unsure (size, reuse scope): ask the user; do not invent.

Reference: [design-system.mdc](design-system.mdc) § 5 Icon System, § 4 Asset Management. `packages/core/src/shared/utils/asset.ts`.
