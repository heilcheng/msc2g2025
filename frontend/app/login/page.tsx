"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, User, Eye, EyeOff, Loader, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

export default function LoginPage() {
  const { t } = useTranslation()
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'username'>('email')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, loginWithGoogle, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await login({
        identifier,
        password,
        method: loginMethod
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : t('login.errorLoginFailed'))
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    
    try {
      await loginWithGoogle()
    } catch (error) {
      setError(error instanceof Error ? error.message : t('login.errorGoogleFailed'))
    }
  }

  const getPlaceholderText = () => {
    switch (loginMethod) {
      case 'email':
        return t('login.emailPlaceholder')
      case 'phone':
        return t('login.phonePlaceholder')
      case 'username':
        return t('login.usernamePlaceholder')
      default:
        return ''
    }
  }

  const getIconForMethod = () => {
    switch (loginMethod) {
      case 'email':
        return <Mail className="w-4 h-4 text-gray-500" />
      case 'phone':
        return <Phone className="w-4 h-4 text-gray-500" />
      case 'username':
        return <User className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-md mx-auto px-6 py-6">
          {/* REACH Logo */}
          <div className="flex justify-center mb-4">
            <img src="/reach-logo.webp" alt="REACH Hong Kong" className="h-8 w-auto opacity-90" />
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {t('login.title')}
            </h1>
            <p className="text-base text-gray-500 mt-1 font-medium">
              {t('login.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Login Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">{t('login.signInWith')}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={loginMethod === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLoginMethod('email')}
                  className="flex items-center gap-2 text-xs font-medium rounded-xl"
                >
                  <Mail className="w-3 h-3" />
                  {t('login.email')}
                </Button>
                <Button
                  type="button"
                  variant={loginMethod === 'phone' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLoginMethod('phone')}
                  className="flex items-center gap-2 text-xs font-medium rounded-xl"
                >
                  <Phone className="w-3 h-3" />
                  {t('login.phone')}
                </Button>
                <Button
                  type="button"
                  variant={loginMethod === 'username' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLoginMethod('username')}
                  className="flex items-center gap-2 text-xs font-medium rounded-xl"
                >
                  <User className="w-3 h-3" />
                  {t('login.username')}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium text-gray-900">
                  {loginMethod === 'email' ? t('login.identifierLabelEmail') : loginMethod === 'phone' ? t('login.identifierLabelPhone') : t('login.identifierLabelUsername')}
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {getIconForMethod()}
                  </div>
                  <Input
                    id="identifier"
                    type={loginMethod === 'email' ? 'email' : loginMethod === 'phone' ? 'tel' : 'text'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={getPlaceholderText()}
                    className="pl-10 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                  {t('login.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    className="pr-10 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  {t('login.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white border-0 rounded-xl font-semibold py-3"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    {t('login.signingIn')}
                  </>
                ) : (
                  t('login.signIn')
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">{t('common.or')}</span>
              </div>
            </div>

            {/* Google SSO */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold py-3"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  {t('login.connecting')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('login.continueWithGoogle')}
                </>
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-gray-500">{t('login.signupPrompt')}</span>
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                {t('login.signupLink')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
