---
title: File Naming — Kebab-Case
impact: HIGH
impactDescription: Consistent naming across the codebase, better cross-platform and tooling compatibility
tags: architecture, naming, kebab-case, files, conventions
---

## File Naming — Kebab-Case

**Impact: HIGH (consistent naming, cross-platform and tooling compatibility)**

All file names in the project must use **kebab-case** (lowercase letters, words separated by hyphens). This applies to every file type: `.ts`, `.tsx`, `.js`, `.css`, `.md`, config files, etc. Kebab-case avoids case-sensitivity issues on different systems, keeps URLs and imports predictable, and aligns with common ecosystem conventions.

**Incorrect (camelCase, PascalCase, or mixed):**

```
BookingSearchField.tsx
useHotelSearch.ts
QualityCodeComments.md
designSystem.mdc
```

**Correct (kebab-case):**

```
booking-search-field.tsx
use-hotel-search.ts
quality-code-comments.md
design-system.mdc
```

**Directory names:** Use kebab-case for directory names as well (e.g. `booking-search/`, `domains/hotel/`).

**Incorrect:**

```
domains/BookingSearch/BookingSearchField.tsx
modules/HomePage/templates/MainBanner.tsx
```

**Correct:**

```
domains/booking-search/booking-search-field.tsx
modules/home-page/templates/main-banner.tsx
```

Reference: Project conventions (Technical research — Web booking).
