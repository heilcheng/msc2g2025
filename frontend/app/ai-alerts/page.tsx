"use client"

import { PageHeader } from "@/components/page-header"
import { AIGradingAlerts } from "@/components/ai-grading-alerts"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"

export default function AIAlertsPage() {
  const { user } = useAuth()

  if (!user) {
    redirect("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="AI Performance Insights"
        subtitle="Smart grading with personalized feedback and performance alerts"
      />
      
      <div className="container mx-auto px-4 py-8">
        <AIGradingAlerts userId={user.id} />
      </div>
    </div>
  )
}
