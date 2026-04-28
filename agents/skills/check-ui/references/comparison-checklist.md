# Visual Comparison Checklist

Detailed checklist for comparing implemented UI against Figma design. Each item should be verified at desktop (1280px) and mobile (375px) at minimum.

---

## 1. Layout & Structure

- [ ] **Grid/Flex direction** matches Figma (row vs column, wrap behavior)
- [ ] **Element order** matches — no reordered siblings
- [ ] **Container max-width** correct (bounded by `max-w-screen-xl` or similar)
- [ ] **Content centering** matches — centered vs left-aligned
- [ ] **Stacking order** on mobile — correct column ordering
- [ ] **Hidden elements** — elements hidden/shown at correct breakpoints
- [ ] **Overflow** — no horizontal scroll, no clipped content

## 2. Spacing

- [ ] **Padding** (inner spacing) matches Figma specs
- [ ] **Margin** (outer spacing) matches Figma specs
- [ ] **Gap** (flex/grid gap) between items correct
- [ ] **Section spacing** — vertical distance between major sections
- [ ] **Consistent rhythm** — spacing follows 4px/8px grid system

### How to verify spacing:
```javascript
// In javascript_tool — check computed spacing
(() => {
  const el = document.querySelector('<selector>')
  const s = getComputedStyle(el)
  return {
    padding: s.padding,
    margin: s.margin,
    gap: s.gap,
    paddingTop: s.paddingTop,
    paddingBottom: s.paddingBottom,
    marginTop: s.marginTop,
    marginBottom: s.marginBottom
  }
})()
```

## 3. Typography

- [ ] **Font family** correct (Inter, system fonts)
- [ ] **Font size** matches Figma (compare px values)
- [ ] **Font weight** matches (400/500/600/700)
- [ ] **Line height** matches
- [ ] **Letter spacing** if specified
- [ ] **Text color** matches — use semantic tokens
- [ ] **Text alignment** (left/center/right)
- [ ] **Text overflow** — truncation with ellipsis where designed
- [ ] **Max lines** — `line-clamp-*` applied correctly

### How to verify typography:
```javascript
(() => {
  const el = document.querySelector('<selector>')
  const s = getComputedStyle(el)
  return {
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    color: s.color,
    textAlign: s.textAlign
  }
})()
```

## 4. Colors

- [ ] **Background colors** match Figma fills
- [ ] **Text colors** match — primary, secondary, muted
- [ ] **Border colors** match
- [ ] **Icon colors** match (fill/stroke)
- [ ] **Gradient** direction and stops correct (if any)
- [ ] **Opacity** values match
- [ ] **Hover/active states** color transitions correct

### How to verify colors:
```javascript
(() => {
  const el = document.querySelector('<selector>')
  const s = getComputedStyle(el)
  return {
    backgroundColor: s.backgroundColor,
    color: s.color,
    borderColor: s.borderColor,
    opacity: s.opacity
  }
})()
```

## 5. Borders & Shadows

- [ ] **Border radius** matches (rounded-sm/md/lg/xl/full)
- [ ] **Border width** correct (0/1/2px)
- [ ] **Border style** correct (solid/dashed/none)
- [ ] **Box shadow** matches Figma elevation
- [ ] **Dividers** present where designed

## 6. Images & Icons

- [ ] **Images render** — no broken images (check network tab)
- [ ] **Image aspect ratio** preserved (object-fit: cover/contain)
- [ ] **Image sizing** matches Figma dimensions
- [ ] **Icon size** matches (16/20/24px)
- [ ] **Icon color** matches (currentColor or explicit)
- [ ] **Icon alignment** with text correct
- [ ] **Placeholder/skeleton** shown during loading

## 7. Components

- [ ] **Buttons** — correct variant (primary/secondary/outline/ghost), size, padding
- [ ] **Inputs** — height, padding, border, placeholder text
- [ ] **Cards** — padding, shadow, radius, content spacing
- [ ] **Badges/Tags** — size, colors, text style
- [ ] **Avatars** — size, shape (rounded-full), fallback
- [ ] **Tooltips** — if visible, position and style correct
- [ ] **Modals/Sheets** — dimensions, backdrop, animation

## 8. Interactive States (Visual Only)

Check hover states by using `computer({ action: "hover" })`:

- [ ] **Hover** — color/shadow/scale change matches
- [ ] **Focus** — ring/outline visible and correct
- [ ] **Disabled** — opacity/cursor correct
- [ ] **Active/Selected** — correct visual indicator
- [ ] **Loading** — spinner/skeleton placement correct

## 9. Responsive Behavior

| Check | Mobile (375) | Tablet (768) | Desktop (1280) | Wide (1440) |
|---|---|---|---|---|
| Layout direction | | | | |
| Element visibility | | | | |
| Font sizes | | | | |
| Spacing scale | | | | |
| Image sizing | | | | |
| Navigation style | | | | |
| Card grid columns | | | | |

## 10. Content Rendering

- [ ] **Text content** renders (even if placeholder/mock data)
- [ ] **Numbers/prices** formatted correctly
- [ ] **Dates** formatted correctly
- [ ] **Empty states** — graceful when no data
- [ ] **Long text** — handles overflow correctly
- [ ] **Special characters** — Vietnamese diacritics render properly

---

## Severity Guide

| Severity | Definition | Examples |
|----------|-----------|----------|
| **CRITICAL** | Layout broken, unusable | Wrong flex direction, major overlap, invisible content |
| **HIGH** | Noticeable mismatch | Wrong font size, wrong color, significant spacing gap |
| **MEDIUM** | Minor difference | 2-4px spacing off, slightly different shadow |
| **LOW** | Negligible | 1px difference, sub-pixel rendering, anti-aliasing |
