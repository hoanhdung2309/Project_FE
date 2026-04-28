# i18n Workflow — Figma Text to Translation Keys

How to handle user-facing text from Figma designs.

---

## Rule: No Hardcoded Strings

Every user-facing string (labels, buttons, messages, placeholders, titles) MUST use `t()` or `i18n.t()`.

```tsx
// WRONG
<button>Submit</button>
<h1>Welcome back</h1>
<input placeholder="Search hotels..." />

// CORRECT
const { t } = useTranslation()
<button>{t("common.submit")}</button>
<h1>{t("greeting.welcomeBack")}</h1>
<input placeholder={t("search.placeholder")} />
```

---

## Locale Source Structure

Source of truth: TypeScript files in `packages/blocks/src/locales/`

```
packages/blocks/src/locales/
├── layout/           → nav, header, footer
│   ├── vi.ts
│   └── en.ts
├── shared/           → cross-domain keys (travel search, common labels)
│   ├── vi.ts
│   └── en.ts
└── domains/
    ├── home/         → home page feature keys
    │   ├── vi.ts
    │   └── en.ts
    ├── promotions/
    ├── experiences/
    └── explore/
```

App-specific keys: `apps/web/locales/en.ts`, `apps/web/locales/vi.ts`

---

## File Format

**`vi.ts` is the source of truth.** Use flat keys with dot notation.

```ts
// packages/blocks/src/locales/domains/home/vi.ts
export default {
  "home.hero.title": "Khám phá điểm đến",
  "home.hero.subtitle": "Tìm kiếm khách sạn tốt nhất",
  "home.hero.cta": "Tìm kiếm ngay",
} satisfies Record<string, string>
```

```ts
// packages/blocks/src/locales/domains/home/en.ts
export default {
  "home.hero.title": "Explore destinations",
  "home.hero.subtitle": "Find the best hotels",
  "home.hero.cta": "Search now",
} satisfies typeof import("./vi").default
```

### Key Rules

- **Flat keys** with dot notation: `"booking.search"`, not `{ booking: { search: } }`
- Add keys to **ALL** supported languages in the same segment
- `vi.ts` uses `satisfies Record<string, string>`
- `en.ts` uses `satisfies typeof import("./vi").default` (keeps keys in sync)
- Default namespace is `translation`

---

## Key Naming Convention

```
<domain>.<section>.<element>

Examples:
  home.hero.title
  home.hero.subtitle
  home.explore.seeAll
  layout.header.login
  layout.footer.downloadTitle
  shared.travelSearch.tab.hotel
  shared.travelSearch.search
```

---

## Server vs Client Usage

### In Loaders (Server)

```tsx
import { data } from "react-router"
import { getInstance } from "~/middleware/i18n"
import type { Route } from "./+types/home"

export async function loader({ context }: Route.LoaderArgs) {
  const i18n = getInstance(context)
  return data({
    title: i18n.t("home.hero.title"),
    description: i18n.t("home.hero.subtitle"),
  })
}
```

### In Components (Client)

```tsx
import { useTranslation } from "react-i18next"

function HeroSection() {
  const { t } = useTranslation()
  return (
    <section>
      <h1>{t("home.hero.title")}</h1>
      <p>{t("home.hero.subtitle")}</p>
      <button>{t("home.hero.cta")}</button>
    </section>
  )
}
```

---

## Where to Put New Keys

| Key scope | Location |
|---|---|
| Header, footer, nav | `packages/blocks/src/locales/layout/` |
| Shared across domains | `packages/blocks/src/locales/shared/` |
| Domain-specific (home, hotel, etc.) | `packages/blocks/src/locales/domains/<domain>/` |
| App-only keys | `apps/<app>/locales/` |

---

## Generated Output (Do NOT Edit)

The Vite plugin `mergeLocalesPlugin` generates:

```
public/assets/locales/vi/translation.json
public/assets/locales/en/translation.json
```

These are built from the TypeScript source files. **Never edit the JSON files by hand.**

Source: `packages/blocks/src/locales/`, `packages/lib/src/i18n/`, `agents/rules/i18n/`
