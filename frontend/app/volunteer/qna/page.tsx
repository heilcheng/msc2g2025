"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Filter,
  ThumbsUp,
  Reply
} from "lucide-react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

interface Question {
  id: string
  title: string
  content: string
  author: string
  subject: string
  grade: string
  priority: 'urgent' | 'normal' | 'low'
  status: 'open' | 'answered' | 'resolved'
  answers: number
  upvotes: number
  createdAt: string
  tags: string[]
}

// Mock questions in English
const mockQuestionsEn: Question[] = [
  {
    id: "1",
    title: "How to help my child with pronunciation of 'th' sounds?",
    content: "My 7-year-old struggles with words like 'think' and 'this'. Any teaching strategies?",
    author: "Sarah M.",
    subject: "Phonics",
    grade: "Grade 2",
    priority: "urgent",
    status: "open",
    answers: 3,
    upvotes: 12,
    createdAt: "2 hours ago",
    tags: ["pronunciation", "phonics", "grade2"]
  },
  {
    id: "2", 
    title: "Reading comprehension activities for beginners",
    content: "Looking for engaging activities to improve reading comprehension for my kindergarten student.",
    author: "David L.",
    subject: "Reading",
    grade: "Kindergarten",
    priority: "normal",
    status: "answered",
    answers: 7,
    upvotes: 8,
    createdAt: "1 day ago",
    tags: ["reading", "comprehension", "kindergarten"]
  },
  {
    id: "3",
    title: "Best sight word practice techniques?",
    content: "My child is having trouble memorizing sight words. What are the most effective practice methods?",
    author: "Jennifer K.",
    subject: "Reading",
    grade: "Grade 1",
    priority: "normal",
    status: "open",
    answers: 2,
    upvotes: 15,
    createdAt: "3 days ago",
    tags: ["sight-words", "memorization", "practice"]
  },
  {
    id: "4",
    title: "How to motivate reluctant reader?",
    content: "My 6-year-old doesn't want to read books at home. How can I make reading more enjoyable?",
    author: "Emma C.",
    subject: "Motivation",
    grade: "Grade 1",
    priority: "normal",
    status: "open",
    answers: 5,
    upvotes: 9,
    createdAt: "5 days ago",
    tags: ["motivation", "reluctant-reader", "enjoyment"]
  },
  {
    id: "5",
    title: "Homework time struggles - need advice!",
    content: "Every evening is a battle to get my child to do homework. How can I make this process smoother?",
    author: "Frustrated Parent",
    subject: "Homework Help",
    grade: "Grade 2",
    priority: "normal",
    status: "answered",
    answers: 4,
    upvotes: 6,
    createdAt: "1 week ago",
    tags: ["homework", "routine", "behavior"]
  }
]

// Mock questions in Chinese
const mockQuestionsZh: Question[] = [
  {
    id: "1",
    title: "如何幫助孩子掌握 'th' 音的發音？",
    content: "我家 7 歲孩子在說 'think' 和 'this' 這類詞時有困難，有什麼教學策略嗎？",
    author: "Sarah M.",
    subject: "自然拼讀",
    grade: "小二",
    priority: "urgent",
    status: "open",
    answers: 3,
    upvotes: 12,
    createdAt: "2 小時前",
    tags: ["發音", "自然拼讀", "小二"]
  },
  {
    id: "2", 
    title: "初學者閱讀理解活動推薦",
    content: "想找一些有趣的活動來提升我家幼稚園孩子的閱讀理解能力。",
    author: "David L.",
    subject: "閱讀",
    grade: "幼稚園",
    priority: "normal",
    status: "answered",
    answers: 7,
    upvotes: 8,
    createdAt: "1 天前",
    tags: ["閱讀", "理解", "幼稚園"]
  },
  {
    id: "3",
    title: "常見詞練習的最佳技巧？",
    content: "我的孩子在記憶常見詞方面有困難，有什麼最有效的練習方法嗎？",
    author: "Jennifer K.",
    subject: "閱讀",
    grade: "小一",
    priority: "normal",
    status: "open",
    answers: 2,
    upvotes: 15,
    createdAt: "3 天前",
    tags: ["常見詞", "記憶", "練習"]
  },
  {
    id: "4",
    title: "如何激勵不愛閱讀的孩子？",
    content: "我家 6 歲孩子不願意在家看書，要怎樣讓閱讀變得更有趣？",
    author: "Emma C.",
    subject: "動機",
    grade: "小一",
    priority: "normal",
    status: "open",
    answers: 5,
    upvotes: 9,
    createdAt: "5 天前",
    tags: ["動機", "不愛閱讀", "樂趣"]
  },
  {
    id: "5",
    title: "功課時間總是很掙扎 - 需要建議！",
    content: "每天晚上都要跟孩子為做功課而戰，怎樣可以讓這個過程更順暢？",
    author: "苦惱家長",
    subject: "功課協助",
    grade: "小二",
    priority: "normal",
    status: "answered",
    answers: 4,
    upvotes: 6,
    createdAt: "1 週前",
    tags: ["功課", "例行", "行為"]
  }
]

export default function VolunteerQnAPage() {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showAnswerForm, setShowAnswerForm] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState("")
  
  // Determine which questions to show based on language
  const isZh = i18n.language?.startsWith("zh")
  const mockQuestions = isZh ? mockQuestionsZh : mockQuestionsEn

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "urgent" && question.priority === "urgent") ||
                         (selectedFilter === "unanswered" && question.status === "open") ||
                         (selectedFilter === "answered" && question.status !== "open")
    
    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200"
      case "normal": return "bg-blue-100 text-blue-800 border-blue-200"
      case "low": return "bg-gray-100 text-gray-800 border-gray-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="w-4 h-4 text-orange-500" />
      case "answered": return <MessageCircle className="w-4 h-4 text-blue-500" />
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const handleSubmitAnswer = (questionId: string) => {
    if (answerText.trim()) {
      // Here you would submit the answer to your backend
      console.log("Submitting answer for question:", questionId, "Answer:", answerText)
      setShowAnswerForm(null)
      setAnswerText("")
      // You could also update the local state to reflect the new answer
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 mt-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('volunteer.qna.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
                className="rounded-xl"
              >
                {t('volunteer.qna.filters.all')}
              </Button>
              <Button
                variant={selectedFilter === "urgent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("urgent")}
                className="rounded-xl"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {t('volunteer.qna.filters.urgent')}
              </Button>
              <Button
                variant={selectedFilter === "unanswered" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("unanswered")}
                className="rounded-xl"
              >
                {t('volunteer.qna.filters.unanswered')}
              </Button>
              <Button
                variant={selectedFilter === "answered" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("answered")}
                className="rounded-xl"
              >
                {t('volunteer.qna.filters.answered')}
              </Button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 bg-blue-100">
                      <span className="text-sm font-medium text-blue-600">
                        {question.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{question.author}</p>
                      <p className="text-sm text-gray-500">{question.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(question.status)}
                    <Badge className={getPriorityColor(question.priority)}>
                      {t(`volunteer.qna.priority.${question.priority}`)}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
                  <p className="text-gray-700 mb-3">{question.content}</p>
                  
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="outline">{question.subject}</Badge>
                    <Badge variant="outline">{question.grade}</Badge>
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{question.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{question.answers} {t('volunteer.qna.stats.answers')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAnswerForm(showAnswerForm === question.id ? null : question.id)}
                      className="rounded-xl"
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      {t('volunteer.qna.actions.answer')}
                    </Button>
                  </div>
                </div>

                {/* Answer Form */}
                {showAnswerForm === question.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3">{t('volunteer.qna.form.yourAnswer')}</h4>
                    <Textarea
                      placeholder={t('volunteer.qna.form.answerPlaceholder')}
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="mb-3 rounded-xl"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSubmitAnswer(question.id)}
                        disabled={!answerText.trim()}
                        className="rounded-xl"
                      >
                        {t('volunteer.qna.actions.submitAnswer')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAnswerForm(null)}
                        className="rounded-xl"
                      >
                        {t('volunteer.qna.actions.cancel')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">{t('volunteer.qna.empty.title')}</h3>
            <p className="text-gray-500">
              {searchQuery ? t('volunteer.qna.empty.subtitle') : t('volunteer.qna.empty.noResults')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
