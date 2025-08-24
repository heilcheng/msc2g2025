"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, TicketCheck, User, Eye, EyeOff, Loader, ArrowLeft, Check, AlertCircle, Users, Heart } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

type SignUpStep = 'method' | 'role' | 'details' | 'complete'
type SignUpMethod = 'email' | 'phone' | 'manual'
type UserRole = 'parent' | 'volunteer'

export default function SignUpPage() {
  const { t } = useTranslation()
  const [step, setStep] = useState<SignUpStep>('method')
  const [signUpMethod, setSignUpMethod] = useState<SignUpMethod>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [studentName, setStudentName] = useState('')
  const [parentName, setParentName] = useState('')
  const [school, setSchool] = useState('')
  const [role, setRole] = useState<UserRole>('parent')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const { signup, loginWithGoogle, isLoading } = useAuth()

  const handleMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // For email and phone, validate the input
    if (signUpMethod === 'email' && !email) {
      setError(t('signup.errorRequired'))
      return
    }
    if (signUpMethod === 'phone' && !phone) {
      setError(t('signup.errorRequired'))
      return
    }
    
    // Move to role selection step
    setStep('role')
  }

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Move to details step
    setStep('details')
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation - adjust based on role
    const requiredFields = [username, password]
    if (role === 'parent') {
      requiredFields.push(studentName, parentName, school)
    }
    
    if (requiredFields.some(field => !field)) {
      setError(t('signup.errorAllFieldsRequired'))
      return
    }
    
    if (password !== confirmPassword) {
      setError(t('signup.errorPasswordMismatch'))
      return
    }
    
    if (password.length < 6) {
      setError(t('signup.errorPasswordShort'))
      return
    }
    
    try {
      await signup({
        method: signUpMethod,
        email: signUpMethod === 'email' ? email : undefined,
        phone: signUpMethod === 'phone' ? phone : undefined,
        username,
        password,
        studentName: role === 'parent' ? studentName : undefined,
        parentName: role === 'parent' ? parentName : undefined,
        school: role === 'parent' ? school : undefined,
        role
      })
      setStep('complete')
    } catch (error) {
      setError(error instanceof Error ? error.message : t('signup.errorSignupFailed'))
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    
    try {
      await loginWithGoogle()
      // Auth provider will handle redirect to dashboard
    } catch (error) {
      setError(error instanceof Error ? error.message : t('signup.errorGoogleFailed'))
    }
  }

  const getMethodValue = () => {
    switch (signUpMethod) {
      case 'email':
        return email
      case 'phone':
        return phone
      case 'manual':
        return 'manual-verification'
      default:
        return ''
    }
  }

  const setMethodValue = (value: string) => {
    switch (signUpMethod) {
      case 'email':
        setEmail(value)
        break
      case 'phone':
        setPhone(value)
        break
      case 'manual':
        // No input needed for manual verification
        break
    }
  }

  const getPlaceholderText = () => {
    switch (signUpMethod) {
      case 'email':
        return t('signup.emailAddress')
      case 'phone':
        return t('signup.phoneNumber')
      case 'manual':
        return t('signup.manualVerification')
      default:
        return ''
    }
  }

  const getIconForMethod = () => {
    switch (signUpMethod) {
      case 'email':
        return <Mail className="w-4 h-4 text-gray-500" />
      case 'phone':
        return <Phone className="w-4 h-4 text-gray-500" />
      case 'manual':
        return <TicketCheck className="w-4 h-4 text-gray-500" />
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
              {step === 'method' && t('signup.titles.method')}
              {step === 'role' && t('signup.selectRole')}
              {step === 'details' && t('signup.titles.details')}
              {step === 'complete' && t('signup.titles.complete')}
            </h1>
            <p className="text-base text-gray-500 mt-1 font-medium">
              {step === 'method' && t('signup.subtitles.method')}
              {step === 'role' && 'Choose whether you are a parent or volunteer'}
              {step === 'details' && t('signup.subtitles.details')}
              {step === 'complete' && t('signup.subtitles.complete')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Step 1: Method Selection */}
            {step === 'method' && (
              <>
                {/* Sign Up Method Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">{t('signup.signUpWith')}</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      type="button"
                      variant={signUpMethod === 'email' ? 'default' : 'outline'}
                      onClick={() => setSignUpMethod('email')}
                      className="flex items-center gap-3 text-sm font-medium rounded-xl py-3 justify-start"
                    >
                      <Mail className="w-4 h-4" />
                      {t('signup.emailAddress')}
                    </Button>
                    <Button
                      type="button"
                      variant={signUpMethod === 'phone' ? 'default' : 'outline'}
                      onClick={() => setSignUpMethod('phone')}
                      className="flex items-center gap-3 text-sm font-medium rounded-xl py-3 justify-start"
                    >
                      <Phone className="w-4 h-4" />
                      {t('signup.phoneNumber')}
                    </Button>
                    <Button
                      type="button"
                      variant={signUpMethod === 'manual' ? 'default' : 'outline'}
                      onClick={() => setSignUpMethod('manual')}
                      className="flex items-center gap-3 text-sm font-medium rounded-xl py-3 justify-start"
                    >
                      <TicketCheck className="w-4 h-4" />
                      {t('signup.manualVerification')}
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

                {/* Method Input - Only show for email and phone */}
                {signUpMethod !== 'manual' && (
                  <form onSubmit={handleMethodSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="method-input" className="text-sm font-medium text-gray-900">
                        {signUpMethod === 'email' ? t('signup.emailAddress') : t('signup.phoneNumber')}
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          {getIconForMethod()}
                        </div>
                        <Input
                          id="method-input"
                          type={signUpMethod === 'email' ? 'email' : 'tel'}
                          value={getMethodValue()}
                          onChange={(e) => setMethodValue(e.target.value)}
                          placeholder={getPlaceholderText()}
                          className="pl-10 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-xl font-semibold py-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          {t('signup.verifying')}
                        </>
                      ) : (
                        t('signup.continue')
                      )}
                    </Button>
                  </form>
                )}

                {/* Manual verification - direct continue */}
                {signUpMethod === 'manual' && (
                  <Button
                    onClick={() => setStep('role')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-xl font-semibold py-3"
                  >
                    {t('signup.continue')}
                  </Button>
                )}

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
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      {t('signup.connecting')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {t('signup.continueWithGoogle')}
                    </>
                  )}
                </Button>

                {/* Sign In Link */}
                <div className="text-center text-sm">
                  <span className="text-gray-500">{t('signup.alreadyHave')}</span>
                  <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                    {t('signup.signIn')}
                  </Link>
                </div>
              </>
            )}

            {/* Step 2: Role Selection */}
            {step === 'role' && (
              <>
                {/* Back button */}
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('method')}
                    className="p-2 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-sm text-gray-500">
                    {signUpMethod === 'email' ? email : 
                     signUpMethod === 'phone' ? phone : t('signup.manualVerification')}
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

                <form onSubmit={handleRoleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-900">{t('signup.selectRole')}</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        type="button"
                        variant={role === 'parent' ? 'default' : 'outline'}
                        onClick={() => setRole('parent')}
                        className="flex items-start gap-4 text-left font-medium rounded-xl py-4 px-4 h-auto"
                      >
                        <Users className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <div className="font-semibold">{t('signup.roleParent')}</div>
                          <div className="text-sm opacity-80">{t('signup.roleParentDescription')}</div>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant={role === 'volunteer' ? 'default' : 'outline'}
                        onClick={() => setRole('volunteer')}
                        className="flex items-start gap-4 text-left font-medium rounded-xl py-4 px-4 h-auto"
                      >
                        <Heart className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <div className="font-semibold">{t('signup.roleVolunteer')}</div>
                          <div className="text-sm opacity-80">{t('signup.roleVolunteerDescription')}</div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-xl font-semibold py-3"
                  >
                    {t('signup.continue')}
                  </Button>
                </form>
              </>
            )}

            {/* Step 3: Account Details */}
            {step === 'details' && (
              <>
                {/* Back button */}
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('role')}
                    className="p-2 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-sm text-gray-500">
                    {role === 'parent' ? t('signup.roleParent') : t('signup.roleVolunteer')}
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

                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-900">
                      {t('signup.username')}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={t('signup.usernamePlaceholder')}
                        className="pl-10 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                      {t('signup.password')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('signup.createPassword')}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-900">
                      {t('signup.confirmPassword')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('signup.confirmYourPassword')}
                        className="pr-10 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Conditional fields based on role */}
                  {role === 'parent' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="student-name" className="text-sm font-medium text-gray-900">
                          {t('signup.studentName')}
                        </Label>
                        <Input
                          id="student-name"
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder={t('signup.studentNamePlaceholder')}
                          className="rounded-xl"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parent-name" className="text-sm font-medium text-gray-900">
                          {t('signup.parentName')}
                        </Label>
                        <Input
                          id="parent-name"
                          type="text"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          placeholder={t('signup.parentNamePlaceholder')}
                          className="rounded-xl"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school" className="text-sm font-medium text-gray-900">
                          {t('signup.school')}
                        </Label>
                        <Input
                          id="school"
                          type="text"
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                          placeholder={t('signup.schoolPlaceholder')}
                          className="rounded-xl"
                          required
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || password !== confirmPassword}
                    className="w-full bg-primary hover:bg-primary/90 text-white border-0 rounded-xl font-semibold py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        {t('signup.creatingAccount')}
                      </>
                    ) : (
                      t('signup.createAccount')
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* Step 4: Success */}
            {step === 'complete' && (
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600 stroke-2" />
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">{t('signup.successAccountCreated')}</h3>
                  <p className="text-sm text-gray-500">{t('signup.successWelcome')}</p>
                </div>

                {/* Account Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">{t('signup.labelUsername')}</span>
                    <span className="font-semibold text-gray-900">{username}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">{t('signup.labelContact')}</span>
                    <span className="font-semibold text-gray-900">
                      {signUpMethod === 'email' ? email : 
                       signUpMethod === 'phone' ? phone : t('signup.viaInvitation')}
                    </span>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-primary hover:bg-primary/90 text-white border-0 rounded-xl font-semibold py-3"
                >
                  {t('signup.continueToDashboard')}
                </Button>

                {/* Sign In Link */}
                <div className="text-center text-sm">
                  <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                    {t('signup.signInExisting')}
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
