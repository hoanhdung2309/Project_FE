---
title: Locale File Structure and Keys
impact: MEDIUM
impactDescription: Consistent locale structure and complete translations
tags: i18n, locales, translation-files, blocks, merge-locales
---

## Locale File Structure and Keys

**Impact: MEDIUM (consistent locale structure and complete translations)**

### Source of truth (TypeScript)

- **Blocks**: Locale source lives in `packages/blocks/src/locales/`:
  - **layout/** — nav, footer (header/footer)
  - **shared/** — shared keys (e.g. travelSearch)
  - **domains/** — per-domain: `promotions/`, `home/`, `experiences/`, `explore/`, etc.
- Each segment has `en.ts` and `vi.ts` (or other languages). Use **default export** and **flat keys** (dot-separated at top level).
- **vi** file: `export default { ... } satisfies Record<string, string>`.
- **en** file: `export default { ... } satisfies typeof import("./vi").default` (so keys stay in sync with vi).

**Correct (blocks locale file):**

```ts
// packages/blocks/src/locales/shared/vi.ts
export default {
  "travelSearch.tab.hotel": "Khách sạn",
  "travelSearch.search": "Tìm kiếm",
} satisfies Record<string, string>

// packages/blocks/src/locales/shared/en.ts
export default {
  "travelSearch.tab.hotel": "Hotel",
  "travelSearch.search": "Search",
} satisfies typeof import("./vi").default
```

- **App locale**: Apps (e.g. web) have their own locale modules (e.g. `apps/web/locales/en.ts`, `vi.ts`) that **import** from `@vtrip/blocks/locales/...` and merge with app-only keys, then export the merged object. The app decides which block segments to include.

### Output (generated)

- **public/assets/locales/{{lng}}/translation.json** is **generated** at build/dev by the Vite plugin `mergeLocalesPlugin` from `@vtrip/lib/i18n/vite-plugin-merge-locales`. Do **not** edit these JSON files by hand.
- Plugin options: `source` (default `"locales"`), `destination` (default `"public/assets/locales/{language}/translation.json"`), `supportedLanguages` (e.g. from `@vtrip/lib/i18n/config`).

### Rules

1. Use **flat keys** with dot notation (e.g. `booking.search`, `footer.downloadTitle`), not nested objects.
2. Add new keys to **all** supported languages in the same segment (e.g. both `en.ts` and `vi.ts`).
3. Put keys in the right place: **layout** (nav, footer), **shared** (cross-domain), **domains/&lt;domain&gt;** (feature-specific). App-only keys stay in the app’s locale modules.
4. Default namespace is `translation` unless configured otherwise; keys end up in a single merged JSON per language.

**Incorrect (nested keys or editing generated JSON):**

```json
{
  "booking": {
    "search": "Search"
  }
}
```

**Correct (flat keys in source TS):**

```ts
export default {
  "booking.search": "Search",
  "footer.downloadTitle": "Download app",
} satisfies Record<string, string>
```

Reference: `packages/lib/src/i18n/config.ts`, `packages/lib/src/i18n/vite-plugin-merge-locales.ts`, `packages/blocks/src/locales/`, `apps/web/locales/`.
