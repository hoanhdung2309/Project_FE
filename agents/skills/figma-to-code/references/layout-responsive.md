# Layout & Responsive — Tailwind Patterns

Responsive design patterns and advanced Tailwind selectors used in this project.

---

## className Format (CRITICAL)

**Default: plain `className="..."`** — no `cn()` wrapper for static classes.

Only use `cn([...])` array syntax when there are conditional/composite expressions (ternaries, `&&`).

```tsx
function Example() {
  return (
    // Static classes — plain className, no cn()
    <div className="flex h-6 items-center gap-3 xl:flex xl:h-6 xl:items-center xl:gap-3">
      <span className="text-sm font-medium text-heading xl:text-base xl:font-semibold">
        {title}
      </span>
    </div>
  )
}
```

### Rules

1. **Default: `className="..."`** — plain string, no `cn()` needed
2. **`cn([...])` ONLY when conditionals are needed:**
   ```tsx
   className={cn([isDisplay ? "block" : "hidden", "text-sm font-medium"])}
   className={cn([isActive && "bg-primary text-primary-foreground", "flex items-center gap-2"])}
   ```
3. **Also use `cn()` when merging with a `className` prop:**
   ```tsx
   className={cn("bg-white rounded-lg p-4", className)}
   ```
4. **Never use raw template strings** like `` `${baseClass} ${className}` ``

---

## Responsive Breakpoints

| Breakpoint | Prefix | Min-width | Use case |
|---|---|---|---|
| Mobile | (default) | 0px | Mobile-first base |
| Small | `sm:` | 640px | Large phones, small tablets |
| Medium / Tablet | `md:` | 768px | Tablets |
| Large | `lg:` | 1024px | Small desktops |
| XL / Desktop | `xl:` | 1280px | Standard desktops |
| 2XL | `2xl:` | 1536px | Large screens |

Custom breakpoints from theme:

| Token | Prefix | Value |
|---|---|---|
| `--breakpoint-tablet` | `tablet:` | 768px |
| `--breakpoint-desktop` | `desktop:` | 1280px |
| `--breakpoint-wide` | `wide:` | 1440px |

---

## Layout Utilities

### Container

```tsx
// max-width 1400px, padding-inline: 1rem (mobile) / 5rem (sm+)
<div className="container">
```

### Flexbox

```tsx
<div className="flex items-center gap-4">
<div className="flex flex-col gap-2">
<div className="inline-flex items-center justify-center gap-2">
```

### Grid

```tsx
// Responsive card grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Fixed columns with auto-fit
<div className="grid grid-cols-[1fr_auto]">

// Responsive with has-data selector
<div className="grid has-data-[slot=card-action]:grid-cols-[1fr_auto]">
```

### Aspect Ratio

```tsx
<div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
  <img className="size-full object-cover" />
</div>

<div className="aspect-square">
```

---

## Advanced Tailwind Selectors (Project-Specific)

### Data Attribute Selectors

```tsx
// State-based styling (Base UI data attributes)
className="data-open:animate-in data-closed:animate-out"
className="data-open:fade-in-0 data-closed:fade-out-0"
className="data-open:zoom-in-95 data-closed:zoom-out-95"

// Side-based animations (popovers, tooltips)
className="data-[side=bottom]:slide-in-from-top-2"
className="data-[side=top]:slide-in-from-bottom-2"
className="data-[side=left]:slide-in-from-right-2"
className="data-[side=right]:slide-in-from-left-2"

// Checked/selected states
className="data-[state=checked]:bg-primary"
className="data-selected:bg-accent"
className="data-active:bg-accent"

// Custom data props
className="data-[size=sm]:h-7 data-[size=default]:h-8"
```

### Has-Data Selectors (Parent Reacts to Child)

```tsx
// Parent grid changes based on child slot presence
className="has-data-[slot=card-action]:grid-cols-[1fr_auto]"

// Parent detects child input
className="has-[>[data-slot=field]]:rounded-lg"
```

### In-Data Selectors (Child Reacts to Parent)

```tsx
// Child styles itself based on parent context
className="in-data-[slot=button-group]:rounded-lg"
```

### Group Selectors

```tsx
// Named group
<div className="group/button">
  <span className="group-hover/button:text-primary" />
</div>

// Group data
className="group-data-[focused=true]/day:relative"
className="group-data-[open=true]:rotate-180"
```

### ARIA State Selectors

```tsx
className="aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3"
className="aria-expanded:bg-muted"
className="aria-disabled:opacity-50 aria-disabled:pointer-events-none"
```

### Child Selectors

```tsx
// SVG child sizing
className="[&_svg]:size-4 [&_svg]:shrink-0"
className="[&_svg:not([class*='size-'])]:size-4"

// Span child
className="[&>span]:text-xs [&>span]:opacity-70"

// Universal child
className="*:[img]:rounded-lg"
```

### CSS Custom Property Sizing

```tsx
// Variable-driven dimensions
className="size-(--cell-size)"
className="w-(--cell-size) h-(--cell-size)"
className="min-w-(--cell-size)"
className="rounded-(--cell-radius)"
className="max-h-(--available-height)"
className="w-(--anchor-width)"
className="origin-(--transform-origin)"
```

### Container Queries

```tsx
// Define container
<div className="@container/field-group">
  {/* Respond to container size */}
  <div className="@md/field-group:flex-row @sm/field-group:flex-col">
</div>
```

---

## Common Layout Patterns

### Hero Section with Gradient Overlay

```tsx
<div className="relative h-[400px] w-full overflow-hidden">
  <img
    src={webAsset("/assets/images/hero.png")}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 size-full object-cover pointer-events-none"
  />
  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
  <div className="relative z-10 flex flex-col justify-end p-8">
    <h1 className="text-2xl font-bold text-inverted">{t("hero.title")}</h1>
  </div>
</div>
```

### Card Grid with Responsive Columns

```tsx
<div className="container">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {items.map(item => (
      <Card key={item.id}>...</Card>
    ))}
  </div>
</div>
```

### Sticky Header

```tsx
<header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
  <div className="container flex h-14 items-center">
    ...
  </div>
</header>
```

### Section with Title + See All Link

```tsx
<section className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold text-heading">{t("section.title")}</h2>
    <Link className="text-sm text-primary hover:underline">{t("common.seeAll")}</Link>
  </div>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    ...
  </div>
</section>
```

---

## Dark Mode

Use `dark:` prefix for dark mode variants:

```tsx
className="bg-background dark:bg-input/30"
className="text-foreground dark:text-inverted"
className="border-border dark:border-border/50"
```

Custom variant defined in theme:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

Source: `tooling/tailwind/theme.css`, `apps/web/app/app.css`
