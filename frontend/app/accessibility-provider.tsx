"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilityContextType {
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  toggleHighContrast: () => void
  screenReaderMode: boolean
  setScreenReaderMode: (enabled: boolean) => void
  toggleScreenReaderMode: () => void
  reducedMotion: boolean
  setReducedMotion: (enabled: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  focusIndicators: boolean
  setFocusIndicators: (enabled: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrastState] = useState(false)
  const [screenReaderMode, setScreenReaderModeState] = useState(false)
  const [reducedMotion, setReducedMotionState] = useState(false)
  const [soundEnabled, setSoundEnabledState] = useState(true)
  const [focusIndicators, setFocusIndicatorsState] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast')
    const savedScreenReader = localStorage.getItem('accessibility-screen-reader')
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion')
    const savedSoundEnabled = localStorage.getItem('accessibility-sound-enabled')
    const savedFocusIndicators = localStorage.getItem('accessibility-focus-indicators')

    if (savedHighContrast) {
      setHighContrastState(savedHighContrast === 'true')
    }
    if (savedScreenReader) {
      setScreenReaderModeState(savedScreenReader === 'true')
    }
    if (savedReducedMotion) {
      setReducedMotionState(savedReducedMotion === 'true')
    }
    if (savedSoundEnabled) {
      setSoundEnabledState(savedSoundEnabled === 'true')
    }
    if (savedFocusIndicators) {
      setFocusIndicatorsState(savedFocusIndicators === 'true')
    }
  }, [])

  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  // Apply screen reader mode
  useEffect(() => {
    if (screenReaderMode) {
      document.documentElement.classList.add('screen-reader-mode')
      // Add screen reader optimizations
      document.documentElement.setAttribute('aria-enhanced', 'true')
    } else {
      document.documentElement.classList.remove('screen-reader-mode')
      document.documentElement.removeAttribute('aria-enhanced')
    }
  }, [screenReaderMode])

  // Apply reduced motion
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }
  }, [reducedMotion])

  // Apply enhanced focus indicators
  useEffect(() => {
    if (focusIndicators) {
      document.documentElement.classList.add('enhanced-focus')
    } else {
      document.documentElement.classList.remove('enhanced-focus')
    }
  }, [focusIndicators])

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled)
    localStorage.setItem('accessibility-high-contrast', enabled.toString())
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
  }

  const setScreenReaderMode = (enabled: boolean) => {
    setScreenReaderModeState(enabled)
    localStorage.setItem('accessibility-screen-reader', enabled.toString())
  }

  const toggleScreenReaderMode = () => {
    setScreenReaderMode(!screenReaderMode)
  }

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled)
    localStorage.setItem('accessibility-reduced-motion', enabled.toString())
  }

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled)
    localStorage.setItem('accessibility-sound-enabled', enabled.toString())
  }

  const setFocusIndicators = (enabled: boolean) => {
    setFocusIndicatorsState(enabled)
    localStorage.setItem('accessibility-focus-indicators', enabled.toString())
  }

  const value = {
    highContrast,
    setHighContrast,
    toggleHighContrast,
    screenReaderMode,
    setScreenReaderMode,
    toggleScreenReaderMode,
    reducedMotion,
    setReducedMotion,
    soundEnabled,
    setSoundEnabled,
    focusIndicators,
    setFocusIndicators,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
