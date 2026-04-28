# Component Patterns — Implementation Reference

Patterns and conventions for implementing Figma components in the web-ota monorepo.

---

## Layer Hierarchy

```
apps/          → Can import: blocks, core, ui, api, utils
packages/blocks → Can import: ui, core, api, utils
packages/core   → Can import: api, utils (NO JSX)
packages/ui     → Can import: utils ONLY (presentational)
packages/api    → Can import: utils ONLY
packages/utils  → Imports nothing (leaf)
```

## Placement Decision Tree

```
Is it a generic, reusable UI atom (Button, Card, Input)?
├── YES → packages/ui/src/components/<name>.tsx
│
└── NO → Does it contain business logic or API data?
    ├── YES (headless hook, no JSX) → packages/core/src/domains/<domain>/
    │
    └── NO or YES (with JSX) → Is it shared across apps?
        ├── YES → packages/blocks/src/domains/<domain>/<name>.tsx
        │         (or packages/blocks/src/layouts/<name>.tsx for layout)
        │
        └── NO → apps/<app>/app/modules/<feature>/<feature>.desktop.tsx
              (thin wrapper: import from blocks → render)
```

---

## Component Authoring Pattern

### Base UI + CVA + data-slot (Standard)

```tsx
"use client"

import type { VariantProps } from "class-variance-authority"
import { ComponentPrimitive } from "@base-ui/react/component"
import { cva } from "class-variance-authority"

import { cn } from "@vtrip/ui/lib/utils"

const myComponentVariants = cva("base-classes-here", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      outline: "border-input bg-background border",
      secondary: "bg-secondary text-secondary-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-10 px-4",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6 text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function MyComponent({
  className,
  variant,
  size,
  ...props
}: ComponentPrimitive.Props & VariantProps<typeof myComponentVariants>) {
  return (
    <ComponentPrimitive
      data-slot="my-component"
      className={cn(myComponentVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { MyComponent, myComponentVariants }
```

### Simple Wrapper (No Variants)

```tsx
import { cn } from "@vtrip/ui/lib/utils"

function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="section-title"
      className={cn("text-heading text-xl font-semibold", className)}
      {...props}
    />
  )
}

export { SectionTitle }
```

### Composite Component (Multi-Part)

```tsx
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground rounded-xl border shadow-sm",
        // Parent reacts to child presence:
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardContent }
```

---

## Co-located Sub-Components (CRITICAL)

When a component has logical sub-sections, **define sub-components in the same file** — do NOT create separate files for them. The main exported component and its internal helpers live together. Sub-components are plain functions (not exported) that access parent props via closure or explicit parameters.

```tsx
import { useTranslation } from "react-i18next"

import { CheckIcon } from "@vtrip/ui/icons"
import { cn } from "@vtrip/ui/lib/utils"

interface TicketBadge {
  label: string
}

export interface BookingOptionsMobileProps {
  title: string
  badges?: TicketBadge[]
  onViewDetail?: () => void
  className?: string
}

// Sub-component: co-located in same file, NOT exported, NOT in a separate file
function TicketOptionHeader({
  title,
  badges,
  onViewDetail,
}: Pick<BookingOptionsMobileProps, "title" | "badges" | "onViewDetail">) {
  const { t } = useTranslation()

  return (
    <>
      <h1
        data-slot="ticket-title"
        className="text-heading text-lg leading-7 font-semibold"
      >
        {title}
      </h1>

      {badges && badges.length > 0 && (
        <div data-slot="ticket-badges" className="flex flex-wrap items-center gap-2">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex h-6 items-center gap-1 rounded-full bg-green-50 px-2"
            >
              <CheckIcon className="size-4 text-green-600" />
              <span className="text-xs leading-4 font-medium text-green-600">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        data-slot="view-detail-button"
        onClick={onViewDetail}
        className="text-body w-fit text-xs leading-4 font-medium underline"
      >
        {t("ticketDetail.viewDetail")}
      </button>
    </>
  )
}

// Main exported component uses the sub-component
export function BookingOptionsMobile({
  title,
  badges,
  onViewDetail,
  className,
}: BookingOptionsMobileProps) {
  return (
    <div className={cn("bg-surface-gray flex min-h-dvh flex-col", className)}>  {/* cn() needed: merging with className prop */}
      <section data-slot="ticket-header" className="flex flex-col gap-2 bg-white px-4 pt-4 pb-3">
        <TicketOptionHeader title={title} badges={badges} onViewDetail={onViewDetail} />
      </section>
      {/* ... rest of the component */}
    </div>
  )
}
```

**Rules:**
- Sub-components stay in the **same file** as the parent — no separate files
- Sub-components are **NOT exported** (internal only)
- Each sub-component is a **named function declaration** (not arrow function)
- Use `Pick<>` or explicit props for type safety
- Only create a **separate file** if the sub-component is reused by multiple parent components

---

## Rules Checklist

- Named function declarations (NOT arrow functions for exports)
- No `React.forwardRef` — Base UI handles refs internally
- `"use client"` at top of interactive components
- `data-slot` attribute on EVERY component part
- Named exports ONLY — no default exports
- Destructure `className` and merge via `cn()`
- Full prop spreading `...props`
- File naming: `kebab-case.tsx`
- Export naming: `PascalCase`

---

## Mobile Variants

When Figma has significantly different desktop and mobile designs:

```
component-name.tsx          → Desktop/default version
component-name.mobile.tsx   → Mobile-optimized version
```

For module-level splits in app modules:

```
apps/<app>/app/modules/<feature>/
├── <feature>.desktop.tsx   → Desktop version (thin wrapper importing from blocks)
├── <feature>.mobile.tsx    → Mobile version (thin wrapper importing from blocks)
```

The **route file** handles device detection and switches between them:

```tsx
// apps/<app>/app/routes/<route>.tsx
import { data } from "react-router"
import { userAgent } from "@vtrip/lib/user-agent"
import type { Route } from "./+types/<route>"
import { SearchDesktop } from "~/modules/search/search.desktop"
import { SearchMobile } from "~/modules/search/search.mobile"

export async function loader({ request }: Route.LoaderArgs) {
  const { isMobile } = userAgent({ headers: request.headers })
  return data({ isMobile })
}

export default function Search({ loaderData: { isMobile } }: Route.ComponentProps) {
  if (isMobile) {
    return <SearchMobile />
  }
  return <SearchDesktop />
}
```

**Module files are thin wrappers** — they import the smart component from `@vtrip/blocks` and render it:

```tsx
// apps/<app>/app/modules/search/search.desktop.tsx
import { TicketSearch } from "@vtrip/blocks/domains/ticket/ticket-search/ticket-search"

export const SearchDesktop = () => {
  return <TicketSearch />
}
```

---

## Consuming Components in Blocks

```tsx
// packages/blocks/src/domains/home/explore/destination-card.tsx
import { useTranslation } from "react-i18next"

import { webAsset } from "@vtrip/core/shared/utils/asset"
import { Card, CardContent } from "@vtrip/ui/components/card"

function DestinationCard({ name, code, imageUrl }: DestinationCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={webAsset(imageUrl)}
          alt={name}
          width={400}
          height={225}
          className="size-full object-cover"
        />
      </div>
      <CardContent>
        <h3 className="text-heading text-lg font-semibold">{name}</h3>
      </CardContent>
    </Card>
  )
}

export { DestinationCard }
```

---

## Import Paths

```tsx
// i18n
import { useTranslation } from "react-i18next"

// Assets
import { webAsset } from "@vtrip/core/shared/utils/asset"
// Environment
import { env } from "@vtrip/env/client"
// UI components (presentational atoms)
import { Button } from "@vtrip/ui/components/button"
import { Card, CardContent, CardHeader } from "@vtrip/ui/components/card"
import { Input } from "@vtrip/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@vtrip/ui/components/select"
// Icons — always use @vtrip/ui/icons, NOT lucide-react
import { AlertTriangleIcon, ChevronRightIcon, SearchIcon, XIcon } from "@vtrip/ui/icons"
// Utilities
import { cn } from "@vtrip/ui/lib/utils"
```

Source: `packages/ui/src/components/`, `agents/rules/design-system.mdc`
