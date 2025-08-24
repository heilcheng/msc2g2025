"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  BarChart3,
  Download,
  Filter,
  Search,
  Eye,
  ChevronRight,
  MapPin,
  Calendar,
  BookOpen,
  Brain,
  Timer,
  AlertTriangle,
  UserX,
  MessageSquare,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Heart,
  TrendingDown
} from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"
import TopNavbar from "@/components/top-navbar"
// Recharts temporarily removed due to React 19 compatibility issues
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area
// } from "recharts"
import { 
  MOCK_STUDENTS,
  AGGREGATE_STATS,
  REGIONAL_STATS,
  AGE_GROUP_STATS,
  SUBJECT_PERFORMANCE,
  WEEKLY_TREND,
  getStudentsByPage
} from "@/lib/mock-student-data"

export default function AdminDashboard() {
  const { t } = useTranslation('common')
  
  // Get recent students for the students tab
  const recentStudents = MOCK_STUDENTS.slice(0, 20)
  
  // Mock data for Priority Action Center
  const getWatchlistStudents = () => {
    return MOCK_STUDENTS
      .filter(student => {
        const recentScores = student.weeklyProgress.slice(-3)
        const hasDecline = recentScores.length >= 2 && 
          recentScores[recentScores.length - 1].score < recentScores[0].score - 15
        const lowPerformance = student.overallScore < 70
        return hasDecline || lowPerformance
      })
      .slice(0, 5)
      .map(student => ({
        ...student,
        reason: student.overallScore < 70 
          ? `持續低於70分 (${student.overallScore}%)` 
          : '連續三週分數下降 15%'
      }))
  }
  
  const getInactiveParents = () => {
    const now = new Date()
    return MOCK_STUDENTS
      .filter(student => {
        const lastActive = new Date(student.lastActive)
        const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
        return daysDiff > 14
      })
      .slice(0, 5)
      .map(student => {
        const lastActive = new Date(student.lastActive)
        const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
        return {
          ...student,
          daysInactive: daysDiff
        }
      })
  }
  
  const watchlistStudents = getWatchlistStudents()
  const inactiveParents = getInactiveParents()
  
  // Simplified KPIs
  const criticalKPIs = {
    engagement: AGGREGATE_STATS.activeToday,
    progress: AGGREGATE_STATS.averageScore,
    retention: 87.3 // Mock weekly return rate
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100" 
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }
  
  const getUrgencyColor = (reason: string) => {
    if (reason.includes('持續低於')) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200'
    return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-gray-900" suppressHydrationWarning={true}>
      <TopNavbar />
      {/* Header */}
      <header className="bg-background-card dark:bg-gray-800 shadow-soft border-b border-border-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-white flex items-center gap-4 font-sf-pro">
                <div className="w-14 h-14 bg-primary-green rounded-3xl flex items-center justify-center shadow-ios">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div>{t('admin.title')}</div>
                  <div className="text-sm font-normal text-text-secondary dark:text-gray-300 mt-1">
                    REACH Hong Kong • {t('admin.englishLearning')}
                  </div>
                </div>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-full border-border-soft hover:bg-primary-green hover:text-white transition-transform-colors hover:scale-105">
                <Download className="w-4 h-4 mr-2" />
                {t('admin.exportData')}
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-border-soft hover:bg-primary-green hover:text-white transition-transform-colors hover:scale-105">
                <Filter className="w-4 h-4 mr-2" />
                {t('admin.filter')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Priority Action Center */}
        <div className="bg-background-card dark:bg-gray-800 rounded-3xl shadow-ios border-0">
          <div className="p-8 border-b border-border-soft dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary dark:text-white font-sf-pro">{t('admin.priorityActionCenter')}</h2>
                <p className="text-base text-text-secondary dark:text-gray-400 mt-1">{t('admin.priorityActionCenterDesc')}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Watchlist */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-primary dark:text-white flex items-center gap-3 font-sf-pro">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    {t('admin.studentWatchlist')}
                  </h3>
                  <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800 text-sm px-3 py-1 rounded-full">
                    {watchlistStudents.length} {t('admin.needsAttention')}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {watchlistStudents.slice(0, 3).map((student) => (
                    <div key={student.id} className={`p-4 rounded-2xl border-0 shadow-soft ${getUrgencyColor(student.reason)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-secondary-green rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-base text-text-primary dark:text-white">{student.name}</p>
                            <p className="text-sm mt-1 font-medium">{student.reason}</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-primary-green hover:bg-primary-green/90 text-white border-0 text-sm h-8 px-4 rounded-full transition-transform-colors hover:scale-105">
                          {t('admin.viewDetails')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {watchlistStudents.length > 3 && (
                  <Button variant="ghost" className="w-full text-sm h-8">
                    {t('admin.viewAll')} ({watchlistStudents.length - 3} {t('admin.more')})
                  </Button>
                )}
              </div>
              
              {/* Inactive Parents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-primary dark:text-white flex items-center gap-3 font-sf-pro">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    {t('admin.inactiveParents')}
                  </h3>
                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 text-sm px-3 py-1 rounded-full">
                    {inactiveParents.length} {t('admin.inactive')}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {inactiveParents.slice(0, 3).map((parent) => (
                    <div key={parent.id} className="p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{parent.parentName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {parent.daysInactive} {t('admin.daysAgo')} • {parent.name}
                          </p>
                        </div>
                        <Button size="sm" className="text-xs h-7 bg-blue-600 hover:bg-blue-700">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {t('admin.sendReminder')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {inactiveParents.length > 3 && (
                  <Button variant="ghost" className="w-full text-sm h-8">
                    {t('admin.viewAll')} ({inactiveParents.length - 3} {t('admin.more')})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Redesigned KPI Cards - Education Themed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-ios bg-background-card dark:bg-gray-800 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary-green rounded-3xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wide">{t('admin.engagement')}</p>
                  <p className="text-4xl font-bold text-text-primary dark:text-white font-sf-pro mt-1">{criticalKPIs.engagement}</p>
                  <p className="text-sm text-text-secondary dark:text-gray-400 mt-2 font-medium">{t('admin.dailyActiveStudents')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-ios bg-background-card dark:bg-gray-800 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary-green rounded-3xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wide">{t('admin.progress')}</p>
                  <p className="text-4xl font-bold text-text-primary dark:text-white font-sf-pro mt-1">{criticalKPIs.progress}%</p>
                  <p className="text-sm text-text-secondary dark:text-gray-400 mt-2 font-medium">{t('admin.averageScore')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-ios bg-background-card dark:bg-gray-800 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary-green rounded-3xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wide">{t('admin.retention')}</p>
                  <p className="text-4xl font-bold text-text-primary dark:text-white font-sf-pro mt-1">{criticalKPIs.retention}%</p>
                  <p className="text-sm text-text-secondary dark:text-gray-400 mt-2 font-medium">{t('admin.weeklyReturnRate')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-background-light dark:bg-gray-800 p-2 rounded-3xl shadow-soft">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background-card data-[state=active]:shadow-ios data-[state=active]:text-text-primary rounded-2xl font-sf-pro font-medium py-3 transition-transform-colors hover:scale-105">{t('admin.overview')}</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-background-card data-[state=active]:shadow-ios data-[state=active]:text-text-primary rounded-2xl font-sf-pro font-medium py-3 transition-transform-colors hover:scale-105">{t('admin.students')}</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-background-card data-[state=active]:shadow-ios data-[state=active]:text-text-primary rounded-2xl font-sf-pro font-medium py-3 transition-transform-colors hover:scale-105">{t('admin.performance')}</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-background-card data-[state=active]:shadow-ios data-[state=active]:text-text-primary rounded-2xl font-sf-pro font-medium py-3 transition-transform-colors hover:scale-105">{t('admin.insights')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Key Learning Insights */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-text-primary dark:text-white font-sf-pro">{t('admin.learningInsights')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-ios bg-background-card dark:bg-gray-800 rounded-3xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-green rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-text-primary dark:text-white">{t('admin.dashboard.reports.positiveTrend')}</p>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">{t('admin.dashboard.reports.positiveTrendDesc')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-ios bg-background-card dark:bg-gray-800 rounded-3xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-text-primary dark:text-white">{t('admin.dashboard.reports.attentionNeeded')}</p>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">{t('admin.dashboard.reports.attentionNeededDesc')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-ios bg-background-card dark:bg-gray-800 rounded-3xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary-green rounded-2xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-text-primary dark:text-white">{t('admin.dashboard.reports.opportunity')}</p>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">{t('admin.dashboard.reports.opportunityDesc')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Learning Journey Chart */}
            <Card className="border-0 shadow-ios bg-background-card dark:bg-gray-800 rounded-3xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-text-primary dark:text-white font-sf-pro">{t('admin.learningJourney')}</CardTitle>
                <CardDescription className="text-lg text-text-secondary dark:text-gray-400">{t('admin.learningJourneyDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-7 gap-3 text-sm text-text-secondary dark:text-gray-400 font-medium">
                    {WEEKLY_TREND.map((week) => (
                      <div key={week.week} className="text-center">
                        {week.week}
                      </div>
                    ))}
                  </div>
                  <div className="relative h-80 bg-gradient-to-t from-primary-green/5 to-transparent dark:from-primary-green/10 rounded-3xl p-6">
                    <div className="grid grid-cols-7 gap-3 h-full items-end">
                      {WEEKLY_TREND.map((week, index) => (
                        <div key={week.week} className="flex flex-col items-center h-full justify-end">
                          <div 
                            className="w-full bg-primary-green dark:bg-primary-green rounded-t-2xl transition-all duration-700 hover:bg-secondary-green dark:hover:bg-secondary-green cursor-pointer flex items-end justify-center text-white text-sm font-bold pb-2 shadow-soft"
                            style={{ height: `${(week.avgScore / 100) * 100}%` }}
                            title={`第 ${week.week} 週: ${week.avgScore}%`}
                          >
                            {week.avgScore}%
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-text-secondary dark:text-gray-500 py-6 font-medium">
                      <span>100%</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span>0%</span>
                    </div>
                  </div>
                  <div className="text-center bg-primary-green/5 dark:bg-primary-green/10 rounded-2xl p-4">
                    <p className="text-lg text-text-primary dark:text-white font-sf-pro">
                      {t('admin.currentAverage')}: <span className="font-bold text-primary-green">{AGGREGATE_STATS.averageScore}%</span>
                    </p>
                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">{t('admin.excellentProgress')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Educational Skills Mastery */}
            <Card className="border-0 shadow-ios bg-background-card dark:bg-gray-800 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-text-primary dark:text-white font-sf-pro">{t('admin.skillsMastery')}</CardTitle>
                <CardDescription className="text-lg text-text-secondary dark:text-gray-400">{t('admin.skillsMasteryDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {SUBJECT_PERFORMANCE.map((subject, index) => {
                    const icons = ['🔤', '👁️', '📚', '🗣️']; // Alphabet, Sight Words, Vocabulary, Phonics
                    const colors = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'];
                    const textColors = ['text-red-600', 'text-blue-600', 'text-green-600', 'text-purple-600'];
                    
                    return (
                      <div key={subject.subject} className="text-center space-y-4">
                        <div className={`w-20 h-20 mx-auto rounded-3xl ${colors[index]} dark:bg-gray-700 flex items-center justify-center`}>
                          <span className="text-3xl">{icons[index]}</span>
                        </div>
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-primary-green flex items-center justify-center -mt-2 shadow-ios`}>
                          <span className="text-xl font-bold text-white">{subject.avgScore}%</span>
                        </div>
                        <div>
                          <p className="font-bold text-base text-text-primary dark:text-white">
                            {t(`admin.${subject.subject.toLowerCase().replace(' ', '')}`) || subject.subject}
                          </p>
                          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                            {subject.totalAttempts} {t('admin.exercises')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.studentDirectory')}</CardTitle>
                <CardDescription>
                  {t('admin.studentDirectoryDesc')}
                </CardDescription>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('admin.searchStudents')}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    {t('admin.filter')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {t('admin.age')} {student.age}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {student.region}
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {student.kindergarten}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge className={getPerformanceColor(student.overallScore)}>
                                {student.overallScore}% {t('admin.overallScore')}
                              </Badge>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                {student.totalAttempts} {t('admin.attempts')}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                {formatTime(student.totalTimeSpent)} {t('admin.total')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.streakDays} {t('admin.dayStreak')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t('admin.lastActive')}: {new Date(student.lastActive).toLocaleDateString()}
                            </p>
                          </div>
                          <Link href={`/admin/students/${student.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              {t('admin.view')}
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Comparison - CSS Alternative */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.subjectComparison')}</CardTitle>
                  <CardDescription>{t('admin.subjectComparisonDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SUBJECT_PERFORMANCE.map((subject) => (
                      <div key={subject.subject} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {subject.subject}
                          </span>
                          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                            {subject.avgScore}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div 
                            className="bg-orange-500 dark:bg-orange-400 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${subject.avgScore}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {subject.totalAttempts}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {subject.totalAttempts} {t('admin.attempts')} • {subject.avgTime.toFixed(1)}s avg
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Attempt Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.learningEfficiency')}</CardTitle>
                  <CardDescription>{t('admin.learningEfficiencyDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('admin.dashboard.assignments.graded')}</span>
                    <span className="font-bold text-green-600">142</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('admin.dashboard.assignments.pendingReview')}</span>
                    <span className="font-bold text-orange-500">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('admin.dashboard.assignments.aiPreGraded')}</span>
                    <span className="font-bold text-green-600">12</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.detailedMetrics')}</CardTitle>
                <CardDescription>{t('admin.detailedMetricsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">{t('admin.subject')}</th>
                        <th className="text-right p-3 font-medium">{t('admin.avgScore')}</th>
                        <th className="text-right p-3 font-medium">{t('admin.totalAttempts')}</th>
                        <th className="text-right p-3 font-medium">{t('admin.avgTime')}</th>
                        <th className="text-right p-3 font-medium">{t('admin.successRate')}</th>
                        <th className="text-right p-3 font-medium">{t('admin.difficultyIndex')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SUBJECT_PERFORMANCE.map((subject) => {
                        const successRate = (subject.avgScore / 100) * 100
                        const difficultyIndex = subject.avgTime / subject.avgScore * 100
                        
                        return (
                          <tr key={subject.subject} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-3 font-medium">{subject.subject}</td>
                            <td className="p-3 text-right">
                              <Badge className={getPerformanceColor(subject.avgScore)}>
                                {subject.avgScore}%
                              </Badge>
                            </td>
                            <td className="p-3 text-right">{subject.totalAttempts}</td>
                            <td className="p-3 text-right">{subject.avgTime.toFixed(1)}s</td>
                            <td className="p-3 text-right">{successRate.toFixed(1)}%</td>
                            <td className="p-3 text-right">
                              <Badge variant={difficultyIndex > 80 ? "destructive" : difficultyIndex > 60 ? "secondary" : "default"}>
                                {difficultyIndex > 80 ? t('admin.high') : difficultyIndex > 60 ? t('admin.medium') : t('admin.low')}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab - Combines Analytics and Reports */}
          <TabsContent value="insights" className="space-y-8">
            {/* Regional and Learning Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Performance Chart - CSS Alternative */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>{t('admin.regionalPerformance')}</CardTitle>
                  <CardDescription>{t('admin.regionalPerformanceDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {REGIONAL_STATS.map((region) => (
                      <div key={region.region} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {region.region}
                          </span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {region.avgScore}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-green-500 dark:bg-green-400 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${region.avgScore}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {region.students}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {region.students} {t('admin.students')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Key Metrics Grid */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>{t('admin.keyMetrics')}</CardTitle>
                  <CardDescription>{t('admin.keyMetricsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">24.5m</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">{t('admin.avgSessionTime')}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">87.3%</p>
                      <p className="text-xs text-green-700 dark:text-green-300">{t('admin.completionRate')}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">92.1%</p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">{t('admin.returnRate')}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">12.4</p>
                      <p className="text-xs text-orange-700 dark:text-orange-300">{t('admin.avgQuestionsPerSession')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Learning Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>{t('admin.learningIntelligence')}</CardTitle>
                  <CardDescription>{t('admin.learningIntelligenceDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium">{t('admin.mostDifficult')}</span>
                    </div>
                    <span className="font-bold text-red-600 dark:text-red-400">Sight Words</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium">{t('admin.fastestImprovement')}</span>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400">Alphabet</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium">{t('admin.peakLearningTime')}</span>
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">2:00 PM</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Export and Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>{t('admin.exportReports')}</CardTitle>
                  <CardDescription>{t('admin.exportReportsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-16 flex-col gap-2 border-dashed">
                      <BarChart3 className="w-5 h-5" />
                      <span className="text-xs">{t('admin.performanceReport')}</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2 border-dashed">
                      <Users className="w-5 h-5" />
                      <span className="text-xs">{t('admin.studentSummary')}</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2 border-dashed">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-xs">{t('admin.progressReport')}</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2 border-dashed">
                      <MapPin className="w-5 h-5" />
                      <span className="text-xs">{t('admin.regionalAnalysis')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}