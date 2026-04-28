# Quality Gates — Pre/Post Implementation Checklists

Verification steps before and after converting a Figma design to code.

---

## Pre-Implementation Checklist

Run through this BEFORE writing any code:

- [ ] **Target app identified** — `apps/web` or `apps/hotel`?
- [ ] **Existing components audited** — checked `@vtrip/ui`, `@vtrip/blocks`, `lucide-react`
- [ ] **Figma tokens mapped** — colors, typography, spacing → theme tokens
- [ ] **File placement decided** — ui / blocks / core / app module per layer hierarchy
- [ ] **New tokens identified** — any Figma color/spacing not yet in `tooling/tailwind/theme.css`?
- [ ] **i18n keys planned** — which locale segment? layout / shared / domains?
- [ ] **Assets exported** — images and icons from Figma with correct format

---

## Post-Implementation Checklist

Verify ALL items BEFORE committing:

### Naming & Structure
- [ ] All files use **kebab-case** naming
- [ ] Components use **PascalCase** exports
- [ ] Named exports only — no `export default`
- [ ] Files < 800 lines, functions < 50 lines

### Component Quality
- [ ] Every component part has `data-slot` attribute
- [ ] `className` merged via `cn()` — not string concatenation
- [ ] Props destructure `className` separately
- [ ] Full `...props` spreading
- [ ] `"use client"` on interactive components
- [ ] No `React.forwardRef` (Base UI handles refs)

### Architecture
- [ ] No circular imports — respect layer boundaries
- [ ] ui does NOT import from core, blocks, or apps
- [ ] blocks does NOT import from apps
- [ ] core does NOT import from ui or blocks

### i18n
- [ ] All user-facing text uses `t("key")` — no hardcoded strings
- [ ] Keys added to both `vi.ts` and `en.ts`
- [ ] Keys use flat dot notation: `"domain.section.element"`
- [ ] Server: `getInstance(context).t()` in loaders
- [ ] Client: `useTranslation().t()` in components

### Assets
- [ ] Images have `width`/`height` or aspect-ratio container (no CLS)
- [ ] Images use `webAsset()` in shared packages
- [ ] Icons use `@vtrip/ui/icons` or `lucide-react` first
- [ ] Large SVGs in `public/assets/icons/`, not as React components
- [ ] All public assets under `public/assets/`
- [ ] Meaningful `alt` text on content images

### Styling
- [ ] Semantic tokens used — `bg-primary`, not `bg-[#0ab193]`
- [ ] Theme radius used — `rounded-lg`, not `rounded-[12px]`
- [ ] Responsive: mobile-first with breakpoint prefixes
- [ ] Dark mode considered (`dark:` variants where needed)
- [ ] No arbitrary values when theme tokens exist

### Data
- [ ] TanStack Query hooks use `queryKeysFactory`
- [ ] URL state uses NUQS with typed parsers + `.withDefault()`
- [ ] Forms use TanStack Form
- [ ] Client state uses Zustand (not useState for shared state)

---

## Build Verification Commands

```bash
# MUST pass before committing
pnpm typecheck        # TypeScript strict checking
pnpm lint             # ESLint (cached)
pnpm format:fix       # Prettier formatting

# Single workspace check
pnpm --filter @vtrip/ui typecheck
pnpm --filter @vtrip/blocks typecheck

# Full build
pnpm build
```

---

## Visual Verification

After implementation, verify in browser:

- [ ] **Mobile** (375px) — layout correct, touch targets adequate
- [ ] **Tablet** (768px) — responsive transition smooth
- [ ] **Desktop** (1280px) — matches Figma design
- [ ] **Wide** (1440px) — container constrains properly
- [ ] **i18n** — switch between vi and en, text fits
- [ ] **Dark mode** — if applicable, colors adapt correctly
- [ ] **Loading states** — skeleton/spinner while data loads
- [ ] **Empty states** — graceful when no data
- [ ] **Error states** — user-friendly error messages

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---|---|
| Hardcoded hex colors | Use semantic tokens: `bg-primary` |
| Arbitrary pixel values | Use spacing scale: `p-4` not `p-[17px]` |
| Missing `data-slot` | Add to every component part |
| `export default` | Use named exports only |
| Inline SVG (50+ paths) | Put in `public/assets/icons/` |
| Hardcoded strings | Use `t("key")` for all user text |
| `useState` for URL state | Use NUQS |
| Manual `useSearchParams` | Use NUQS |
| Import from wrong layer | Check layer hierarchy |
| Edit generated locale JSON | Edit TypeScript source in `locales/` |
| `React.forwardRef` | Remove — Base UI handles refs |
| Arrow function exports | Use named function declarations |

Source: `agents/rules/`, `CLAUDE.md`
