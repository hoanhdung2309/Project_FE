---
paths:
  - "**/*.tsx"
  - "**/hooks/**/*.ts"
  - "**/queries/**/*.ts"
---

## Defensive Fallbacks — Nullish Coalescing at Assignment

Apply `??` at the point of assignment so downstream code never needs `?.`:

```tsx
const tickets = data?.tickets ?? []
const { name, email } = user ?? { name: "Guest", email: "-" }
```

| Source type | Fallback |
|-------------|----------|
| `T[] \| undefined` | `?? []` |
| `string \| null` | `?? ""` |
| `number \| undefined` | `?? 0` |
| `T \| null` | `?? defaultValue` |

If a variable already has a fallback, do not use `?.` on it.
