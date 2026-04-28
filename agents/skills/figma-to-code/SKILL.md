---
name: figma-to-code
description: Complete workflow for turning Figma designs into production code in this monorepo. Covers token mapping, component selection, asset handling, i18n, responsive layout, and quality gates.
version: 1.4.0
source: local-repo-analysis
analyzed_commits: 200
---

# Figma to Code Workflow

Complete workflow for implementing Figma designs in the web-ota monorepo (React 19, React Router 7, Tailwind v4, shadcn base-nova, Base UI).

## Critical Rules

### Scope Control

- **Implement ONLY the section/component explicitly requested** — never expand scope
- **1 section at a time**: Figma context → token map → implement → wire → next section
- If the user gives a full page, ask which section to start with

### Load ALL References + Project Rules (CRITICAL)

**MUST read ALL reference files AND the design-system rule before writing any code.**
They are already minimal/tối giản — designed for quick lookup with low context cost.
Skipping references leads to avoidable mistakes (wrong dimensions, missing patterns, weak QA).
**Loading is NOT enough — you must ACTIVELY CONSULT them when writing every Tailwind class.**

At Phase 0, read ALL 8 files in parallel:

```
Read("references/component-inventory.md")
Read("references/token-map.md")
Read("references/component-patterns.md")
Read("references/asset-handling.md")
Read("references/i18n-workflow.md")
Read("references/layout-responsive.md")
Read("references/quality-gates.md")
Read("agents/rules/design-system.mdc")   # PROJECT RULE — semantic tokens, radius, colors
```

### Actively Consult Token Map (CRITICAL)

**Before writing EVERY Tailwind class**, cross-check against token-map.md:

- **Radius** → look up Radius table → `rounded-sm`=8px, NOT `rounded-[8px]`
- **Color** → look up Colors table → use semantic token, flag if missing
- **Spacing** → look up Spacing table → use scale, NOT arbitrary
- **Shadow** → look up Shadows table → use theme shadow

If no semantic token exists → check `design-system.mdc` → ask user: add token or use hardcoded?

### className Format (CRITICAL)

**Default: plain `className="..."`** — no `cn()` wrapper needed for static classes.

```tsx
// Default — plain string, no cn()
className="flex h-6 items-center gap-3"

// cn([...]) — ONLY when conditionals/composites are needed
className={cn([isDisplay ? "block" : "hidden", "text-sm font-medium"])}
className={cn([isActive && "bg-primary", "flex items-center gap-2"])}
```

**Never use `cn()` for static-only classes.** Only use `cn([...])` array syntax when there are ternaries, `&&`, or dynamic expressions. See [layout-responsive.md](references/layout-responsive.md) for the full specification.

### Breakpoint-First for Shared Components (CRITICAL)

**If a component is shared between mobile and desktop (single `.tsx` file, no `.mobile.tsx`):**

- Base classes = mobile (default)
- Desktop overrides = `xl:` prefix
- **NEVER modify base classes that work on desktop to fix mobile — add breakpoint overrides instead**
- **MUST verify at BOTH mobile (375px) AND desktop (1280px) after every fix**

### No Explore Agents for Codebase Lookup

**NEVER use Explore agents or general-purpose agents for reading existing code.**
They are slow (>2 minutes each) and unnecessary when you know what to look for.

Instead, use direct tools:

| Need                  | Tool            | Example                                                       |
| --------------------- | --------------- | ------------------------------------------------------------- |
| Find files by name    | `Glob`          | `Glob("packages/ui/src/components/card.*")`                   |
| Find files by content | `Grep`          | `Grep("CopyIcon", path: "packages/ui/src/icons")`             |
| Read a known file     | `Read`          | `Read("apps/web/app/modules/booking-confirmation/index.tsx")` |
| Find similar patterns | `Grep` + `Read` | Grep for pattern → Read matched files                         |

**When to look up existing code (use Read/Glob/Grep directly):**

- Before implementing: read the nearest similar page module (e.g., `booking-confirmation` → `booking-complete`)
- Check icon availability: `Grep("ExportName", path: "packages/ui/src/icons")`
- Check UI components: `Glob("packages/ui/src/components/<name>.*")`
- Check existing locales: `Read("packages/blocks/src/locales/domains/<domain>/vi.ts")`
- Check types: `Grep("TypeName", path: "packages/core/src/domains")`

**Only use Agent tool when:** the search is genuinely open-ended and you have no idea where to look after 3+ direct searches fail.

## References

Detailed documentation for each phase:

| Reference                                                   | Phase                       | Content                                                                                               |
| ----------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| [component-inventory.md](references/component-inventory.md) | 0. Preparation              | All 60+ UI components by category, variants, sizes, sub-components — quick lookup table               |
| [token-map.md](references/token-map.md)                     | 1. Token Mapping            | Colors, typography, spacing, radius, shadows, custom variants — all from `tooling/tailwind/theme.css` |
| [component-patterns.md](references/component-patterns.md)   | 2. Component Implementation | Layer hierarchy, Base UI + CVA + data-slot pattern, composite components, mobile variants             |
| [asset-handling.md](references/asset-handling.md)           | 3. Assets                   | Icon decision tree, image placement, `webAsset()` API, CDN configuration                              |
| [i18n-workflow.md](references/i18n-workflow.md)             | 4. i18n                     | Translation keys, locale file structure, server vs client usage                                       |
| [layout-responsive.md](references/layout-responsive.md)     | 5. Layout & Responsive      | Breakpoints, advanced Tailwind selectors, common layout patterns                                      |
| [quality-gates.md](references/quality-gates.md)             | 6. Quality Gates            | Pre/post checklists, build verification, common mistakes                                              |

---

## Workflow Summary

### Phase 0: Preparation

1. **Load ALL references + project rules** — Read all 9 files in parallel (see Critical Rules above), including `design-system.mdc`
2. **Identify target app** — `apps/web` (port 3000) or `apps/hotel` (port 3001)
3. **Determine breakpoint strategy** — Is this a shared component (`.tsx`) or mobile-only (`.mobile.tsx`)? Shared → MUST use breakpoint prefixes
4. **Get Figma context** via MCP tools:
   - `get_design_context` → reference code, colors, typography, spacing
   - `get_screenshot` → visual reference (MUST call after get_design_context)
5. **Audit existing components** — use `Glob` and `Grep` directly:
   ```
   Glob("packages/ui/src/components/<name>.*")       # check UI atoms
   Grep("ComponentName", path: "packages/ui/src")     # find by export name
   Grep("IconName", path: "packages/ui/src/icons")    # find icons
   Read("packages/blocks/src/locales/domains/<domain>/vi.ts")  # check existing keys
   ```
6. **Read nearest similar module** for patterns:
   ```
   Read("apps/web/app/modules/<similar-feature>/index.tsx")
   ```

### Phase 1: Token Mapping → [token-map.md](references/token-map.md) + [design-system.mdc](../../agents/rules/design-system.mdc)

Map EVERY Figma fill/typography/spacing/radius to theme tokens. **Actively look up** `token-map.md` tables — do not guess or use arbitrary values.

**Mandatory lookup per property:**

| Figma property   | Look up in                | Action                                                       |
| ---------------- | ------------------------- | ------------------------------------------------------------ |
| Color hex        | Colors table in token-map | Use semantic class (`text-heading`, `bg-primary`)            |
| Font size/weight | Typography table          | Use Tailwind scale (`text-sm`, `font-semibold`)              |
| Spacing px       | Spacing table             | Use scale value (`p-4` = 16px, `gap-2` = 8px)                |
| Radius px        | **Radius table**          | `8px`→`rounded-sm`, `10px`→`rounded-md`, `12px`→`rounded-lg` |
| Shadow           | Shadows table             | Use theme shadow (`shadow-sm`, `shadow-card`)                |

**Common mappings:**

| Figma token                | Tailwind                                                    |
| -------------------------- | ----------------------------------------------------------- |
| `--text/heading #1e293b`   | `text-heading`                                              |
| `--text/body #334155`      | `text-body`                                                 |
| `--text/neutral #475569`   | `text-neutral`                                              |
| `--surface/gray #f1f5f9`   | `bg-surface-gray`                                           |
| `--surface/primary white`  | `bg-card`                                                   |
| `--border/primary #e2e8f0` | `border-border-primary`                                     |
| `--radius-lg 8px fallback` | `rounded-sm` (8px in theme, NOT `rounded-lg` which is 12px) |

**If a Figma token has no theme equivalent:** flag it to the user and ask whether to add a semantic token in `tooling/tailwind/theme.css` or use a hardcoded value. **Never silently use arbitrary values when a semantic token exists.**

### Phase 2: Component Implementation → [component-patterns.md](references/component-patterns.md)

Place code in the correct layer. Follow Base UI + CVA + data-slot pattern.

### Phase 3: Assets → [asset-handling.md](references/asset-handling.md)

Icons: reuse first, then small SVG → ui/icons, large SVG → public/assets. Images: always `webAsset()`.

### Phase 4: i18n → [i18n-workflow.md](references/i18n-workflow.md)

All user text via `t("key")`. Add keys to `vi.ts` + `en.ts`. Server uses `getInstance()`, client uses `useTranslation()`.

### Phase 5: Layout & Responsive → [layout-responsive.md](references/layout-responsive.md)

Mobile-first with Tailwind breakpoints. Use advanced selectors (data-_, has-data-_, group-\*, container queries).

### Phase 6: Quality Gates → [quality-gates.md](references/quality-gates.md)

Run checklists. Verify with `pnpm typecheck && pnpm lint`.

---

## Quick Reference: Import Paths

```tsx
// URL state
import { parseAsString, useQueryState } from "nuqs"
// i18n
import { useTranslation } from "react-i18next"

// Data
import { useGetHotelDetailQuery } from "@vtrip/core/shared/queries/hotel"
// Assets
import { webAsset } from "@vtrip/core/shared/utils/asset"
// Environment
import { env } from "@vtrip/env/client"
// UI components
import { Button } from "@vtrip/ui/components/button"
import { Card, CardContent, CardHeader } from "@vtrip/ui/components/card"
// Icons — always use @vtrip/ui/icons, NOT lucide-react
import { AlertTriangleIcon, ChevronRightIcon, SearchIcon } from "@vtrip/ui/icons"
// Utilities
import { cn } from "@vtrip/ui/lib/utils"

import { getInstance } from "~/middleware/i18n" // loader only
```

---

## Quick Reference: Radius Gotcha

**Figma `radius-lg` fallback is 8px, but theme `rounded-lg` is 12px.**

| Figma radius | Theme class                     | Actual px |
| ------------ | ------------------------------- | --------- |
| 4px          | `rounded-xs` or `rounded-[4px]` | 4px       |
| 8px          | `rounded-sm`                    | 8px       |
| 10px         | `rounded-md`                    | 10px      |
| 12px         | `rounded-lg`                    | 12px      |
| 16px         | `rounded-xl`                    | 16px      |

Always verify radius with `/check-ui` after implementing.

---

## Example: Full Flow

**Scenario:** Implement a "Confirmation Status Card" from Figma.

```
0. PREPARE    → Target: apps/web/app/modules/booking-complete/
               Read nearest similar: booking-confirmation/index.tsx (Read tool)
               Check icons: Grep("CopyIcon", packages/ui/src/icons) (Grep tool)
               Check locales: Read(packages/blocks/src/locales/domains/booking-complete/vi.ts)
1. FIGMA      → get_design_context(nodeId) + get_screenshot(nodeId)
2. TOKENS     → bg-card, bg-surface-gray, text-heading, text-body, rounded-sm (8px)
               Flag: #16a34a has no semantic token → use text-[#16a34a]
3. IMPLEMENT  → apps/web/app/modules/booking-complete/confirmation-status-card.tsx
4. i18n       → Add 3 keys to vi.ts + en.ts
5. LAYOUT     → Import in index.tsx, replace skeleton placeholder
6. VERIFY     → /check-ui against Figma → found radius mismatch → fix → re-verify
```
