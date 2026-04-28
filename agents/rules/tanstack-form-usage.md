## Use TanStack Form for Form State Management

**Impact: HIGH (consistent form state, type-safe field access, unified pattern across domains)**

All forms must use `@tanstack/react-form` instead of manual `useState` per field. Define the form hook with `useForm()` in `packages/core`, export the form API type, and wrap it in a React Context in `packages/blocks`. Consumers access values via `useStore(form.store, selector)` and update via `form.setFieldValue()`.

**Incorrect (manual useState per field):**

```typescript
// packages/core — ad-hoc state, no TanStack Form
export function useCheckoutFormState() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const setField = useCallback((field, value) => { ... }, [])
  return { name, email, setField }
}
```

**Correct (TanStack Form in core):**

```typescript
// packages/core/src/domains/hotel/hooks/use-checkout-form.ts
import { useForm } from "@tanstack/react-form"
import { DEFAULT_CHECKOUT_FORM_VALUES } from "../utils/checkout-form"

export function useCheckoutForm() {
  return useForm({
    defaultValues: DEFAULT_CHECKOUT_FORM_VALUES,
    onSubmit: ({ value }) => { /* handle submission */ },
  })
}

export type CheckoutFormApi = ReturnType<typeof useCheckoutForm>
```

**Correct (context wrapper in blocks):**

```typescript
// packages/blocks/src/domains/hotel/checkout/checkout-form-context.tsx
import { createContext, use } from "react"
import type { CheckoutFormApi } from "@vtrip/core/domains/hotel/hooks/use-checkout-form"
import { useCheckoutForm as useCheckoutFormInternal } from "@vtrip/core/domains/hotel/hooks/use-checkout-form"

const CheckoutFormContext = createContext<CheckoutFormApi | null>(null)

export function useCheckoutFormContext() {
  const ctx = use(CheckoutFormContext)
  if (!ctx) throw new Error("Missing CheckoutFormProvider")
  return ctx
}

export function CheckoutFormProvider({ children }: { children: React.ReactNode }) {
  const form = useCheckoutFormInternal()
  return <CheckoutFormContext value={form}>{children}</CheckoutFormContext>
}
```

**Correct (consumer component in blocks):**

```typescript
import { useStore } from "@tanstack/react-form"

function GuestInfoSection() {
  const form = useCheckoutFormContext()
  const email = useStore(form.store, (s) => s.values.customerDetail.email)

  return (
    <input
      value={email}
      onChange={(e) => form.setFieldValue("customerDetail.email", e.target.value)}
    />
  )
}
```

### Key patterns

| Concern | How |
|---------|-----|
| Create form | `useForm({ defaultValues, onSubmit })` in core |
| Export type | `export type FormApi = ReturnType<typeof useFormHook>` |
| Context | `createContext<FormApi \| null>(null)` in blocks, use `use()` (React 19) |
| Read values | `useStore(form.store, (s) => s.values.fieldName)` — granular subscriptions |
| Write values | `form.setFieldValue("path.to.field", value)` — dot-path for nested |
| Validation | Zod schemas in `schemas/` or `utils/`, called during render or via `validators` option |
| Default values | Defined alongside Zod schema in `utils/` or `schemas/` file, exported as const |

### Do NOT

- Use `useState` per form field — use `useForm` instead
- Put `useForm()` in blocks — form hook belongs in core
- Subscribe to entire form state — use granular `useStore` selectors
- Use `useContext()` — use `use()` (React 19) for context consumption

Reference: `packages/core/src/domains/hotel/hooks/use-hotel-search-form.ts`, `packages/blocks/src/domains/hotel/hotel-search/hotel-search-form-context.tsx`.
