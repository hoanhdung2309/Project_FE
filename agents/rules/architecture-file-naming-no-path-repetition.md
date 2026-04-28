---
title: File Naming — No Path Repetition
impact: HIGH
impactDescription: Shorter, cleaner file names that are easier to scan and search
tags: architecture, naming, files, conventions
---

## File Naming — No Path Repetition

**Impact: HIGH (shorter file names, reduced redundancy, easier to scan)**

File names must not repeat information already conveyed by the directory path. The directory structure provides domain, feature, and variant context — the file name should only add what is new. This keeps file names short, import paths readable, and avoids stuttering like `hotel/detail/mobile/hotel-detail-mobile-content.tsx`.

The component export name remains fully qualified (e.g. `HotelDetailMobileContent`) so it is unambiguous at usage sites. Only the **file name** is shortened.

### How to derive the file name

1. Look at the directory path: `domains/hotel/detail/mobile/`
2. The path already tells you: domain (`hotel`), feature (`detail`), variant (`mobile`)
3. The file name only needs the **role**: `content.tsx`, `main.tsx`, `skeleton.tsx`

### Pattern

| Directory path | File name | Export name |
|---|---|---|
| `domains/hotel/detail/mobile/` | `main.tsx` | `HotelDetailMobile` |
| `domains/hotel/detail/mobile/` | `content.tsx` | `HotelDetailMobileContent` |
| `domains/hotel/detail/mobile/` | `skeleton.tsx` | `HotelDetailMobileSkeleton` |
| `domains/hotel/detail/mobile/` | `tabs.tsx` | `HotelDetailMobileTabs` |
| `domains/hotel/detail/mobile/` | `overview.tsx` | `HotelOverviewMobile` |
| `domains/hotel/detail/mobile/` | `rate-plan-card.tsx` | `RatePlanCardMobile` |
| `domains/ticket/detail/mobile/` | `ticket-list.tsx` | `TicketList` |

**Incorrect (path repeated in file name):**

```
domains/hotel/detail/mobile/hotel-detail-mobile-content.tsx
domains/hotel/detail/mobile/hotel-detail-mobile-skeleton.tsx
domains/hotel/detail/mobile/hotel-detail-mobile-tabs.tsx
domains/hotel/detail/mobile/hotel-overview-mobile.tsx
domains/hotel/detail/mobile/rate-plan-card-mobile.tsx
```

**Correct (file name adds only new information):**

```
domains/hotel/detail/mobile/content.tsx
domains/hotel/detail/mobile/skeleton.tsx
domains/hotel/detail/mobile/tabs.tsx
domains/hotel/detail/mobile/overview.tsx
domains/hotel/detail/mobile/rate-plan-card.tsx
```

### Entry points

Use `main.tsx` for the primary entry component of a feature directory (matching the desktop convention in `detail/main.tsx`). Use `content.tsx` for the data-fetching orchestrator.

### When file names should stay descriptive

If a directory is flat and contains unrelated files, the file name must carry enough context on its own. This rule applies primarily to **feature directories** where the path already scopes the context (e.g. `detail/mobile/`, `checkout/`, `search/`).

Reference: `packages/blocks/src/domains/hotel/detail/mobile/`, `packages/blocks/src/domains/ticket/ticket-detail/mobile/`.
