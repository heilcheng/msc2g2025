"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, User, Bell, Shield, HelpCircle, LogOut, Accessibility, Contrast, Volume2, Eye, MousePointer, ArrowLeft, Monitor, Sun, Moon, Trophy } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useFontSize } from "@/app/font-size-provider"
import { useAccessibility } from "@/app/accessibility-provider"
import { useTheme } from "@/app/theme-provider"
import { useSettings } from "@/contexts/settings-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"
import TopNavbar from "@/components/top-navbar"

export default function SettingsPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { isLarge, toggle } = useFontSize()
  const { theme, setTheme } = useTheme()
  const { leaderboardVisible, setLeaderboardVisible } = useSettings()
  const router = useRouter()
  
  // Use accessibility context
  const { 
    highContrast, 
    setHighContrast,
    screenReaderMode,
    setScreenReaderMode,
    reducedMotion,
    setReducedMotion,
    soundEnabled,
    setSoundEnabled,
    focusIndicators,
    setFocusIndicators
  } = useAccessibility()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun
      case 'dark': return Moon  
      default: return Monitor
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return t('settings.lightMode')
      case 'dark': return t('settings.darkMode')
      default: return t('settings.systemMode')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-orange-600" />
              {t('settings.title')}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = getThemeIcon()
                return <Icon className="w-5 h-5" />
              })()}
              {t('settings.appearance')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('settings.theme')}</p>
                <p className="text-sm text-gray-500">{t('settings.themeDesc')}</p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      {t('settings.lightMode')}
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      {t('settings.darkMode')}
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      {t('settings.systemMode')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              {t('settings.accessibility')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Large Text Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('settings.largeText')}</p>
                <p className="text-sm text-gray-500">{t('settings.largeTextDesc')}</p>
              </div>
              <Switch 
                checked={isLarge} 
                onCheckedChange={toggle} 
                aria-label="Toggle large text"
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Contrast className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{t('settings.highContrast')}</p>
                  <p className="text-sm text-gray-500">{t('settings.highContrastDesc')}</p>
                </div>
              </div>
              <Switch 
                checked={highContrast} 
                onCheckedChange={setHighContrast} 
                aria-label="Toggle high contrast mode"
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MousePointer className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{t('settings.reduceMotion')}</p>
                  <p className="text-sm text-gray-500">{t('settings.reduceMotionDesc')}</p>
                </div>
              </div>
              <Switch 
                checked={reducedMotion} 
                onCheckedChange={setReducedMotion} 
                aria-label="Toggle reduced motion"
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            
            {/* Sound Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{t('settings.soundEffects')}</p>
                  <p className="text-sm text-gray-500">{t('settings.soundEffectsDesc')}</p>
                </div>
              </div>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={setSoundEnabled} 
                aria-label="Toggle sound effects"
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            
            {/* Focus Indicators */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{t('settings.enhancedFocus')}</p>
                  <p className="text-sm text-gray-500">{t('settings.enhancedFocusDesc')}</p>
                </div>
              </div>
              <Switch 
                checked={focusIndicators} 
                onCheckedChange={setFocusIndicators} 
                aria-label="Toggle enhanced focus indicators"
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            
            {/* Screen Reader Support */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('settings.screenReaderMode')}</p>
                <p className="text-sm text-gray-500">{t('settings.screenReaderModeDesc')}</p>
              </div>
              <Switch 
                checked={screenReaderMode} 
                onCheckedChange={setScreenReaderMode} 
                aria-label="Toggle screen reader mode"
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            
            {/* Quick Accessibility Actions */}
            <div className="border-t pt-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  setHighContrast(false)
                  setScreenReaderMode(false)
                  setReducedMotion(false)
                  setSoundEnabled(true)
                  setFocusIndicators(true)
                }}
              >
                <Accessibility className="w-4 h-4 mr-2" />
                {t('settings.resetAccessibility')}
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <HelpCircle className="w-4 h-4 mr-2" />
                {t('settings.accessibilityHelp')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('settings.profile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-orange-600">EC</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.username}</p>
                <p className="text-sm text-gray-500">K3 Student</p>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              {t('settings.editProfile')}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t('settings.notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('settings.assignmentReminders')}</p>
                <p className="text-sm text-gray-500">{t('settings.assignmentRemindersDesc')}</p>
              </div>
              <Switch 
                defaultChecked 
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('settings.communityUpdates')}</p>
                <p className="text-sm text-gray-500">{t('settings.communityUpdatesDesc')}</p>
              </div>
              <Switch 
                defaultChecked 
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('settings.achievementBadges')}</p>
                <p className="text-sm text-gray-500">{t('settings.achievementBadgesDesc')}</p>
              </div>
              <Switch 
                defaultChecked 
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('settings.privacy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t('settings.anonymousMode')}</p>
                <p className="text-sm text-gray-500">{t('settings.anonymousModeDesc')}</p>
              </div>
              <Switch className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{t('settings.leaderboardVisibility')}</p>
                  <p className="text-sm text-gray-500">{t('settings.leaderboardVisibilityDesc')}</p>
                </div>
              </div>
              <Switch 
                checked={leaderboardVisible}
                onCheckedChange={setLeaderboardVisible}
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-primary" 
              />
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              {t('settings.changePassword')}
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              {t('settings.support')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              {t('settings.helpCenter')}
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              {t('settings.contactSupport')}
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              {t('settings.reportProblem')}
            </Button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardContent className="p-4">
            <Button variant="destructive" className="w-full" onClick={() => {
              logout()
            }}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('common.signOut')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
