"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Play, CheckCircle2, Users, Check, Edit3, Volume2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useFontSize } from "@/app/font-size-provider"
import { useTranslation } from "react-i18next"
import TopNavbar from "@/components/top-navbar"

// Weekly tasks data - will be dynamically translated and sorted by priority
const weeklyTasksData = [
  {
    id: 1,
    titleKey: "home.weeklyTasks.0.title",
    subtitleKey: "home.weeklyTasks.0.subtitle",
    completed: false,
    isPrimary: false,
    priority: 2, // Normal priority
    urgency: 'normal',
    dueDate: null,
    icon: Upload,
  },
  {
    id: 2,
    titleKey: "home.weeklyTasks.1.title",
    subtitleKey: "home.weeklyTasks.1.subtitle",
    completed: true,
    isPrimary: false,
    priority: 3, // Low priority (completed)
    urgency: 'normal',
    dueDate: null,
    icon: Play,
  },
  {
    id: 3,
    titleKey: "home.weeklyTasks.2.title",
    subtitleKey: "home.weeklyTasks.2.subtitle",
    completed: false,
    isPrimary: true,
    priority: 1, // Highest priority - urgent task due today
    urgency: 'urgent',
    dueDate: 'today',
    icon: CheckCircle2,
  },
  {
    id: 4,
    titleKey: "home.weeklyTasks.3.title",
    subtitleKey: "home.weeklyTasks.3.subtitle",
    completed: false,
    isPrimary: false,
    priority: 4, // Future task
    urgency: 'normal',
    dueDate: 'tomorrow',
    icon: Users,
  },
]



// AI Recommendations grouped by skill
const aiRecommendations = [
  {
    skill: "sightWords",
    skillProgress: 60,
    title: "Practice Sight Words",
    description: "Play \"find the word\" game in today's storybook.",
    timeNeeded: "5 min",
    priority: "high"
  },
  {
    skill: "alphabet", 
    skillProgress: 85,
    title: "Letter Practice",
    description: "Trace lowercase letters \"b\" and \"d\" for clarity.",
    timeNeeded: "5 min",
    priority: "medium"
  },
  {
    skill: "phonemicAwareness",
    skillProgress: 79, 
    title: "Sound Matching",
    description: "Try sound-blending exercise in the student app.",
    timeNeeded: "10 min",
    priority: "low"
  },
]

export default function HomePage() {
  const { t } = useTranslation('common')
  const { isLarge } = useFontSize()
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const { user } = useAuth()

  // Generate translated weekly tasks and sort by priority
  const weeklyTasks = weeklyTasksData
    .map(task => ({
      id: task.id,
      title: t(task.titleKey),
      subtitle: t(task.subtitleKey),
      completed: task.completed,
      isPrimary: task.isPrimary,
      priority: task.priority,
      urgency: task.urgency,
      dueDate: task.dueDate,
      icon: task.icon,
    }))
    .sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed && !b.completed) return 1
      if (!a.completed && b.completed) return -1
      
      // Among uncompleted tasks, sort by priority (1 = highest priority)
      if (!a.completed && !b.completed) {
        return a.priority - b.priority
      }
      
      // Keep original order for completed tasks
      return 0
    })



  const handleUploadClick = () => {
    setUploadModalOpen(true)
    setUploadState('uploading')
    
    // Simulate file upload
    setTimeout(() => {
      setUploadedImage('/worksheet-example.jpg') // Mock uploaded image
      setUploadState('processing')
      
      // Simulate OCR processing
      setTimeout(() => {
        setUploadState('complete')
      }, 3000)
    }, 1500)
  }

  const closeModal = () => {
    setUploadModalOpen(false)
    setUploadState('idle')
    setUploadedImage(null)
  }

  // Find current task
  const currentTask = weeklyTasks.find(task => !task.completed && task.isPrimary) || weeklyTasks.find(task => !task.completed)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sf-pro">
      {/* Header */}
      <TopNavbar />

      <div className="max-w-md mx-auto px-6 py-6 space-y-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
        {/* Today's #1 Mission - Hero Section */}
        <div className="space-y-4">
          <Card className="bg-background-card border border-border-soft rounded-3xl shadow-ios-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-green/10 rounded-3xl flex items-center justify-center flex-shrink-0 border border-primary-green/20">
                  <Edit3 className="w-8 h-8 text-primary-green stroke-[3]" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">
                      🎯 {t('home.challenge.title')}
                    </h1>
                    <p className="text-gray-700 text-sm font-semibold mt-2 leading-relaxed">
                      {t('home.aiInsight.sentence', { minutes: 5 }).replace('<bold>b</bold>', 'b').replace('<bold>d</bold>', 'd')}
                    </p>
                  </div>
                  <Button className="bg-primary-green text-white hover:bg-primary-green/90 border-0 rounded-full font-extrabold shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-6 py-3">
                    <Play className="w-5 h-5 mr-2 stroke-2" />
                    {t('progress.ai.startPractice')}
                  </Button>
                </div>
              </div>
              {/* Progress indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-gray-700 text-sm">
                  <span className="font-bold">{t('progress.skills.alphabet.name')} {t('home.progress.recognition')}</span>
                  <span className="font-black" style={{color: '#58CC02'}}>85%</span>
                </div>
                <div className="mt-2 h-3 bg-gray-200 rounded-full">
                  <div className="h-3 rounded-full w-[85%] transition-all duration-500 shadow-sm" style={{backgroundColor: '#58CC02'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Path - Visual Journey */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary text-center tracking-tight mb-2">
            {t('home.thisWeek')} {t('home.learningPath')}
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{backgroundColor: '#58CC02'}}></div>
          
          <Card className="bg-background-card rounded-3xl shadow-ios p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-green/5 to-secondary-green/5"></div>
            <div className="relative space-y-6">
              {weeklyTasks.map((task, index) => {
                const isCompleted = task.completed
                const isCurrentTask = !isCompleted && task.isPrimary
                const isUrgent = task.urgency === 'urgent' && !isCompleted
                
                return (
                  <div key={task.id} className="relative">
                    {/* Connecting line */}
                    {index < weeklyTasks.length - 1 && (
                      <div className="absolute left-7 top-14 w-0.5 h-8 bg-gray-300"></div>
                    )}
                    
                    <div className={`flex items-center gap-4 ${isCurrentTask ? 'transform scale-105' : ''} transition-all duration-300`}>
                      {/* Node */}
                      <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        isCompleted 
                          ? 'bg-primary-green shadow-lg border-primary-green' 
                          : isCurrentTask 
                            ? isUrgent 
                              ? 'bg-red-500 shadow-lg border-red-500 animate-pulse' 
                              : 'bg-secondary-green shadow-lg animate-pulse border-secondary-green'
                            : isUrgent
                              ? 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700'
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-7 h-7 text-white stroke-[3]" />
                        ) : (
                          <task.icon className={`w-7 h-7 stroke-[2.5] ${
                            isCurrentTask ? 'text-white' : isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
                          }`} />
                        )}
                        
                        {/* Pulsing ring for current task */}
                        {isCurrentTask && (
                          <div className={`absolute -inset-1 rounded-full border-3 animate-ping ${isUrgent ? 'border-red-400/60' : 'border-secondary-green/40'}`}></div>
                        )}
                        
                        {/* Subtle red outline for urgent non-current tasks */}
                        {isUrgent && !isCurrentTask && (
                          <div className="absolute -inset-0.5 rounded-full border border-red-300 dark:border-red-600"></div>
                        )}
                      </div>
                      
                      {/* Task Content */}
                      <div className={`flex-1 ${isCurrentTask ? 'bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft' : ''}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-extrabold ${isCompleted ? 'line-through text-gray-400' : isCurrentTask ? 'text-gray-900 dark:text-white' : isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'} ${isLarge ? 'text-lg' : 'text-base'} leading-tight`}>
                              {task.title}
                            </h3>
                            <p className={`text-sm mt-1 font-medium ${isCompleted ? 'line-through text-gray-400' : isCurrentTask ? 'text-gray-700 dark:text-gray-200' : isUrgent ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'} leading-relaxed`}>
                              {task.subtitle}
                            </p>
                          </div>
                          
                          {/* Action Button for current task */}
                          {isCurrentTask && task.isPrimary && (
                            <Button 
                              onClick={handleUploadClick}
                              className="bg-primary-green hover:bg-primary-green/90 text-white border-0 px-3 py-2 text-xs font-bold rounded-full shadow-soft transition-all duration-300 hover:scale-105 flex-shrink-0"
                            >
                              <task.icon className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">{t('progress.ai.startPractice')}</span>
                              <span className="sm:hidden">{t('home.start')}</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress bar for weekly tasks */}
            <div className="mt-6 pt-4 border-t border-border-soft/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary font-medium">{t('home.thisWeek')} {t('home.progress.title')}</span>
                <span className="font-bold" style={{color: '#58CC02'}}>
                  {weeklyTasks.filter(task => task.completed).length}/{weeklyTasks.length} {t('home.progress.completed')}
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r rounded-full transition-all duration-700"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #58CC02, #89E219)',
                    width: `${(weeklyTasks.filter(task => task.completed).length / weeklyTasks.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Overview */}
        <div className="space-y-6">
          {/* 本週統計 Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary text-left px-4">{t('home.thisWeek')} {t('home.stats.title')}</h2>
            <Card className="bg-background-card rounded-3xl shadow-soft border border-border-soft overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-border-soft">
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-text-primary">12 {t('leaderboard.overall.dayStreak')} {t('home.stats.learning')}</p>
                      <p className="text-sm text-text-secondary">{t('home.stats.excellent')}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-2xl">📖</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-text-primary">18 {t('home.thisWeek')} {t('home.stats.vocabulary')}</p>
                      <p className="text-sm text-text-secondary">{t('home.stats.amazing')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 學習亮點 Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary text-left px-4">{t('home.highlights.title')}</h2>
            <Card className="bg-background-card rounded-3xl shadow-soft border border-border-soft">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-text-primary leading-relaxed mb-3 font-medium">
                      <span className="font-bold">{t('home.highlights.wellDone')}</span> {t('home.highlights.description', { percentage: 80 })}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20 text-xs px-3 py-1 rounded-full font-semibold">
                        {t('home.highlights.badges.vocabulary')}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-3 py-1 rounded-full font-semibold">
                        {t('home.highlights.badges.pronunciation')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 推薦練習 Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary text-left px-4">{t('progress.ai.title')}</h2>
            <Card className="bg-background-card rounded-3xl shadow-soft border border-border-soft overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-border-soft">
                  <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all duration-200 text-left">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Edit3 className="w-5 h-5 stroke-2" style={{color: '#58CC02'}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary truncate">{t('progress.ai.recs.1.title')}</p>
                      <p className="text-sm text-text-secondary">5 {t('progress.ai.minutes', {count: 5})} • 85% {t('progress.ai.proficiency')}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  </button>
                  <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all duration-200 text-left">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 stroke-2" style={{color: '#58CC02'}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary truncate">{t('progress.ai.recs.2.title')}</p>
                      <p className="text-sm text-text-secondary">10 {t('progress.ai.minutes', {count: 10})} • 79% {t('progress.ai.proficiency')}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom spacing for mobile navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}