# Responsive Breakpoints

Standard viewport sizes for visual QA testing. These match the project's Tailwind breakpoints.

---

## IMPORTANT: Server-Side UA Detection — Manual Mobile Setup Required

This project renders **different layouts** for mobile vs desktop based on the `User-Agent` HTTP header
(parsed server-side in `layout.tsx` loader via `ua-parser-js`).

- **Desktop layout**: `<DesktopLayout>` + `<Footer>`
- **Mobile layout**: `<main>` + `<MobileFooter>`

**`resize_window` does NOT change the User-Agent** — the server still sees a desktop browser.
**Automated Device Toolbar toggle is unreliable** — keyboard shortcuts may not work consistently.

**For mobile checks: ASK the user to manually open the URL in Chrome with Device Toolbar (mobile emulation) enabled, then wait for confirmation before proceeding.**

---

## Testing Matrix

| Name | Width | Height | Tailwind Prefix | Method | Priority |
|---|---|---|---|---|---|
| Mobile S | 320 | 568 | (default) | **User opens manually** | LOW |
| Mobile | 375 | 812 | (default) | **User opens manually** | **HIGH** |
| Mobile L | 428 | 926 | (default) | **User opens manually** | MEDIUM |
| Tablet | 768 | 1024 | `md:` | resize_window | **HIGH** |
| Desktop | 1280 | 800 | `xl:` | resize_window | **HIGH** |
| Wide | 1440 | 900 | `2xl:` | resize_window | MEDIUM |

**Minimum required**: Mobile (375, user opens manually), Desktop (1280)
**Recommended**: Mobile (375, user opens manually), Tablet (768), Desktop (1280), Wide (1440)

---

## Tailwind Breakpoints (from project config)

```
sm:  640px   → Small tablets, large phones landscape
md:  768px   → Tablets portrait
lg:  1024px  → Tablets landscape, small laptops
xl:  1280px  → Standard desktop
2xl: 1536px  → Large desktop
```

---

## Quick Commands

### Desktop / Tablet / Wide (resize_window — no UA change needed)

```javascript
// Tablet
resize_window({ width: 768, height: 1024, tabId })

// Desktop
resize_window({ width: 1280, height: 800, tabId })

// Wide
resize_window({ width: 1440, height: 900, tabId })
```

### Mobile (User opens manually)

**Do NOT attempt to auto-toggle Device Toolbar.** Instead:
1. Ask the user to open the URL in Chrome with Device Toolbar enabled (mobile emulation)
2. Wait for user confirmation
3. Use `tabs_context_mcp` to find the mobile tab
4. Take screenshot and compare

---

## What to Check at Each Breakpoint

### Mobile (375px)
- Single column layout
- Hamburger menu / bottom nav
- Full-width cards and buttons
- Touch-friendly tap targets (min 44px)
- No horizontal overflow
- Text readable without zooming

### Tablet (768px)
- Transition from 1-col to 2-col grid
- Sidebar visibility (hidden or visible?)
- Image scaling and aspect ratios
- Card grid: typically 2 columns

### Desktop (1280px)
- Full layout as designed in Figma
- Multi-column grids (3-4 columns)
- Sidebar fully visible
- Hover states available
- Max-width container centered

### Wide (1440px)
- Content doesn't stretch beyond max-width
- Proper centering and margins
- No awkward whitespace
- Images don't pixelate
