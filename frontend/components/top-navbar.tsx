"use client"

import { useState, useEffect, useRef } from "react"
import { Users, Settings, BarChart3, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "react-i18next"
import LanguageSwitcher from "@/components/language-switcher"

export function TopNavbar() {
  const { t } = useTranslation('common')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-md mx-auto px-6 py-6">
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="flex items-center gap-2 justify-self-start">
            <LanguageSwitcher />
          </div>
          <div className="flex justify-center justify-self-center">
            <Link href="/">
              <img src="/reach-logo.webp" alt="REACH Hong Kong" className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity dark:filter dark:brightness-110 dark:contrast-110" />
            </Link>
          </div>
          <div className="relative justify-self-end" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-background-light dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-border-soft dark:hover:bg-gray-700 transition-transform-colors hover:scale-105 cursor-pointer"
            >
              <Users className="w-5 h-5 text-text-secondary dark:text-gray-400" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || user?.phone}
                  </p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  {t("common.settings")}
                </Link>
                <Link
                  href="/volunteer/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Volunteer Dashboard
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  NGO Admin
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t("common.signOut")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNavbar
