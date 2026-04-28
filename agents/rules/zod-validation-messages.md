## Zod Validation — Embed Error Messages in Schema

**Impact: HIGH (single source of truth for validation rules and error messages)**

Validation error messages must be defined directly on the Zod schema validators, not in separate if-else/switch logic. The validate function should only extract messages from Zod issues — never duplicate the schema's validation logic.

Use `z.email()` instead of `z.string().email()` (deprecated in Zod v4). Use `z.core.$ZodIssue` instead of `z.ZodIssue` (deprecated).

**Incorrect (duplicating validation logic in validate function):**

```typescript
const personSchema = z.object({
  name: z.string().trim().min(1).max(100).regex(/^[A-Za-z\s]+$/),
  email: z.string().email().max(254),
})

function validatePerson(data: PersonInfo) {
  const result = personSchema.safeParse(data)
  if (result.success) return {}

  const errors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0]
    // ❌ Duplicates validation logic already in the schema
    if (field === "name") {
      if (data.name.trim().length === 0) {
        errors[field] = { key: "validation.required" }
      } else if (data.name.trim().length > 100) {
        errors[field] = { key: "validation.nameMaxLength", params: { max: 100 } }
      } else {
        errors[field] = { key: "validation.nameInvalid" }
      }
    }
  }
  return errors
}
```

**Correct (messages on schema, validate function just extracts):**

```typescript
// Helper to encode ValidationError as Zod message
function vm(key: string, params?: Record<string, string | number>): string {
  return params ? JSON.stringify({ key, params }) : key
}

function parseIssueMessage(message: string): ValidationError {
  if (message.startsWith("{")) {
    try {
      const parsed = JSON.parse(message) as ValidationError
      if (parsed.key) return parsed
    } catch { /* plain key fallback */ }
  }
  return { key: message }
}

// Messages embedded in schema — single source of truth
const personSchema = z.object({
  name: z.string().trim()
    .min(1, vm("validation.required"))
    .max(FIELD_LIMITS.NAME_MAX, vm("validation.nameMaxLength", { max: FIELD_LIMITS.NAME_MAX }))
    .regex(NAME_REGEX, vm("validation.nameInvalid")),
  email: z.email(vm("validation.invalidEmail")).trim()
    .min(1, vm("validation.required"))
    .max(FIELD_LIMITS.EMAIL_MAX, vm("validation.emailMaxLength", { max: FIELD_LIMITS.EMAIL_MAX })),
})

// Generic extractor — no field-specific logic
function extractFieldErrors<T extends string>(
  issues: z.core.$ZodIssue[]
): Partial<Record<T, ValidationError>> {
  const errors: Partial<Record<T, ValidationError>> = {}
  for (const issue of issues) {
    const field = issue.path[0] as T
    if (!errors[field]) {
      errors[field] = parseIssueMessage(issue.message)
    }
  }
  return errors
}

function validatePerson(data: PersonInfo) {
  const result = personSchema.safeParse(data)
  if (result.success) return {}
  return extractFieldErrors<keyof PersonInfo>(result.error.issues)
}
```

### Key rules

| Concern | How |
|---------|-----|
| Error message for a validator | Pass as second arg: `.min(5, "key")` or `.min(5, vm("key", { min: 5 }))` |
| Email field | `z.email("key")` — NOT `z.string().email("key")` (deprecated in Zod v4) |
| Issue type | `z.core.$ZodIssue` — NOT `z.ZodIssue` (deprecated) |
| Messages with params | Encode via `vm()` helper, decode via `parseIssueMessage()` |
| Validate function | Extract messages from issues only — never re-check field values |

Reference: `packages/core/src/domains/hotel/schemas/checkout-form-schema.ts`, `packages/core/src/shared/schemas/common-fields.ts`.
