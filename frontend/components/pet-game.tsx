"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Heart, 
  Zap, 
  Star, 
  Gift, 
  ShoppingCart, 
  Trophy, 
  Sparkles,
  Apple,
  GamepadIcon,
  Crown,
  Bone,
  Shield,
  Sword
} from "lucide-react"
import { useFontSize } from "@/app/font-size-provider"
import { useTranslation } from "react-i18next"

interface Pet {
  id: string
  user_id: string
  pet_name: string
  pet_type: string
  level: number
  experience_points: number
  health: number
  happiness: number
  last_fed: string
  created_at: string
  updated_at: string
}

interface PetItem {
  id: string
  name: string
  type: string
  rarity: string
  cost_exp: number
  effect_health: number
  effect_happiness: number
  image_url?: string
  description?: string
}

interface ExperienceLog {
  id: string
  user_id: string
  activity_type: string
  exp_gained: number
  created_at: string
}

interface PetGameProps {
  userId: string
}

// Mock data for mobile demo
const mockPet: Pet = {
  id: "1",
  user_id: "user1",
  pet_name: "Buddy",
  pet_type: "Corgi",
  level: 8,
  experience_points: 850,
  health: 85,
  happiness: 92,
  last_fed: "2024-03-22T10:30:00Z",
  created_at: "2024-03-01T00:00:00Z",
  updated_at: "2024-03-22T10:30:00Z"
}

const mockItems: PetItem[] = [
  { id: "1", name: "Premium Dog Food", type: "food", rarity: "rare", cost_exp: 50, effect_health: 25, effect_happiness: 15, description: "Delicious meal that boosts health" },
  { id: "2", name: "Squeaky Ball", type: "toy", rarity: "common", cost_exp: 30, effect_health: 5, effect_happiness: 20, description: "Fun toy that makes Corgi happy" },
  { id: "3", name: "Golden Collar", type: "accessory", rarity: "legendary", cost_exp: 200, effect_health: 10, effect_happiness: 30, description: "Legendary accessory for brave Corgis" },
  { id: "4", name: "Corgi Treats", type: "food", rarity: "common", cost_exp: 20, effect_health: 15, effect_happiness: 10, description: "Special treats for good boys" }
]

const mockRecentExp: ExperienceLog[] = [
  { id: "1", user_id: "user1", activity_type: "assignment_completed", exp_gained: 25, created_at: "2024-03-22T09:00:00Z" },
  { id: "2", user_id: "user1", activity_type: "daily_login", exp_gained: 10, created_at: "2024-03-22T08:00:00Z" },
  { id: "3", user_id: "user1", activity_type: "perfect_score", exp_gained: 50, created_at: "2024-03-21T15:30:00Z" }
]

export function PetGame({ userId }: PetGameProps) {
  const { t } = useTranslation()
  const { isLarge } = useFontSize()
  const [pet, setPet] = useState<Pet>(mockPet)
  const [items, setItems] = useState<PetItem[]>(mockItems)
  const [recentExp, setRecentExp] = useState<ExperienceLog[]>(mockRecentExp)
  const [selectedTab, setSelectedTab] = useState<'home' | 'shop' | 'stats'>('home')
  
  // Calculate level progress
  const expForCurrentLevel = pet.level * 100
  const expForNextLevel = (pet.level + 1) * 100
  const expProgress = ((pet.experience_points - expForCurrentLevel) / 100) * 100

  // Pet state based on stats
  const getPetMood = () => {
    if (pet.happiness >= 80 && pet.health >= 80) return "😊 Happy"
    if (pet.happiness >= 60 && pet.health >= 60) return "🙂 Content"
    if (pet.happiness >= 40 || pet.health >= 40) return "😐 Okay"
    return "😢 Needs Care"
  }

  const getPetStatus = () => {
    const lastFed = new Date(pet.last_fed)
    const now = new Date()
    const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceLastFed > 12) return "🍽️ Hungry"
    if (hoursSinceLastFed > 6) return "🥱 Getting Tired"
    return "✨ Energetic"
  }

  const handleFeedPet = () => {
    setPet(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 20),
      happiness: Math.min(100, prev.happiness + 15),
      last_fed: new Date().toISOString()
    }))
  }

  const handlePlayWithPet = () => {
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      health: Math.max(0, prev.health - 5) // Playing makes pet slightly tired
    }))
  }

  const handleBuyItem = (item: PetItem) => {
    if (pet.experience_points >= item.cost_exp) {
      setPet(prev => ({
        ...prev,
        experience_points: prev.experience_points - item.cost_exp,
        health: Math.min(100, prev.health + item.effect_health),
        happiness: Math.min(100, prev.happiness + item.effect_happiness)
      }))
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${isLarge ? 'text-lg' : ''}`}>
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        
        {/* Mobile-Style Tab Navigation */}
        <div className="flex bg-white rounded-2xl shadow-sm border overflow-hidden">
          <button
            onClick={() => setSelectedTab('home')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
              selectedTab === 'home' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🏠 {t('petGame.tabs.home')}
          </button>
          <button
            onClick={() => setSelectedTab('shop')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
              selectedTab === 'shop' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🛍️ {t('petGame.tabs.shop')}
          </button>
          <button
            onClick={() => setSelectedTab('stats')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
              selectedTab === 'stats' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📊 {t('petGame.tabs.stats')}
          </button>
        </div>

        {/* Home Tab - Pet Care */}
        {selectedTab === 'home' && (
          <div className="space-y-4">
            {/* Pet Display Card */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200 shadow-lg">
              <CardContent className="p-6 text-center">
                {/* Corgi Avatar - Large and Prominent */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-200 to-yellow-300 rounded-full flex items-center justify-center text-6xl border-4 border-white shadow-lg">
                    🐕
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-purple-500 text-white px-2 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Lv.{pet.level}
                    </Badge>
                  </div>
                </div>
                
                {/* Pet Info */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.pet_name}</h3>
                <p className="text-lg text-orange-600 font-medium mb-1">{pet.pet_type} Companion</p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-white rounded-full border">{getPetMood()}</span>
                  <span className="px-3 py-1 bg-white rounded-full border">{getPetStatus()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Bar */}
            <Card className="shadow-md">
              <CardContent className="p-4 space-y-3">
                {/* Health */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Heart className="w-4 h-4 text-red-500" />
                      {t('petGame.health')}
                    </span>
                    <span className="text-sm font-bold">{pet.health}/100</span>
                  </div>
                  <Progress value={pet.health} className="h-3" />
                </div>

                {/* Happiness */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      {t('petGame.happiness')}
                    </span>
                    <span className="text-sm font-bold">{pet.happiness}/100</span>
                  </div>
                  <Progress value={pet.happiness} className="h-3" />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Star className="w-4 h-4 text-blue-500" />
                      {t('petGame.experience')}
                    </span>
                    <span className="text-sm font-bold">{pet.experience_points} EXP</span>
                  </div>
                  <Progress value={expProgress} className="h-3" />
                  <p className="text-xs text-gray-500 text-center">
                    {Math.max(0, expForNextLevel - pet.experience_points)} EXP to Level {pet.level + 1}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleFeedPet}
                className="h-16 bg-green-500 hover:bg-green-600 text-white flex-col gap-1"
                disabled={pet.health >= 95}
              >
                <Apple className="w-5 h-5" />
                <span className="text-sm">{t('petGame.actions.feed')}</span>
              </Button>
              <Button 
                onClick={handlePlayWithPet}
                className="h-16 bg-blue-500 hover:bg-blue-600 text-white flex-col gap-1"
                disabled={pet.happiness >= 95}
              >
                <GamepadIcon className="w-5 h-5" />
                <span className="text-sm">{t('petGame.actions.play')}</span>
              </Button>
            </div>

            {/* Recent Activities */}
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  {t('petGame.recentActivities')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {recentExp.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-600">
                        {t(`petGame.activities.${exp.activity_type}`)}
                      </span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        +{exp.exp_gained} EXP
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shop Tab */}
        {selectedTab === 'shop' && (
          <div className="space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t('petGame.shop.title')}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {t('petGame.shop.currentExp')}: <strong>{pet.experience_points} EXP</strong>
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge 
                            variant={item.rarity === 'legendary' ? 'default' : 'secondary'}
                            className={`text-xs ${
                              item.rarity === 'legendary' ? 'bg-purple-500' :
                              item.rarity === 'rare' ? 'bg-blue-500 text-white' : 
                              'bg-gray-500 text-white'
                            }`}
                          >
                            {item.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex gap-3 text-xs">
                          {item.effect_health > 0 && (
                            <span className="flex items-center gap-1 text-red-600">
                              <Heart className="w-3 h-3" />
                              +{item.effect_health}
                            </span>
                          )}
                          {item.effect_happiness > 0 && (
                            <span className="flex items-center gap-1 text-yellow-600">
                              <Sparkles className="w-3 h-3" />
                              +{item.effect_happiness}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600 mb-2">{item.cost_exp} EXP</p>
                        <Button 
                          size="sm"
                          onClick={() => handleBuyItem(item)}
                          disabled={pet.experience_points < item.cost_exp}
                          className="h-8"
                        >
                          {t('petGame.shop.buy')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Tab */}
        {selectedTab === 'stats' && (
          <div className="space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {t('petGame.stats.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{pet.level}</p>
                    <p className="text-sm text-gray-600">{t('petGame.stats.level')}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{pet.experience_points}</p>
                    <p className="text-sm text-gray-600">{t('petGame.stats.totalExp')}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{pet.health}%</p>
                    <p className="text-sm text-gray-600">{t('petGame.stats.health')}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{pet.happiness}%</p>
                    <p className="text-sm text-gray-600">{t('petGame.stats.happiness')}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">{t('petGame.stats.achievements')}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">{t('petGame.achievements.firstLevel')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm">{t('petGame.achievements.healthy')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                      <Sword className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">{t('petGame.achievements.warrior')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom padding for mobile navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}