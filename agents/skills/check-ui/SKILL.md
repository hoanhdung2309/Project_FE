---
name: check-ui
description: Visual QA — compare implemented UI against Figma design using Chrome browser automation. Checks layout, spacing, colors, typography, responsive breakpoints, and pixel accuracy. No logic — UI only.
version: 1.2.0
source: local-repo-analysis
---

# Check UI — Visual QA against Figma

Compare the implemented UI in browser against the Figma design. **UI only — no logic, no data wiring, no API calls.**

## References

| Reference | Content |
|---|---|
| [comparison-checklist.md](references/comparison-checklist.md) | Full visual comparison checklist by category |
| [breakpoints.md](references/breakpoints.md) | Responsive breakpoints and viewport sizes |

---

## Prerequisites

Before running this skill:
- UI implementation is complete (from `/figma-to-code` or manual)
- Dev server is running (`pnpm dev:web` or `pnpm dev:hotel`)
- Figma file is open in Figma Desktop with the target frame selected
- Chrome browser is available for automation

---

## Critical Rules

### Mobile Check Requires User Action (CRITICAL)

**This project uses server-side User-Agent detection to render desktop vs mobile layouts.**

The layout loader parses the `User-Agent` HTTP header via `ua-parser-js`. When `device.type === "mobile"`, the server renders mobile layout. Otherwise, desktop layout.

**`resize_window` and automated Device Toolbar toggle do NOT reliably trigger mobile layout** — the UA override requires manual Chrome DevTools interaction.

**Before checking mobile UI, you MUST:**
1. **Ask the user** to open the target URL in Chrome with Device Toolbar enabled (mobile device emulation)
2. **Wait for user confirmation** that mobile UI is visible in Chrome
3. Only then proceed with screenshot and comparison

**Never attempt to auto-toggle Device Toolbar via keyboard shortcuts** — it is unreliable and may leave the browser in an inconsistent state.

### Load Project Rules (CRITICAL)

**MUST load `design-system.md` alongside skill references** — it defines semantic tokens, radius mapping, and the mandate to prefer semantic tokens over arbitrary values.

At Phase 0, read ALL in parallel:
```
Read("references/comparison-checklist.md")
Read("references/breakpoints.md")
Read("agents/rules/design-system.mdc")
```

### Verify ALL Breakpoints (CRITICAL)

**When checking shared components (single `.tsx` used for both mobile and desktop):**
- MUST check at BOTH mobile (375px) AND desktop (1280px) minimum
- Even if user only asks to check one breakpoint, verify the other is not broken
- Report discrepancies PER breakpoint

### Use Token Map for Comparison (CRITICAL)

When comparing computed CSS values against Figma specs:
- **Do NOT report `rounded-sm` as wrong just because Figma says "8px"** — `rounded-sm` IS 8px
- **Cross-reference** `token-map.md` radius/color/spacing tables
- **Recommendations must use semantic tokens**, not arbitrary values (e.g. recommend `rounded-sm` not `rounded-[8px]`)

### Read Source Code in Parallel (CRITICAL)

At Phase 1, read the component source code IN PARALLEL with Figma capture — not after.

---

## Workflow

### Phase 0: Load References + Rules

Read ALL in parallel:
```
Read("references/comparison-checklist.md")
Read("references/breakpoints.md")
Read("agents/rules/design-system.mdc")
Read("<target-component-source-file>.tsx")
```

### Phase 1: Capture Design Reference

1. **Get Figma screenshot** of the target design:
   ```
   mcp__figma-desktop__get_screenshot({ nodeId: "<node-id>" })
   ```
2. **Get Figma design context** for detailed specs:
   ```
   mcp__figma-desktop__get_design_context({ nodeId: "<node-id>" })
   ```
3. **Note key design specs**: colors, font sizes, spacing, border radius, shadows, layout structure
4. **Map specs to semantic tokens** using token-map — e.g. Figma 8px radius → `rounded-sm`

### Phase 2: Setup Browser

1. **Get tab context**:
   ```
   mcp__claude-in-chrome__tabs_context_mcp({ createIfEmpty: true })
   ```
2. **Create a new tab** for testing:
   ```
   mcp__claude-in-chrome__tabs_create_mcp()
   ```
3. **Navigate** to the implemented page:
   ```
   mcp__claude-in-chrome__navigate({ url: "http://localhost:3000/<route>", tabId })
   ```

### Phase 3: Desktop Comparison (1280px)

1. **Ensure Device Toolbar is OFF** (desktop UA):
   - If Device Toolbar is currently ON from a previous mobile check, toggle it OFF first (see "Toggle Device Toolbar" procedure below)
   - Reload the page to ensure server receives desktop UA
2. **Resize window** to desktop:
   ```
   mcp__claude-in-chrome__resize_window({ width: 1280, height: 800, tabId })
   ```
3. **Take screenshot**:
   ```
   mcp__claude-in-chrome__computer({ action: "screenshot", tabId })
   ```
4. **Compare side-by-side** against Figma screenshot — check:
   - Overall layout structure and alignment
   - Spacing between elements (margins, paddings, gaps)
   - Typography (font size, weight, line-height, color)
   - Colors (backgrounds, borders, text)
   - Border radius and shadows
   - Icon sizes and placement
   - Image aspect ratios and cropping
   - Component states (hover states if applicable)

5. **Zoom into specific sections** for pixel-level comparison:
   ```
   mcp__claude-in-chrome__computer({ action: "zoom", region: [x0, y0, x1, y1], tabId })
   ```

### Phase 4: Mobile Comparison (375px)

> **This project uses server-side UA detection.** `resize_window` does NOT change the User-Agent —
> the server still renders desktop layout. Automated Device Toolbar toggle via keyboard shortcuts
> is unreliable. The user MUST manually open the mobile view.

#### Mobile check steps

1. **Ask the user to prepare mobile view:**
   > "Tôi cần check UI mobile. Bạn hãy mở URL `<target-url>` trong Chrome với Device Toolbar (mobile emulation) bật sẵn, sau đó cho tôi biết khi nào xong."
2. **Wait for user confirmation** that mobile UI is visible
3. **Get tab context** to find the mobile tab:
   ```
   mcp__claude-in-chrome__tabs_context_mcp({ createIfEmpty: false })
   ```
4. **Take screenshot** of the mobile tab:
   ```
   mcp__claude-in-chrome__computer({ action: "screenshot", tabId })
   ```
5. **Compare** against Figma mobile frame
6. **Report** discrepancies with mobile-specific checks (single column, touch targets, no overflow)

### Phase 4b: Other Responsive Breakpoints

For breakpoints that do NOT require UA change (tablet, wide desktop), use `resize_window` as normal.

| Breakpoint | Width | Height | Method |
|---|---|---|---|
| Mobile | 375 | 812 | **User opens manually** (Phase 4) |
| Tablet | 768 | 1024 | `resize_window` |
| Desktop | 1280 | 800 | `resize_window` (Phase 3) |
| Wide | 1440 | 900 | `resize_window` |

For tablet/wide:
1. `resize_window({ width, height, tabId })`
2. `computer({ action: "screenshot", tabId })`
3. Compare layout, stacking, visibility, font scaling
4. Check for overflow, cut-off text, broken layouts

### Phase 5: Element-Level Verification

Use `read_page` and `find` to verify DOM structure:

1. **Check element existence**:
   ```
   mcp__claude-in-chrome__find({ query: "<element description>", tabId })
   ```
2. **Verify styles via JS** (spot-check critical elements):
   ```
   mcp__claude-in-chrome__javascript_tool({
     action: "javascript_exec",
     text: "(() => { const el = document.querySelector('<selector>'); const s = getComputedStyle(el); return { fontSize: s.fontSize, color: s.color, padding: s.padding, margin: s.margin, borderRadius: s.borderRadius, backgroundColor: s.backgroundColor, gap: s.gap } })()",
     tabId
   })
   ```
3. **Compare computed values** against Figma design context specs

### Phase 6: Scroll & Full Page Check

1. **Scroll through the page** to check all sections:
   ```
   mcp__claude-in-chrome__computer({ action: "scroll", coordinate: [640, 400], scroll_direction: "down", scroll_amount: 5, tabId })
   ```
2. **Screenshot after each scroll** to capture below-the-fold content
3. **Verify**: no broken sections, consistent spacing, all sections rendered

### Phase 7: Report

Generate a structured report:

```markdown
## UI Check Report: [Page/Component Name]

### Summary
- Status: PASS / FAIL / NEEDS_REVIEW
- Breakpoints tested: Mobile (375) | Tablet (768) | Desktop (1280) | Wide (1440)
- Figma node: <node-id>
- URL tested: <localhost-url>

### Discrepancies Found
| # | Category | Element | Expected (Figma) | Actual (Browser) | Severity |
|---|----------|---------|-------------------|-------------------|----------|
| 1 | Spacing  | ...     | ...               | ...               | HIGH     |

### Severity Levels
- **CRITICAL**: Layout broken, major visual mismatch
- **HIGH**: Noticeable spacing/color/typography difference
- **MEDIUM**: Minor visual difference, acceptable with review
- **LOW**: Negligible, pixel-level difference

### Screenshots
- Desktop: [captured]
- Mobile: [captured]
- Tablet: [captured]

### Recommendations
- List of specific CSS/Tailwind fixes needed
```

---

## GIF Recording (Optional)

To record the comparison process for review:

```
// Start recording
mcp__claude-in-chrome__gif_creator({ action: "start_recording", tabId })
mcp__claude-in-chrome__computer({ action: "screenshot", tabId })  // first frame

// ... perform all checks, screenshots, scrolls ...

// Stop and export
mcp__claude-in-chrome__computer({ action: "screenshot", tabId })  // last frame
mcp__claude-in-chrome__gif_creator({ action: "stop_recording", tabId })
mcp__claude-in-chrome__gif_creator({
  action: "export",
  tabId,
  filename: "ui-check-<component>.gif",
  download: true,
  options: { showClickIndicators: true, showActionLabels: true, showProgressBar: true }
})
```

---

## What This Skill Does NOT Do

- No logic implementation (API calls, state, events)
- No data wiring (TanStack Query, Zustand, NUQS)
- No i18n key creation (only checks if text renders)
- No code writing or fixing — only reports discrepancies
- No accessibility audit (separate concern)

After this skill reports issues, the developer fixes them manually or via `/figma-to-code`.

---

## Quick Invocation

Minimum required input:
1. Figma node ID or "currently selected" in Figma
2. Localhost URL of the implemented page
3. Target app: `web` (port 3000) or `hotel` (port 3001)

Example:
```
/check-ui
Figma: node 123:456
URL: http://localhost:3000/booking/confirmation
App: web
```
