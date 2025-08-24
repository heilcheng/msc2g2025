"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { User, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
// } from "recharts"

import { use } from "react"

// Mock student database - in real app this would come from API
const mockStudentDatabase = {
  "STU001": {
    id: "STU001",
    name: "Emma Chen",
    age: 6,
    region: "Central Hong Kong",
    kindergarten: "Happy Learning K1",
    grade: "K1",
    parentName: "Sarah Chen",
    parentEmail: "sarah.chen@email.com",
    parentPhone: "+852 9123 4567",
    enrollmentDate: "2024-01-15",
    totalAttempts: 145,
    correctAttempts: 123,
    averageAttemptTime: 45,
    overallScore: 87,
    status: "active",
    lastActive: "2 hours ago",
    streakDays: 12,
    totalTimeSpent: 2340,
    subjects: {
      alphabet: { score: 92, attempts: 45, avgTime: 38 },
      sightWords: { score: 85, attempts: 38, avgTime: 52 },
      vocabulary: { score: 89, attempts: 32, avgTime: 41 },
      phonics: { score: 84, attempts: 30, avgTime: 48 }
    }
  },
  "STU002": {
    id: "STU002",
    name: "Lucas Wong", 
    age: 5,
    region: "Kowloon East",
    kindergarten: "Bright Future K2",
    grade: "K2",
    parentName: "Michael Wong",
    parentEmail: "michael.wong@email.com",
    parentPhone: "+852 9876 5433",
    enrollmentDate: "2024-01-08",
    totalAttempts: 189,
    correctAttempts: 156,
    averageAttemptTime: 52,
    overallScore: 82,
    status: "active",
    lastActive: "1 day ago",
    streakDays: 8,
    totalTimeSpent: 3120,
    subjects: {
      alphabet: { score: 88, attempts: 52, avgTime: 45 },
      sightWords: { score: 79, attempts: 47, avgTime: 58 },
      vocabulary: { score: 85, attempts: 45, avgTime: 49 },
      phonics: { score: 78, attempts: 45, avgTime: 55 }
    }
  }
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation()
  const resolvedParams = use(params)
  
  // Get student data from mock database or default
  const student = mockStudentDatabase[resolvedParams.id as keyof typeof mockStudentDatabase] || {
    id: resolvedParams.id,
    name: "Student Not Found",
    age: 0,
    region: "Unknown",
    kindergarten: "Unknown",
    grade: "Unknown",
    parentName: "Unknown",
    parentEmail: "unknown@email.com",
    parentPhone: "N/A",
    enrollmentDate: "2024-01-01",
    totalAttempts: 0,
    correctAttempts: 0,
    averageAttemptTime: 0,
    overallScore: 0,
    status: "inactive",
    lastActive: "Never",
    streakDays: 0,
    totalTimeSpent: 0,
    subjects: {
      alphabet: { score: 0, attempts: 0, avgTime: 0 },
      sightWords: { score: 0, attempts: 0, avgTime: 0 },
      vocabulary: { score: 0, attempts: 0, avgTime: 0 },
      phonics: { score: 0, attempts: 0, avgTime: 0 }
    }
  }

  const progressData = [
    { week: "Week 1", english: 82, math: 78, science: 85, art: 90 },
    { week: "Week 2", english: 85, math: 82, science: 88, art: 92 },
    { week: "Week 3", english: 88, math: 85, science: 90, art: 89 },
    { week: "Week 4", english: 87, math: 88, science: 92, art: 94 },
  ]

  const skillsData = [
    { skill: "Reading", score: 88 },
    { skill: "Writing", score: 82 },
    { skill: "Math", score: 85 },
    { skill: "Science", score: 90 },
    { skill: "Creativity", score: 94 },
    { skill: "Communication", score: 86 },
  ]

  const assignments = [
    {
      id: "1",
      title: "English Reading Comprehension",
      subject: "English",
      dueDate: "2025-08-23",
      submittedDate: "2025-08-22",
      grade: 85,
      status: "graded",
      feedback: "Good understanding of the story. Work on writing complete sentences.",
    },
    {
      id: "2",
      title: "Math Counting Practice",
      subject: "Mathematics",
      dueDate: "2025-08-25",
      submittedDate: "2025-08-24",
      grade: 92,
      status: "graded",
      feedback: "Excellent work! Numbers are written clearly and accurately.",
    },
    {
      id: "3",
      title: "Science Nature Walk",
      subject: "Science",
      dueDate: "2025-08-30",
      submittedDate: null,
      grade: null,
      status: "pending",
      feedback: null,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Graded</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "late":
        return <Badge variant="destructive">Late</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('admin.student.header')}</h1>
                <p className="text-sm text-muted-foreground">
                  {student.name} - Grade {student.grade}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-1" />
                {t('admin.student.contactParent')}
              </Button>
              <Button variant="outline" size="sm">
                {t('admin.student.generateReport')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Student Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{t('admin.student.studentInfo')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary">{student.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-bold text-foreground">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">Grade {student.grade}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('admin.student.parent')}</p>
                    <p className="font-medium text-foreground">{student.parentName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('admin.student.email')}</p>
                    <p className="font-medium text-foreground">{student.parentEmail}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('admin.student.phone')}</p>
                    <p className="font-medium text-foreground">{student.parentPhone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('admin.student.enrolled')}</p>
                    <p className="font-medium text-foreground">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('admin.student.status')}</p>
                    <Badge className="bg-green-100 text-green-800 mt-1">{t('admin.student.active')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.student.quickStats')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('admin.student.avgScore')}</span>
                  <span className="font-bold text-foreground">{student.overallScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Attempts</span>
                  <span className="font-bold text-foreground">{student.totalAttempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-bold text-foreground">
                    {student.totalAttempts > 0 ? Math.round((student.correctAttempts / student.totalAttempts) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('admin.student.lastActive')}</span>
                  <span className="text-sm text-foreground">{student.lastActive}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{t('admin.student.tabs.overview')}</TabsTrigger>
                <TabsTrigger value="assignments">{t('admin.student.tabs.assignments')}</TabsTrigger>
                <TabsTrigger value="progress">{t('admin.student.tabs.progress')}</TabsTrigger>
                <TabsTrigger value="activity">{t('admin.student.tabs.activity')}</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.student.overview.performanceTitle')}</CardTitle>
                    <CardDescription>{t('admin.student.overview.performanceDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Custom CSS Line Chart Alternative */}
                    <div className="h-[300px] flex items-end justify-between p-4 border rounded-lg bg-gray-50">
                      {progressData.map((data, index) => (
                        <div key={data.week} className="flex-1 flex flex-col items-center space-y-2">
                          <div className="relative w-full max-w-[60px] h-[250px] flex items-end justify-center space-x-1">
                            {/* English Bar */}
                            <div 
                              className="w-3 bg-orange-400 rounded-t"
                              style={{ height: `${(data.english / 100) * 200}px` }}
                            />
                            {/* Math Bar */}
                            <div 
                              className="w-3 bg-yellow-400 rounded-t"
                              style={{ height: `${(data.math / 100) * 200}px` }}
                            />
                            {/* Science Bar */}
                            <div 
                              className="w-3 bg-gray-600 rounded-t"
                              style={{ height: `${(data.science / 100) * 200}px` }}
                            />
                            {/* Art Bar */}
                            <div 
                              className="w-3 bg-green-500 rounded-t"
                              style={{ height: `${(data.art / 100) * 200}px` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{data.week}</span>
                        </div>
                      ))}
                    </div>
                    {/* Legend */}
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-400 rounded"></div>
                        <span className="text-sm">English</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                        <span className="text-sm">Math</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-600 rounded"></div>
                        <span className="text-sm">Science</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm">Art</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Radar */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.student.overview.skillsTitle')}</CardTitle>
                    <CardDescription>{t('admin.student.overview.skillsDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Custom CSS Skills Grid Alternative */}
                    <div className="grid grid-cols-2 gap-4">
                      {skillsData.map((skill, index) => (
                        <div key={skill.skill} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.skill}</span>
                            <span className="text-orange-600 font-bold">{skill.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-orange-400 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${skill.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assignments Tab */}
              <TabsContent value="assignments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.student.assignments.historyTitle')}</CardTitle>
                    <CardDescription>{t('admin.student.assignments.historyDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-foreground">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(assignment.status)}
                              {assignment.grade && (
                                <p className="text-lg font-bold text-foreground mt-1">{assignment.grade}%</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground">{t('admin.student.assignments.dueDate')}</p>
                              <p className="text-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">{t('admin.student.assignments.submitted')}</p>
                              <p className="text-foreground">
                                {assignment.submittedDate
                                  ? new Date(assignment.submittedDate).toLocaleDateString()
                                  : t('admin.student.assignments.notSubmitted')}
                              </p>
                            </div>
                          </div>

                          {assignment.feedback && (
                            <div className="bg-muted/50 rounded p-3">
                              <p className="text-sm font-medium text-foreground mb-1">{t('admin.student.assignments.teacherFeedback')}</p>
                              <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Progress Tab */}
              <TabsContent value="progress" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('admin.student.progress.subjectProgressTitle')}</CardTitle>
                      <CardDescription>{t('admin.student.progress.subjectProgressDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { subject: "English", score: 87, target: 85 },
                        { subject: "Mathematics", score: 88, target: 80 },
                        { subject: "Science", score: 92, target: 85 },
                        { subject: "Art", score: 94, target: 90 },
                      ].map((item) => (
                        <div key={item.subject} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">{item.subject}</span>
                            <span className="text-muted-foreground">
                              {item.score}% ({t('admin.student.progress.target')}: {item.target}%)
                            </span>
                          </div>
                          <Progress value={item.score} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('admin.student.progress.learningGoalsTitle')}</CardTitle>
                      <CardDescription>{t('admin.student.progress.learningGoalsDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm font-medium text-orange-800">{t('admin.student.progress.focusArea')}</p>
                        <p className="text-sm text-orange-700">Number formation (6, 9) - Practice needed</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">{t('admin.student.progress.strength')}</p>
                        <p className="text-sm text-green-700">Creative expression and artistic skills</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">{t('admin.student.progress.achievement')}</p>
                        <p className="text-sm text-green-700">Excellent reading comprehension progress</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Student engagement and platform usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Submitted Math assignment</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Parent posted in assignment discussion</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Received grade for English assignment</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
