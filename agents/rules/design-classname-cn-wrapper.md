## When to Use cn()

**Impact: HIGH (consistent class merging, Tailwind conflict resolution)**

Use `cn()` from `@vtrip/ui/lib/utils` **only** when you need to merge a `className` prop, apply conditional classes, or compose dynamic expressions. For **static-only** classes, use plain `className="..."` — no `cn()` wrapper needed.

**Incorrect (className applied directly — no merge, no conflict resolution):**

```typescript
export function Card({ className }: { className?: string }) {
  return <div className={`rounded-lg bg-white p-4 ${className}`}>...</div>
}

export function Badge({ className }: { className?: string }) {
  return <span className={className}>...</span>
}
```

**Correct (cn() wraps internal + external classes):**

```typescript
import { cn } from "@vtrip/ui/lib/utils"

export function Card({ className }: { className?: string }) {
  return <div className={cn("rounded-lg bg-white p-4", className)}>...</div>
}

export function Badge({ className }: { className?: string }) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-sm font-medium", className)}>
      ...
    </span>
  )
}
```

**Correct (passing className to a child component that handles cn() internally):**

```typescript
export function Summary({ className }: { className?: string }) {
  return (
    <SectionCard className={cn("shadow-card-md", className)}>
      ...
    </SectionCard>
  )
}
```

### When to use cn()

- **Merging with `className` prop:** `cn("internal-classes", className)`
- **Conditional/dynamic classes:** `cn([isActive ? "block" : "hidden", "text-sm"])`
- **Composing with `&&`:** `cn([isOpen && "bg-primary", "flex"])`

### When NOT to use cn()

- **Static-only classes:** just use `className="flex items-center gap-2"` directly
- Context providers and hooks (no JSX root to style)

### Rules

- Import `cn` from `@vtrip/ui/lib/utils` only when needed
- Internal classes come first, `className` comes last (so consumer can override)
- Use `cn([...])` array syntax for conditionals, `cn("...", className)` for prop merging

### Do NOT

- Use template literals to concatenate classes: `` `${baseClasses} ${className}` ``
- Wrap static-only classes in `cn()` — just use plain `className="..."`
- Forget to accept `className` on reusable components (all shared/domain components should accept it)

Reference: `packages/ui/src/lib/utils.ts` (`cn` utility).
