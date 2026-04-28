## Use Global AlertDialog Store for User Warnings

**Impact: HIGH (consistent UI, no custom dialog duplication, single mount point)**

All user-facing alert dialogs (warnings, errors with retry, confirmations) must use the global `useGlobalAlertDialogStore` from `@vtrip/core` and the `GlobalAlertDialog` component from `@vtrip/blocks`. Never create custom dialog markup inline — use the store's `show()` method to trigger the shared `AlertDialog` from `@vtrip/ui`.

**Incorrect (custom dialog markup in each component):**

```tsx
// ❌ Custom div-based dialog — not using AlertDialog, not reusable
function MyComponent() {
  const [showError, setShowError] = useState(false)

  return (
    <>
      {showError ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl p-6">
            <h2>Error</h2>
            <p>Something went wrong</p>
            <button onClick={() => setShowError(false)}>OK</button>
          </div>
        </div>
      ) : null}
    </>
  )
}
```

**Correct (global alert dialog store):**

```tsx
// ✅ Trigger via store — renders in the shared GlobalAlertDialog
import { useGlobalAlertDialogStore } from "@vtrip/core/shared/stores/use-global-alert-dialog-store"

function MyComponent() {
  const showAlert = useGlobalAlertDialogStore((s) => s.show)

  useEffect(() => {
    if (!error) return

    showAlert({
      title: t("error.title"),
      description: t("error.description"),
      action: {
        label: t("error.retry"),
        onClick: refetch,
      },
    })
  }, [error, showAlert, t, refetch])

  return <div>...</div>
}
```

### Setup

1. **Store** lives in `packages/core/src/shared/stores/use-global-alert-dialog-store.ts`
2. **Component** lives in `packages/blocks/src/shared/global-alert-dialog.tsx`
3. **Mount** `<GlobalAlertDialog />` once in each app's `providers.tsx`

### Store API

| Method | Signature | Purpose |
|--------|-----------|---------|
| `show` | `(config: { title, description, action, cancel? }) => void` | Open dialog |
| `close` | `() => void` | Close and reset |

Each `action` / `cancel` has: `{ label: string, onClick: () => void, variant?: "default" \| "destructive" \| "outline" }`

### When to use

- API errors with retry (e.g. payment methods failed to load)
- Missing required data warnings (e.g. missing orderId → redirect)
- Destructive confirmations (e.g. cancel booking)
- Any user-blocking alert that needs a single action or action + cancel

### Do NOT

- Create custom `<div>` overlays for alerts — always use the store
- Use `useState` + inline dialog markup for error/warning popups
- Mount `<GlobalAlertDialog />` more than once per app
- Import `AlertDialog` directly in feature components — use the store

Reference: `packages/core/src/shared/stores/use-global-alert-dialog-store.ts`, `packages/blocks/src/shared/global-alert-dialog.tsx`.
