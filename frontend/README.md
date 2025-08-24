# Local Deployment
Go to /backend first and follow the steps listed there to deploy the backend server locally

Change **package.json** file contents:
Add 
```
  "private": true,
  "proxy": "http://localhost:3001", # ADD THIS
```

***NOTE: For docker deployment, undo the change, else it will not work.***

After the above change is done, run:
```
pnpm install
pnpm run dev
```

## Large Text Mode

Large Text Mode improves readability across the app by increasing the root font size and enforcing a minimum text size on key pages.

### How it works

- A context provider `FontSizeProvider` at `app/font-size-provider.tsx` manages the mode: `normal` or `large`.
- The provider:
  - Sets `document.documentElement.style.fontSize` to 18px in large mode (16px otherwise), scaling all `rem`-based text.
  - Persists the selection in `localStorage` under `app-font-size-mode`.
  - Exposes `useFontSize()` with `{ isLarge, mode, setMode, toggle }`.
- A utility class `.min-text-lg` in `app/globals.css` ensures any `text-xs`, `text-sm`, or `text-base` within the scoped container is promoted to at least `text-lg`.

### User toggle

Large Text can be toggled in the app Settings page:
- File: `app/settings/page.tsx`
- Control: an Accessibility card with a `Switch` bound to `useFontSize()`.

### Applying minimum size on a page

On the Home page (`app/page.tsx`), the root container is conditionally given `min-text-lg text-lg` when Large Text is enabled to enforce the minimum size while preserving intentionally larger headings.

```tsx
// app/page.tsx
import { useFontSize } from '@/app/font-size-provider'

export default function HomePage() {
  const { isLarge } = useFontSize()
  return (
    <div className={`min-h-screen bg-gray-50 ${isLarge ? 'min-text-lg text-lg' : ''}`}>
      {/* page content */}
    </div>
  )
}
```

### Programmatic usage

Anywhere in the app, you can access or toggle the mode:

```tsx
import { useFontSize } from '@/app/font-size-provider'

function FontSizeToggleButton() {
  const { isLarge, toggle } = useFontSize()
  return (
    <button onClick={toggle}>{isLarge ? 'Switch to normal text' : 'Switch to large text'}</button>
  )
}
```

### Notes

- The provider is added in `app/layout.tsx`, so the mode applies globally.
- Pages can opt-in to the `.min-text-lg` utility to guarantee a minimum legible size for smaller text tokens.