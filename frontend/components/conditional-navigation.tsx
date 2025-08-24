"use client"

import { usePathname } from "next/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"

// Routes where navigation should be hidden
const ROUTES_WITHOUT_NAVIGATION = ['/login', '/signup', '/forgot-password']

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Check if current route should hide navigation
  const shouldHideNavigation = ROUTES_WITHOUT_NAVIGATION.some(route => 
    pathname.startsWith(route)
  )
  
  // Don't render navigation on auth pages
  if (shouldHideNavigation) {
    return null
  }
  
  // Render navigation for all other pages
  return <MobileNavigation />
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current route should hide navigation
  const shouldHideNavigation = ROUTES_WITHOUT_NAVIGATION.some(route => 
    pathname.startsWith(route)
  )
  
  // Use different padding based on whether navigation is shown
  const containerClass = shouldHideNavigation 
    ? "min-h-screen" 
    : "min-h-screen pb-20"
  
  return (
    <div className={containerClass}>
      {children}
    </div>
  )
}
