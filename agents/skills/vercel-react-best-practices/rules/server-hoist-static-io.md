---
title: Hoist Static I/O to Module Level
impact: HIGH
impactDescription: avoids repeated file/network I/O per request
tags: server, io, performance, loaders, react-router
---

## Hoist Static I/O to Module Level

**Impact: HIGH (avoids repeated file/network I/O per request)**

When loading static assets (fonts, config files, templates) in route loaders, actions, or other server code, hoist the I/O to module level. Module-level code runs once when the module is first imported, not on every request.

**Incorrect: reads config on every request**

```typescript
export async function loader() {
  const config = JSON.parse(await fs.readFile("./config.json", "utf-8"))
  const template = await fs.readFile("./template.html", "utf-8")
  return { config, template }
}
```

**Correct: loads once at module level**

```typescript
const configPromise = fs.readFile("./config.json", "utf-8").then(JSON.parse)
const templatePromise = fs.readFile("./template.html", "utf-8")

export async function loader() {
  const [config, template] = await Promise.all([configPromise, templatePromise])
  return { config, template }
}
```

**With static file URLs (e.g. in Node):**

```typescript
const fontData = fetch(new URL("./fonts/Inter.ttf", import.meta.url)).then(
  (res) => res.arrayBuffer()
)

export async function loader() {
  const font = await fontData
  return { fontReady: true }
}
```

**When to use:** Static config, templates, fonts, or assets that are the same for all requests.
**When NOT to use:** Data that varies per request or user; large files that shouldn’t stay in memory; sensitive data.
