"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  Users, 
  Gift, 
  MessageCircle, 
  Star, 
  Heart,
  Award,
  BookOpen,
  Headphones,
  Camera,
  Coffee,
  Gamepad2,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronRight
} from "lucide-react"
import TopNavbar from "@/components/top-navbar"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"

// Mock volunteer stats
const volunteerStats = {
  totalHours: 128,
  familiesHelped: 23,
  nextRewardProgress: 85, // percentage to next reward
  hoursToNextReward: 2
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'high': return 'bg-red-100 text-red-700 border-red-200'
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'low': return 'bg-green-100 text-green-700 border-green-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export default function VolunteerDashboard() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [selectedFamily, setSelectedFamily] = useState<number | null>(null)
  const [showRewards, setShowRewards] = useState(false)

  const canAfford = (cost: number) => volunteerStats.totalHours >= cost

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return t('volunteer.dashboard.aiRecommendations.urgency.high')
      case 'medium': return t('volunteer.dashboard.aiRecommendations.urgency.medium')
      case 'low': return t('volunteer.dashboard.aiRecommendations.urgency.low')
      default: return t('volunteer.dashboard.aiRecommendations.urgency.medium')
    }
  }

  // Mock AI-recommended families with i18n
  const recommendedFamilies = [
    {
      id: 1,
      familyName: t('volunteer.dashboard.families.emma'),
      problem: t('volunteer.dashboard.families.problems.bdConfusion'),
      aiReason: t('volunteer.dashboard.families.aiReasons.phonicsExperience'),
      tags: [t('volunteer.dashboard.families.tags.pronunciationRecognition'), t('volunteer.dashboard.families.tags.readingBasics')],
      urgency: "medium",
      lastActivity: t('volunteer.dashboard.aiRecommendations.lastActivity.daysAgo', { count: 2 })
    },
    {
      id: 2,
      familyName: t('volunteer.dashboard.families.lucas'), 
      problem: t('volunteer.dashboard.families.problems.homeEnvironment'),
      aiReason: t('volunteer.dashboard.families.aiReasons.similarSuccess'),
      tags: [t('volunteer.dashboard.families.tags.homeEducation'), t('volunteer.dashboard.families.tags.learningEnvironment')],
      urgency: "high",
      lastActivity: t('volunteer.dashboard.aiRecommendations.lastActivity.justNow')
    },
    {
      id: 3,
      familyName: t('volunteer.dashboard.families.sophie'),
      problem: t('volunteer.dashboard.families.problems.motivation'),
      aiReason: t('volunteer.dashboard.families.aiReasons.motivationSkills'),
      tags: [t('volunteer.dashboard.families.tags.learningMotivation'), t('volunteer.dashboard.families.tags.interestCultivation')],
      urgency: "low", 
      lastActivity: t('volunteer.dashboard.aiRecommendations.lastActivity.dayAgo', { count: 1 })
    }
  ]

  // Mock rewards data with i18n
  const availableRewards = [
    {
      id: 1,
      title: t('volunteer.dashboard.rewards.items.artJamming.title'),
      subtitle: t('volunteer.dashboard.rewards.items.artJamming.subtitle'),
      description: t('volunteer.dashboard.rewards.items.artJamming.description'),
      image: "🎨",
      cost: 6,
      status: "available",
      slotsLeft: 3,
      location: t('volunteer.dashboard.rewards.items.artJamming.location')
    },
    {
      id: 2,
      title: t('volunteer.dashboard.rewards.items.coffeeWorkshop.title'),
      subtitle: t('volunteer.dashboard.rewards.items.coffeeWorkshop.subtitle'), 
      description: t('volunteer.dashboard.rewards.items.coffeeWorkshop.description'),
      image: "☕",
      cost: 8,
      status: "full",
      slotsLeft: 0,
      location: t('volunteer.dashboard.rewards.items.coffeeWorkshop.location')
    },
    {
      id: 3,
      title: t('volunteer.dashboard.rewards.items.hiking.title'),
      subtitle: t('volunteer.dashboard.rewards.items.hiking.subtitle'),
      description: t('volunteer.dashboard.rewards.items.hiking.description'),
      image: "🏔️",
      cost: 4,
      status: "available",
      slotsLeft: 8,
      location: t('volunteer.dashboard.rewards.items.hiking.location')
    },
    {
      id: 4,
      title: t('volunteer.dashboard.rewards.items.photography.title'),
      subtitle: t('volunteer.dashboard.rewards.items.photography.subtitle'),
      description: t('volunteer.dashboard.rewards.items.photography.description'),
      image: "📸",
      cost: 12,
      status: "available", 
      slotsLeft: 5,
      location: t('volunteer.dashboard.rewards.items.photography.location')
    },
    {
      id: 5,
      title: t('volunteer.dashboard.rewards.items.boardGame.title'),
      subtitle: t('volunteer.dashboard.rewards.items.boardGame.subtitle'),
      description: t('volunteer.dashboard.rewards.items.boardGame.description'),
      image: "🎲",
      cost: 10,
      status: "available",
      slotsLeft: 2,
      location: t('volunteer.dashboard.rewards.items.boardGame.location')
    },
    {
      id: 6,
      title: t('volunteer.dashboard.rewards.items.dinner.title'),
      subtitle: t('volunteer.dashboard.rewards.items.dinner.subtitle'),
      description: t('volunteer.dashboard.rewards.items.dinner.description'),
      image: "🍽️",
      cost: 15,
      status: "full",
      slotsLeft: 0,
      location: t('volunteer.dashboard.rewards.items.dinner.location')
    }
  ]

  return (
    <div className="min-h-screen bg-background-light font-sf-pro">
      <TopNavbar />
      
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Warm Greeting - Moved to Top */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">
            {t('volunteer.dashboard.greeting', { name: 'Sarah Chen' })}
          </h1>
          <p className="text-text-secondary text-base">
            {t('volunteer.dashboard.thankYou')}
          </p>
        </div>

        {/* Time Auction Premium Entry Point */}
        <Card 
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-xl border-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group overflow-hidden"
          onClick={() => setShowRewards(true)}
        >
          <CardContent className="p-0 relative">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-600/10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full transform translate-x-16 -translate-y-16"></div>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img src="/og-ta-logo.png" alt="Time Auction" className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('volunteer.dashboard.timeAuction.title')}
                  </h3>
                  <p className="text-white/90 text-sm font-medium">
                    {t('volunteer.dashboard.timeAuction.subtitle')}
                  </p>
                </div>
                <div className="text-white group-hover:translate-x-1 transition-transform duration-300">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
              
              {/* Action Bar */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-white/80 text-sm">
                    {t('volunteer.dashboard.timeAuction.availableHours')}<span className="font-bold text-white">{volunteerStats.totalHours}</span>
                  </div>
                  <div className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {t('volunteer.dashboard.timeAuction.redeemNow')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improved Bento Stats Card */}
        <Card className="bg-white rounded-3xl shadow-lg border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Total Hours - Left Section */}
              <div className="text-center space-y-4">
                <div className="space-y-1">
                  <h3 className="text-text-primary text-lg font-bold">{t('volunteer.dashboard.stats.yourContribution')}</h3>
                  <p className="text-text-secondary text-sm">{t('volunteer.dashboard.stats.monthlyNew', { hours: 24 })}</p>
                </div>
                <div className="space-y-1">
                  <h2 className="text-5xl font-bold text-text-primary leading-none">
                    {volunteerStats.totalHours}
                  </h2>
                  <p className="text-text-secondary font-medium text-base">{t('volunteer.dashboard.stats.totalServiceHours')}</p>
                </div>
              </div>
              
              {/* Vertical Divider and Right Section */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                <div className="pl-8 text-center space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-text-primary text-lg font-bold">{t('volunteer.dashboard.stats.familiesHelped')}</h3>
                    <p className="text-blue-500 text-sm font-medium">{t('volunteer.dashboard.stats.weeklyNew', { count: 3 })}</p>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-5xl font-bold text-text-primary leading-none">
                      {volunteerStats.familiesHelped}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Part 2: AI-Recommended Families */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary">
              {t('volunteer.dashboard.aiRecommendations.title')}
            </h2>
            <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20">
              {t('volunteer.dashboard.aiRecommendations.suggestions', { count: recommendedFamilies.length })}
            </Badge>
          </div>

          <div className="space-y-3">
            {recommendedFamilies.map((family) => (
              <Card 
                key={family.id} 
                className="bg-white rounded-3xl shadow-md border-0 transition-all duration-200 hover:shadow-lg"
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-text-primary text-lg">
                          {family.familyName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(family.urgency)}`}>
                            {getUrgencyLabel(family.urgency)}
                          </Badge>
                          <span className="text-xs text-text-secondary">
                            {family.lastActivity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <div className="space-y-2">
                      <p className="text-text-primary text-sm leading-relaxed">
                        {family.problem}
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-primary-green/5 rounded-2xl">
                        <Star className="w-4 h-4 text-primary-green stroke-2 mt-0.5 flex-shrink-0" />
                        <p className="text-primary-green text-xs font-medium">
                          {t('volunteer.dashboard.aiRecommendations.reason', { reason: family.aiReason })}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {family.tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          className="bg-gray-100 text-gray-700 border-gray-200 text-xs px-3 py-1 rounded-full"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full bg-primary-green hover:bg-primary-green/90 text-white border-0 rounded-2xl font-bold shadow-md transition-all duration-300 hover:scale-105 py-3">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t('volunteer.dashboard.aiRecommendations.sendMessage')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rewards Modal/Overlay */}
        {showRewards && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-50 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-50 p-6 border-b border-gray-200 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/og-ta-logo.png" alt="Time Auction" className="w-8 h-8" />
                    <div>
                      <h2 className="text-xl font-bold text-text-primary">
                        {t('volunteer.dashboard.rewards.title')}
                      </h2>
                      <p className="text-text-secondary text-sm">
                        {t('volunteer.dashboard.rewards.subtitle')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowRewards(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 p-0"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="mt-4 inline-flex items-center gap-2 bg-primary-green/10 px-4 py-2 rounded-2xl">
                  <Award className="w-5 h-5 text-primary-green" />
                  <span className="text-primary-green font-bold">
                    {t('volunteer.dashboard.rewards.currentHours', { hours: volunteerStats.totalHours })}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4">
                {availableRewards.map((reward) => {
                  const affordable = canAfford(reward.cost)
                  const isFull = reward.status === 'full'
                  
                  return (
                    <Card 
                      key={reward.id}
                      className={`bg-white rounded-3xl shadow-md border-0 transition-all duration-200 ${
                        isFull ? 'opacity-60' : 'hover:shadow-lg'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Large Image/Icon at Top */}
                          <div className="w-full h-20 bg-gradient-to-br from-primary-green/10 to-secondary-green/10 rounded-2xl flex items-center justify-center text-3xl">
                            {reward.image}
                          </div>

                          {/* Content Below */}
                          <div className="space-y-2">
                            <h3 className="font-bold text-text-primary text-sm leading-tight">
                              {reward.title}
                            </h3>
                            <p className="text-text-secondary text-xs">
                              {reward.subtitle}
                            </p>
                            <p className="text-text-secondary text-xs leading-relaxed">
                              {reward.description}
                            </p>
                            
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-text-secondary" />
                              <span className="text-xs text-text-secondary">
                                {reward.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20 text-xs px-2 py-1">
                                {reward.cost} {t('volunteer.dashboard.stats.totalServiceHours').split('總')[1]}
                              </Badge>
                              {isFull ? (
                                <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1">
                                  {t('volunteer.dashboard.rewards.status.full')}
                                </Badge>
                              ) : (
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1">
                                  {t('volunteer.dashboard.rewards.status.spotsLeft', { count: reward.slotsLeft })}
                                </Badge>
                              )}
                            </div>

                            {/* Redeem Button */}
                            <Button 
                              disabled={!affordable || isFull}
                              className={`w-full text-xs font-medium rounded-xl py-2 transition-all duration-300 ${
                                affordable && !isFull
                                  ? 'bg-primary-green hover:bg-primary-green/90 text-white hover:scale-105'
                                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {isFull ? (
                                t('volunteer.dashboard.rewards.status.full')
                              ) : affordable ? (
                                t('volunteer.dashboard.rewards.status.redeem')
                              ) : (
                                t('volunteer.dashboard.rewards.status.needMore', { hours: reward.cost })
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}

