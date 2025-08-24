"use client"

import { PageHeader } from "@/components/page-header"
import { PetGame } from "@/components/pet-game"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"

export default function PetGamePage() {
  const { user } = useAuth()

  if (!user) {
    redirect("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Pet Game"
        subtitle="Take care of your learning companion and earn rewards!"
      />
      
      <div className="container mx-auto px-4 py-8">
        <PetGame userId={user.id} />
      </div>
    </div>
  )
}
