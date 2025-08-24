"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Calendar, 
  Trophy,
  Gift,
  Medal,
  Utensils,
  Briefcase,
  Palette,
  GraduationCap,
  Monitor,
  Dumbbell,
  Heart,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useFontSize } from "@/app/font-size-provider"
import { useTranslation } from "react-i18next"

interface TimeAuctionExperience {
  id: string
  title: string
  description: string
  category: string
  hours_required: number
  max_participants: number
  location?: string
  is_virtual: boolean
  experience_date?: string
  registration_deadline?: string
  organizer_name?: string
  organizer_credentials?: string
  image_url?: string
  is_active: boolean
  difficulty_level?: string
  created_at: string
  updated_at: string
}

interface VolunteerStats {
  total_hours: number
  spent_hours: number
  available_hours: number
  quality_score: number
  badges_count: number
  latest_badge?: any
  activity_breakdown: Record<string, { hours: number; count: number }>
}

interface ExperienceRegistration {
  id: string
  experience_id: string
  volunteer_id: string
  hours_spent: number
  registration_status: string
  completion_rating?: number
  feedback?: string
  registered_at: string
  completed_at?: string
  experience: TimeAuctionExperience
}

interface TimeAuctionProps {
  userId: string
  userRole: "volunteer" | "admin"
}

// Mock data for development
const mockExperiences: TimeAuctionExperience[] = [
  {
    id: "exp-1",
    title: "Michelin Star Cooking Class with Chef Wong",
    description: "Learn authentic Cantonese cooking techniques from a renowned Michelin-starred chef. Master the art of dim sum and traditional stir-fry dishes.",
    category: "culinary",
    hours_required: 25,
    max_participants: 8,
    location: "Central, Hong Kong",
    is_virtual: false,
    experience_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    organizer_name: "Chef Wong Kin-sang",
    organizer_credentials: "Michelin Star Chef, 20+ years experience",
    is_active: true,
    difficulty_level: "intermediate",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "exp-2", 
    title: "Entrepreneur Dinner with Tech Startup Founders",
    description: "Join successful tech entrepreneurs for an exclusive dinner discussion about startup challenges, funding, and growth strategies.",
    category: "business",
    hours_required: 15,
    max_participants: 12,
    location: "Tsim Sha Tsui, Hong Kong",
    is_virtual: false,
    experience_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    organizer_name: "Hong Kong Entrepreneurs Society",
    organizer_credentials: "Collective of 50+ successful startup founders",
    is_active: true,
    difficulty_level: "advanced",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "exp-3",
    title: "Traditional Chinese Calligraphy Workshop",
    description: "Discover the meditative art of Chinese calligraphy with master calligrapher. Learn brush techniques and create your own artwork.",
    category: "arts",
    hours_required: 10,
    max_participants: 15,
    location: "Wan Chai, Hong Kong", 
    is_virtual: false,
    experience_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
    organizer_name: "Master Li Mei-hua",
    organizer_credentials: "Traditional Art Master, 30+ years teaching",
    is_active: true,
    difficulty_level: "beginner",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "exp-4",
    title: "Virtual Fitness Training with Olympic Coach",
    description: "Get personalized fitness training from an Olympic-level coach. Improve your strength, endurance, and overall wellness.",
    category: "wellness",
    hours_required: 20,
    max_participants: 20,
    is_virtual: true,
    experience_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    organizer_name: "Coach Sarah Chen",
    organizer_credentials: "Olympic Swimming Coach, Certified Personal Trainer",
    is_active: true,
    difficulty_level: "intermediate",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockVolunteerStats: VolunteerStats = {
  total_hours: 67.5,
  spent_hours: 25,
  available_hours: 42.5,
  quality_score: 4.6,
  badges_count: 3,
  latest_badge: {
    badge_type: "mentor",
    badge_level: "gold",
    earned_at: new Date().toISOString()
  },
  activity_breakdown: {
    forum_help: { hours: 32.5, count: 45 },
    tutoring: { hours: 20, count: 8 },
    content_creation: { hours: 15, count: 12 }
  }
}

const mockRegistrations: ExperienceRegistration[] = [
  {
    id: "reg-1",
    experience_id: "exp-1",
    volunteer_id: "vol-123",
    hours_spent: 25,
    registration_status: "registered",
    registered_at: new Date().toISOString(),
    experience: mockExperiences[0]
  }
]

export function TimeAuction({ userId, userRole }: TimeAuctionProps) {
  const { t } = useTranslation()
  const { isLarge } = useFontSize()
  const [experiences, setExperiences] = useState<TimeAuctionExperience[]>(mockExperiences)
  const [volunteerStats, setVolunteerStats] = useState<VolunteerStats>(mockVolunteerStats)
  const [registrations, setRegistrations] = useState<ExperienceRegistration[]>(mockRegistrations)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      culinary: Utensils,
      business: Briefcase,
      arts: Palette,
      education: GraduationCap,
      technology: Monitor,
      sports: Dumbbell,
      wellness: Heart
    }
    const Icon = icons[category] || Gift
    return <Icon className="w-5 h-5" />
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      culinary: "bg-orange-100 text-orange-700 border-orange-200",
      business: "bg-blue-100 text-blue-700 border-blue-200",
      arts: "bg-purple-100 text-purple-700 border-purple-200",
      education: "bg-green-100 text-green-700 border-green-200",
      technology: "bg-gray-100 text-gray-700 border-gray-200",
      sports: "bg-red-100 text-red-700 border-red-200",
      wellness: "bg-pink-100 text-pink-700 border-pink-200"
    }
    return colors[category] || colors.arts
  }

  const getDifficultyColor = (difficulty?: string): string => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-yellow-100 text-yellow-700",
      advanced: "bg-red-100 text-red-700"
    }
    return colors[difficulty || "beginner"] || colors.beginner
  }

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      registered: "bg-blue-100 text-blue-700",
      confirmed: "bg-green-100 text-green-700",
      completed: "bg-purple-100 text-purple-700",
      cancelled: "bg-gray-100 text-gray-700"
    }
    return colors[status] || colors.registered
  }

  const filteredExperiences = selectedCategory === "all" 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory)

  const handleRegister = async (experienceId: string) => {
    setLoading(true)
    try {
      // In real implementation, call API
      // await fetch(`/api/time_auction/register`, { method: 'POST', body: JSON.stringify({ volunteer_id: userId, experience_id: experienceId }) })
      
      // Mock behavior
      const experience = experiences.find(exp => exp.id === experienceId)
      if (experience && volunteerStats.available_hours >= experience.hours_required) {
        const newRegistration: ExperienceRegistration = {
          id: `reg-${Date.now()}`,
          experience_id: experienceId,
          volunteer_id: userId,
          hours_spent: experience.hours_required,
          registration_status: "registered",
          registered_at: new Date().toISOString(),
          experience
        }
        
        setRegistrations(prev => [...prev, newRegistration])
        setVolunteerStats(prev => ({
          ...prev,
          available_hours: prev.available_hours - experience.hours_required
        }))
      }
    } catch (error) {
      console.error('Error registering for experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const canRegister = (experience: TimeAuctionExperience): boolean => {
    if (!experience.is_active) return false
    if (experience.registration_deadline && new Date() > new Date(experience.registration_deadline)) return false
    if (volunteerStats.available_hours < experience.hours_required) return false
    if (registrations.some(reg => reg.experience_id === experience.id)) return false
    return true
  }

  const categories = ["all", ...Array.from(new Set(experiences.map(exp => exp.category)))]

  return (
    <div className="w-full space-y-6">
      {/* Volunteer Stats Dashboard */}
      {userRole === "volunteer" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              My Volunteer Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {volunteerStats.available_hours}
                </div>
                <div className="text-sm text-muted-foreground">Available Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {volunteerStats.total_hours}
                </div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {volunteerStats.quality_score.toFixed(1)}⭐
                </div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {volunteerStats.badges_count}
                </div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </div>
            </div>
            
            {/* Latest Badge */}
            {volunteerStats.latest_badge && (
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Medal className="w-8 h-8 text-yellow-500" />
                  <div>
                    <h4 className="font-semibold">Latest Achievement</h4>
                    <p className="text-sm text-muted-foreground">
                      {volunteerStats.latest_badge.badge_level.charAt(0).toUpperCase() + 
                       volunteerStats.latest_badge.badge_level.slice(1)} {" "}
                      {volunteerStats.latest_badge.badge_type.charAt(0).toUpperCase() + 
                       volunteerStats.latest_badge.badge_type.slice(1)} Badge
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="experiences" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="experiences">Available Experiences</TabsTrigger>
          <TabsTrigger value="registrations">My Registrations</TabsTrigger>
        </TabsList>
        
        {/* Available Experiences */}
        <TabsContent value="experiences" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                {category !== "all" && getCategoryIcon(category)}
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Experiences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(experience.category)}
                      <Badge className={getCategoryColor(experience.category)}>
                        {experience.category}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getDifficultyColor(experience.difficulty_level)}>
                        {experience.difficulty_level || "beginner"}
                      </Badge>
                      {experience.is_virtual && (
                        <Badge variant="outline" className="text-xs">
                          <Monitor className="w-3 h-3 mr-1" />
                          Virtual
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className={`${isLarge ? 'text-xl' : 'text-lg'}`}>
                    {experience.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {experience.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{experience.hours_required} volunteer hours required</span>
                    </div>
                    
                    {experience.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>Max {experience.max_participants} participants</span>
                    </div>
                    
                    {experience.experience_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span>{new Date(experience.experience_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {experience.organizer_name && (
                    <div className="bg-muted rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-1">Organizer</h4>
                      <p className="text-sm">{experience.organizer_name}</p>
                      {experience.organizer_credentials && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {experience.organizer_credentials}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      {experience.registration_deadline && (
                        <>
                          Deadline: {new Date(experience.registration_deadline).toLocaleDateString()}
                        </>
                      )}
                    </div>
                    
                    {userRole === "volunteer" && (
                      <Button
                        onClick={() => handleRegister(experience.id)}
                        disabled={!canRegister(experience) || loading}
                        size="sm"
                      >
                        {registrations.some(reg => reg.experience_id === experience.id) 
                          ? "Already Registered" 
                          : volunteerStats.available_hours < experience.hours_required
                          ? "Not Enough Hours"
                          : "Register"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* My Registrations */}
        <TabsContent value="registrations" className="space-y-4">
          {registrations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Registrations Yet</h3>
                <p className="text-muted-foreground">
                  Browse available experiences and register with your volunteer hours!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <Card key={registration.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {registration.experience.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(registration.experience.category)}>
                            {registration.experience.category}
                          </Badge>
                          <Badge className={getStatusColor(registration.registration_status)}>
                            {registration.registration_status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {registration.hours_spent} hours
                        </div>
                        <div className="text-sm text-muted-foreground">Investment</div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {registration.experience.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {registration.experience.experience_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{new Date(registration.experience.experience_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {registration.experience.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span>{registration.experience.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {registration.registration_status === "completed" && registration.completion_rating && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">Experience Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">Rating: {registration.completion_rating}/5</span>
                        </div>
                        {registration.feedback && (
                          <p className="text-sm text-green-700 mt-2">
                            "{registration.feedback}"
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-4">
                      Registered: {new Date(registration.registered_at).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
