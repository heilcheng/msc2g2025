"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, Loader, Check } from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

type ResetStep = 'email' | 'sent'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [step, setStep] = useState<ResetStep>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Mock password reset request
    setTimeout(() => {
      setIsLoading(false)
      setStep('sent')
    }, 2000)
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
              {step === 'email' ? t('forgotPassword.titleEmail') : t('forgotPassword.titleSent')}
            </h1>
            <p className="text-base text-gray-500 mt-1 font-medium">
              {step === 'email' ? t('forgotPassword.subtitleEmail') : t('forgotPassword.subtitleSent')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-6 space-y-6">
            {step === 'email' && (
              <>
                {/* Back button */}
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="p-2 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                  <div className="text-sm text-gray-500">
                    {t('forgotPassword.backToSignIn')}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                      {t('forgotPassword.emailAddress')}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-4 h-4 text-gray-500" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('forgotPassword.emailPlaceholder')}
                        className="pl-10 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-white border-0 rounded-xl font-semibold py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        {t('forgotPassword.sending')}
                      </>
                    ) : (
                      t('forgotPassword.send')
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm">
                  <span className="text-gray-500">{t('forgotPassword.remember')}</span>
                  <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                    {t('forgotPassword.signIn')}
                  </Link>
                </div>
              </>
            )}

            {step === 'sent' && (
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600 stroke-2" />
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">{t('forgotPassword.sentTitle')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('forgotPassword.sentTo')}<span className="font-semibold">{email}</span>
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-green-50 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-green-900">{t('forgotPassword.nextSteps')}</h4>
                  <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                    <li>{t('forgotPassword.steps.check')}</li>
                    <li>{t('forgotPassword.steps.click')}</li>
                    <li>{t('forgotPassword.steps.create')}</li>
                    <li>{t('forgotPassword.steps.signin')}</li>
                  </ol>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={() => window.location.href = 'mailto:'}
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold py-3"
                  >
                    {t('forgotPassword.openEmail')}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-gray-500">{t('forgotPassword.noEmail')}</span>
                    <button
                      onClick={() => setStep('email')}
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      {t('forgotPassword.tryAgain')}
                    </button>
                  </div>

                  <div className="text-center text-sm">
                    <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                      {t('forgotPassword.backToSignIn')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
