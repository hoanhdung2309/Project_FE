# Token Map — Figma to Tailwind

Complete mapping from design tokens in `tooling/tailwind/theme.css` to Tailwind utility classes.

---

## Colors

### Shadcn Semantic Colors

| Figma Token | Tailwind Class | CSS Variable | Hex |
|---|---|---|---|
| Primary | `bg-primary`, `text-primary` | `var(--primary)` | `#0ab193` (pitch-green-500) |
| Primary foreground | `text-primary-foreground` | `var(--primary-foreground)` | `#ffffff` |
| Background | `bg-background` | `var(--background)` | `#ffffff` |
| Foreground | `text-foreground` | `var(--foreground)` | `#1e293b` |
| Card | `bg-card` | `var(--card)` | `#ffffff` |
| Card foreground | `text-card-foreground` | `var(--card-foreground)` | `#1e293b` |
| Popover | `bg-popover` | `var(--popover)` | `#ffffff` |
| Popover foreground | `text-popover-foreground` | `var(--popover-foreground)` | `#1e293b` |
| Secondary | `bg-secondary` | `var(--secondary)` | `#f1f5f9` |
| Secondary foreground | `text-secondary-foreground` | `var(--secondary-foreground)` | `#1e293b` |
| Muted | `bg-muted` | `var(--muted)` | `#f1f5f9` |
| Muted foreground | `text-muted-foreground` | `var(--muted-foreground)` | `#475569` (neutral) |
| Accent | `bg-accent` | `var(--accent)` | `#f1f5f9` |
| Accent foreground | `text-accent-foreground` | `var(--accent-foreground)` | `#0ab193` |
| Destructive | `bg-destructive`, `text-destructive` | `var(--destructive)` | `#c6362e` |
| Destructive foreground | `text-destructive-foreground` | `var(--destructive-foreground)` | `#ffffff` |
| Border | `border-border` | `var(--border)` | `#e2e8f0` |
| Input | `bg-input` | `var(--input)` | `#ffffff` |
| Ring | `ring-ring` | `var(--ring)` | `#0ab193` |

### Design System Colors

| Figma Token | Tailwind Class | CSS Variable | Hex |
|---|---|---|---|
| Heading | `text-heading` | `var(--color-heading)` | `#1e293b` |
| Neutral | `text-neutral` | `var(--color-neutral)` | `#475569` |
| Body | `text-body` | `var(--color-body)` | `#334155` |
| Inverted | `text-inverted` | `var(--color-inverted)` | `#ffffff` |
| Disabled | `text-disabled` | `var(--color-disabled)` | `#aab7ca` |
| Star filled | `text-star-filled` | `var(--color-star-filled)` | `#fbbf24` |
| Surface gray | `bg-surface-gray` | `var(--color-surface-gray)` | `#f1f5f9` |
| Border primary | `border-border-primary` | `var(--color-border-primary)` | `#e2e8f0` |
| Border search accent | `border-border-search-accent` | `var(--color-border-search-accent)` | `#73c1b2` |

### Pitch Green Palette

| Shade | Tailwind Class | Hex |
|---|---|---|
| 100 | `bg-pitch-green-100` | `#e6f8f8` |
| 200 | `bg-pitch-green-200` | `#bef0e7` |
| 300 | `bg-pitch-green-300` | `#73e0cc` |
| 400 | `bg-pitch-green-400` | `#0dcaa9` |
| 500 | `bg-pitch-green-500` | `#0ab193` |
| 600 | `bg-pitch-green-600` | `#019b80` |
| 700 | `bg-pitch-green-700` | `#00846c` |
| 800 | `bg-pitch-green-800` | `#007e68` |
| 900 | `bg-pitch-green-900` | `#006c59` |

### Other Palette Colors

| Token | Tailwind Class | Hex |
|---|---|---|
| Grey 500 | `text-grey-500` | `#64748b` |
| Purple 500 | `text-purple-500` | `#8682f2` |
| Green 600 | `text-green-600` | `#00ad7e` |
| Parry Sky Blue 600 | `text-parry-sky-blue-600` | `#096ddf` |
| Yellow 500 | `text-yellow-500` | `#f59e0b` |
| Tab indicator hotel | — | `#0da7b2` |
| Tab indicator event | — | `#6161f3` |

### Chart Colors

| Token | Tailwind Class | Hex |
|---|---|---|
| Chart 1 | `fill-chart-1` | `#0ab193` |
| Chart 2 | `fill-chart-2` | `#0dcaa9` |
| Chart 3 | `fill-chart-3` | `#73e0cc` |
| Chart 4 | `fill-chart-4` | `#bef0e7` |
| Chart 5 | `fill-chart-5` | `#e6f8f8` |

---

## Typography

| Figma Style | Tailwind Classes |
|---|---|
| Heading large | `text-2xl font-bold text-heading` |
| Heading medium | `text-xl font-semibold text-heading` |
| Body | `text-base text-foreground` |
| Body secondary | `text-base text-body` |
| Caption | `text-sm text-muted-foreground` |
| Small | `text-xs text-muted-foreground` |

- Font: `font-sans` → Inter Variable (`@fontsource-variable/inter`)
- Mono: `font-mono` → Geist Mono

### Letter Spacing

| Token | Tailwind | Value |
|---|---|---|
| Normal | `tracking-normal` | `0rem` |
| Tighter | `tracking-tighter` | `-0.05em` |
| Tight | `tracking-tight` | `-0.025em` |
| Wide | `tracking-wide` | `+0.025em` |
| Wider | `tracking-wider` | `+0.05em` |
| Widest | `tracking-widest` | `+0.1em` |

---

## Spacing

Base unit: `--spacing: 0.25rem` (4px)

All spacing utilities use `calc(var(--spacing) * N)`. Common scale values:

| Figma px | Tailwind | rem |
|---|---|---|
| 4px | `1` (p-1, gap-1, m-1) | 0.25rem |
| 8px | `2` | 0.5rem |
| 12px | `3` | 0.75rem |
| 16px | `4` | 1rem |
| 20px | `5` | 1.25rem |
| 24px | `6` | 1.5rem |
| 32px | `8` | 2rem |
| 40px | `10` | 2.5rem |
| 48px | `12` | 3rem |
| 64px | `16` | 4rem |

### Tailwind v4: Decimal Spacing Values

Tailwind v4 supports **decimal values** in spacing utilities. Any `<number>` (including decimals) is valid — it computes `calc(var(--spacing) * <number>)`.

**Use decimal values instead of arbitrary `[Npx]` when the value fits the 4px grid:**

| Figma px | Tailwind v4 | Computation |
|---|---|---|
| 6px | `1.5` (p-1.5, gap-1.5) | `calc(0.25rem * 1.5)` |
| 10px | `2.5` | `calc(0.25rem * 2.5)` |
| 14px | `3.5` | `calc(0.25rem * 3.5)` |
| 18px | `4.5` | `calc(0.25rem * 4.5)` |
| 28px | `7` | `calc(0.25rem * 7)` |
| 35px | `8.75` | `calc(0.25rem * 8.75)` |
| 44px | `11` | `calc(0.25rem * 11)` |

**Rule:** If `Figma px / 4` produces a clean number (integer or simple decimal), use the decimal form. Otherwise, use arbitrary `[Npx]`.

```tsx
// ✅ Correct: 35px / 4 = 8.75 → clean decimal
<div className="h-8.75" />   // height: calc(var(--spacing) * 8.75) = 35px

// ✅ Correct: 14px / 4 = 3.5 → clean decimal
<div className="p-3.5" />    // padding: calc(var(--spacing) * 3.5) = 14px

// ❌ Wrong: using arbitrary when decimal works
<div className="h-[35px]" /> // unnecessary bracket syntax

// ✅ Correct: 17px / 4 = 4.25 → still clean, use decimal
<div className="w-4.25" />   // width: calc(var(--spacing) * 4.25) = 17px

// ✅ Correct: truly arbitrary value with no spacing relation
<div className="h-[calc(100vh-60px)]" /> // complex calc, brackets needed
```

---

## Radius

| Token | Tailwind | Value |
|---|---|---|
| `--radius-sm` | `rounded-sm` | `calc(0.75rem - 4px)` = 0.5rem |
| `--radius-md` | `rounded-md` | `calc(0.75rem - 2px)` = 0.625rem |
| `--radius-lg` | `rounded-lg` | `var(--radius)` = 0.75rem |
| `--radius-xl` | `rounded-xl` | `calc(0.75rem + 4px)` = 1rem |

---

## Shadows

| Token | Tailwind | Usage |
|---|---|---|
| `--shadow-2xs` | `shadow-2xs` | Subtle elevation |
| `--shadow-xs` | `shadow-xs` | Minimal elevation |
| `--shadow-sm` | `shadow-sm` | Cards, inputs |
| `--shadow` | `shadow` | Default elevation |
| `--shadow-md` | `shadow-md` | Dropdowns, popovers |
| `--shadow-lg` | `shadow-lg` | Modals, dialogs |
| `--shadow-xl` | `shadow-xl` | Floating elements |
| `--shadow-2xl` | `shadow-2xl` | Maximum elevation |
| `--shadow-card` | `shadow-card` | Card-specific (0.07 opacity) |
| `--shadow-card-sm` | `shadow-card-sm` | Small card (8% opacity) |
| `--shadow-card-md` | `shadow-card-md` | Medium card (10% opacity) |
| `--shadow-search` | `shadow-search` | Search field |
| `--shadow-search-field` | `shadow-search-field` | Search accent glow |
| `--shadow-button-elevated` | `shadow-button-elevated` | Elevated buttons |
| `--shadow-card-elevated` | `shadow-card-elevated` | Hero/floating cards |

---

## Custom Breakpoints

| Token | Tailwind Prefix | Value |
|---|---|---|
| Default (sm) | `sm:` | 640px |
| Tablet | `tablet:` | 768px |
| Default (md) | `md:` | 768px |
| Default (lg) | `lg:` | 1024px |
| Desktop | `desktop:` | 1280px |
| Default (xl) | `xl:` | 1280px |
| Wide | `wide:` | 1440px |

---

## Custom Utilities

| Utility | Tailwind Class | Effect |
|---|---|---|
| Primary gradient | `bg-gradient-primary` | `linear-gradient(to left, pitch-green-400, pitch-green-600)` |
| Hide scrollbar | `no-scrollbar` | Hides scrollbar on all platforms |
| Container | `container` | `max-width: 1400px`, `padding-inline: 1rem` (mobile) / `5rem` (sm+) |

---

## Custom Variants

| Variant | Selector | Usage |
|---|---|---|
| `data-open:` | `[data-state="open"]` or `[data-open]` | Open state for dropdowns, dialogs |
| `data-closed:` | `[data-state="closed"]` or `[data-closed]` | Closed state animations |
| `data-checked:` | `[data-state="checked"]` or `[data-checked]` | Checkbox, toggle checked |
| `data-unchecked:` | `[data-state="unchecked"]` or `[data-unchecked]` | Checkbox unchecked |
| `data-selected:` | `[data-selected="true"]` | List item selected |
| `data-disabled:` | `[data-disabled="true"]` or `[data-disabled]` | Disabled state |
| `data-active:` | `[data-state="active"]` or `[data-active]` | Active tab, menu item |
| `data-horizontal:` | `[data-orientation="horizontal"]` | Orientation variant |
| `data-vertical:` | `[data-orientation="vertical"]` | Orientation variant |

---

## Adding New Tokens

When Figma introduces a new token not yet in the theme:

```css
/* 1. Add raw value in :root */
:root {
  --color-my-new-token: #abc123;
}

/* 2. Map to Tailwind in @theme inline */
@theme inline {
  --color-my-new-token: var(--color-my-new-token, #abc123);
}
```

Then use in code: `bg-my-new-token`, `text-my-new-token`.

Source: `tooling/tailwind/theme.css`
