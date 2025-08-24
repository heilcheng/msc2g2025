"use client"

import { Home, BarChart3, Users, HandHeart, Trophy, MessageCircle, Video } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

// Navigation items for parents
const parentNavItems = [
  { href: "/", icon: Home, label: "mobileNav.home" },
  { href: "/progress", icon: BarChart3, label: "mobileNav.progress" },
  { href: "/community", icon: Users, label: "mobileNav.community" },
  { href: "/help", icon: HandHeart, label: "mobileNav.help" },
  { href: "/leaderboard", icon: Trophy, label: "mobileNav.leaderboard" },
]

// Navigation items for volunteers
const volunteerNavItems = [
  { href: "/volunteer", icon: Home, label: "mobileNav.home" },
  { href: "/volunteer/community", icon: MessageCircle, label: "mobileNav.community" },
  { href: "/volunteer/live-tutoring", icon: Video, label: "mobileNav.liveTutoring" },
  { href: "/volunteer/leaderboard", icon: Trophy, label: "mobileNav.volunteerLeaderboard" },

]

// Navigation items for admin
const adminNavItems = [
  { href: "/admin", icon: Home, label: "mobileNav.home" },
  { href: "/admin/", icon: Users, label: "mobileNav.users" },
  { href: "/admin/reports", icon: BarChart3, label: "mobileNav.reports" },
  { href: "/admin/settings", icon: Users, label: "mobileNav.settings" },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { leaderboardVisible } = useSettings()

  // Get navigation items based on user role
  const baseNavItems = user?.role === 'volunteer' ? volunteerNavItems : (user?.role== 'parent' ? parentNavItems : adminNavItems)
  
  // Filter out leaderboard items if leaderboard is disabled
  const navItems = leaderboardVisible 
    ? baseNavItems 
    : baseNavItems.filter(item => !item.href.includes('leaderboard'))

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all duration-200 min-w-[60px]",
                isActive 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-primary" : "text-gray-500"
              )}>
                {t(`components.${item.label}`)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
