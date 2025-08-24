"use client"

import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { Loader } from "lucide-react"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"

interface RouteGuardProps {
  children: React.ReactNode
}

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password']

export function RouteGuard({ children }: RouteGuardProps) {
  const { isLoading, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const { t, ready } = useTranslation()
  const [isClient, setIsClient] = useState(false)

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  // Ensure we're on the client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Loader className="w-8 h-8 text-green-600 animate-spin stroke-2" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {isClient && ready ? t('components.routeGuard.loading') : 'Loading...'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isClient && ready ? t('components.routeGuard.checkingAuth') : 'Checking authentication'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If route is public or user is authenticated, render children
  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>
  }

  // If not authenticated and trying to access protected route, 
  // the AuthProvider will handle the redirect
  return null
}
