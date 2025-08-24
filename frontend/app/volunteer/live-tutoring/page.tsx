"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Play,
  Pause,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share,
  MessageSquare,
  Settings
} from "lucide-react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

interface TutoringSession {
  id: string
  title: string
  student: string
  subject: string
  grade: string
  scheduledTime: string
  duration: number // in minutes
  status: 'upcoming' | 'live' | 'completed'
  description: string
  studentAvatar?: string
}

// Mock sessions in English
const mockSessionsEn: TutoringSession[] = [
  {
    id: "1",
    title: "Reading Comprehension Help",
    student: "Emma Chen",
    subject: "English",
    grade: "Grade 3",
    scheduledTime: "2024-01-15T14:00:00",
    duration: 30,
    status: "live",
    description: "Help with understanding story elements and answering comprehension questions"
  },
  {
    id: "2",
    title: "Math Word Problems",
    student: "Lucas Wong",
    subject: "Math",
    grade: "Grade 2",
    scheduledTime: "2024-01-15T15:30:00",
    duration: 45,
    status: "upcoming",
    description: "Practice solving addition and subtraction word problems"
  },
  {
    id: "3",
    title: "Phonics Practice",
    student: "Sophia Lee",
    subject: "English",
    grade: "Kindergarten",
    scheduledTime: "2024-01-15T16:15:00",
    duration: 25,
    status: "upcoming",
    description: "Work on letter sounds and blending CVC words"
  },
  {
    id: "4",
    title: "Science Vocabulary",
    student: "Ryan Park",
    subject: "Science",
    grade: "Grade 4",
    scheduledTime: "2024-01-14T13:00:00",
    duration: 30,
    status: "completed",
    description: "Review plant life cycle vocabulary and concepts"
  },
  {
    id: "5",
    title: "Sight Words Review",
    student: "Chloe Chan",
    subject: "English",
    grade: "Grade 1",
    scheduledTime: "2024-01-16T10:00:00",
    duration: 30,
    status: "upcoming",
    description: "Practice high-frequency sight words and reading fluency"
  }
]

// Mock sessions in Chinese
const mockSessionsZh: TutoringSession[] = [
  {
    id: "1",
    title: "閱讀理解輔導",
    student: "陳小美",
    subject: "英文",
    grade: "小三",
    scheduledTime: "2024-01-15T14:00:00",
    duration: 30,
    status: "live",
    description: "幫助理解故事元素和回答理解問題"
  },
  {
    id: "2",
    title: "數學應用題",
    student: "黃小明",
    subject: "數學",
    grade: "小二",
    scheduledTime: "2024-01-15T15:30:00",
    duration: 45,
    status: "upcoming",
    description: "練習解決加法和減法應用題"
  },
  {
    id: "3",
    title: "自然拼讀練習",
    student: "李小雅",
    subject: "英文",
    grade: "幼稚園",
    scheduledTime: "2024-01-15T16:15:00",
    duration: 25,
    status: "upcoming",
    description: "練習字母發音和拼讀 CVC 詞語"
  },
  {
    id: "4",
    title: "科學詞彙複習",
    student: "朴小俊",
    subject: "科學",
    grade: "小四",
    scheduledTime: "2024-01-14T13:00:00",
    duration: 30,
    status: "completed",
    description: "複習植物生命週期詞彙和概念"
  },
  {
    id: "5",
    title: "常見詞複習",
    student: "陳小晴",
    subject: "英文",
    grade: "小一",
    scheduledTime: "2024-01-16T10:00:00",
    duration: 30,
    status: "upcoming",
    description: "練習高頻常見詞和閱讀流利度"
  }
]

export default function VolunteerLiveTutoringPage() {
  const { t, i18n } = useTranslation()
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming')
  const [inSession, setInSession] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)

  // Determine which sessions to show based on language
  const isZh = i18n.language?.startsWith("zh")
  const mockSessions = isZh ? mockSessionsZh : mockSessionsEn

  const filteredSessions = mockSessions.filter(session => session.status === selectedTab)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return t('volunteer.liveTutoring.time.today')
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t('volunteer.liveTutoring.time.tomorrow')
    } else {
      return date.toLocaleDateString(isZh ? 'zh-TW' : 'en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-100 text-red-800 border-red-200"
      case "upcoming": return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const LiveSessionControls = () => (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-full px-6 py-3 flex items-center gap-4 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMuted(!isMuted)}
        className={`rounded-full w-12 h-12 ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCameraOn(!isCameraOn)}
        className={`rounded-full w-12 h-12 ${!isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
      >
        {isCameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white"
      >
        <Share className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white"
      >
        <MessageSquare className="w-5 h-5" />
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => setInSession(false)}
        className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600"
      >
        <PhoneOff className="w-5 h-5" />
      </Button>
    </div>
  )

  if (inSession) {
    return (
      <div className="min-h-screen bg-gray-900 relative">
        {/* Main Video Area */}
        <div className="relative w-full h-screen">
          {/* Student Video (Main) */}
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white">
              <Avatar className="w-32 h-32 mx-auto mb-4 bg-blue-500">
                <span className="text-4xl font-bold">EC</span>
              </Avatar>
              <h2 className="text-2xl font-bold mb-2">Emma Chen</h2>
              <p className="text-gray-300">Reading Comprehension Help</p>
            </div>
          </div>

          {/* Volunteer Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-xl overflow-hidden border-2 border-white">
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{t('volunteer.liveTutoring.videoCall.you')}</p>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{t('volunteer.liveTutoring.videoCall.live')}</span>
              <span className="text-sm">25:30</span>
            </div>
          </div>
        </div>

        <LiveSessionControls />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-8 mt-8">
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 w-fit">
            {(['upcoming', 'live', 'completed'] as const).map((tab) => (
              <Button
                key={tab}
                variant={selectedTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab(tab)}
                className="rounded-lg capitalize"
              >
                {tab === 'live' && <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />}
                {t(`volunteer.liveTutoring.tabs.${tab}`)} ({mockSessions.filter(s => s.status === tab).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 bg-blue-100">
                      <span className="text-lg font-medium text-blue-600">
                        {session.student.split(' ').map(n => n[0]).join('')}
                      </span>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-gray-600 font-medium">{session.student}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{session.subject}</Badge>
                        <Badge variant="outline">{session.grade}</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-4">{session.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(session.scheduledTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(session.scheduledTime)} ({session.duration}min)</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {session.status === 'live' && (
                      <Button
                        onClick={() => setInSession(true)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        {t('volunteer.liveTutoring.session.joinSession')}
                      </Button>
                    )}
                    {session.status === 'upcoming' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {t('volunteer.liveTutoring.session.message')}
                        </Button>
                        <Button
                          onClick={() => setInSession(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          {t('volunteer.liveTutoring.session.startEarly')}
                        </Button>
                      </>
                    )}
                    {session.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {t('volunteer.liveTutoring.session.viewNotes')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-500">
              {selectedTab === 'live' && t('volunteer.liveTutoring.empty.noLive')}
              {selectedTab === 'upcoming' && t('volunteer.liveTutoring.empty.noUpcoming')}
              {selectedTab === 'completed' && t('volunteer.liveTutoring.empty.noCompleted')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
