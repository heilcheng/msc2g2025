'use client'

import React from 'react'

type FontSizeMode = 'normal' | 'large'

type FontSizeContextValue = {
  mode: FontSizeMode
  isLarge: boolean
  setMode: (mode: FontSizeMode) => void
  toggle: () => void
}

const FontSizeContext = React.createContext<FontSizeContextValue | undefined>(
  undefined
)

const LOCAL_STORAGE_KEY = 'app-font-size-mode'

function applyRootFontSize(mode: FontSizeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  // Tailwind uses rem units, so changing root font-size scales the entire UI.
  // normal: 16px (100%), large: 18px (~112.5%)
  root.style.fontSize = mode === 'large' ? '18px' : '16px'
  root.setAttribute('data-font-size', mode)
}

export function FontSizeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mode, setMode] = React.useState<FontSizeMode>('normal')

  // Initialize from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY) as FontSizeMode | null
      if (stored === 'large' || stored === 'normal') {
        setMode(stored)
        applyRootFontSize(stored)
        return
      }
    } catch {}
    applyRootFontSize('normal')
  }, [])

  // Apply changes and persist
  React.useEffect(() => {
    applyRootFontSize(mode)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, mode)
    } catch {}
  }, [mode])

  const value = React.useMemo<FontSizeContextValue>(
    () => ({
      mode,
      isLarge: mode === 'large',
      setMode,
      toggle: () => setMode((m) => (m === 'large' ? 'normal' : 'large')),
    }),
    [mode]
  )

  return (
    <FontSizeContext.Provider value={value}>{children}</FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const ctx = React.useContext(FontSizeContext)
  if (!ctx) {
    throw new Error('useFontSize must be used within a FontSizeProvider')
  }
  return ctx
}


