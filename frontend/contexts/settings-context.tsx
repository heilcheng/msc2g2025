"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface SettingsContextType {
  leaderboardVisible: boolean
  setLeaderboardVisible: (visible: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [leaderboardVisible, setLeaderboardVisible] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        if (typeof parsed.leaderboardVisible === 'boolean') {
          setLeaderboardVisible(parsed.leaderboardVisible)
        }
      } catch (error) {
        console.error('Failed to parse settings from localStorage:', error)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    const settings = { leaderboardVisible }
    localStorage.setItem('app-settings', JSON.stringify(settings))
  }, [leaderboardVisible])

  return (
    <SettingsContext.Provider value={{
      leaderboardVisible,
      setLeaderboardVisible
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
