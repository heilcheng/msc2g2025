"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Download, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

export default function AssignmentsPage() {
  const { t } = useTranslation()
  const assignments = [
    {
      id: "1",
      title: "English Reading Comprehension",
      subject: "English",
      description: "Read the story 'The Little Red Hen' and answer the comprehension questions.",
      dueDate: "2025-08-23",
      status: "pending",
      difficulty: "Easy",
      estimatedTime: "30 mins",
      hasSubmission: false,
    },
    {
      id: "2",
      title: "Math Counting Practice",
      subject: "Mathematics",
      description: "Count objects in pictures and write the correct numbers 1-20.",
      dueDate: "2025-08-25",
      status: "submitted",
      difficulty: "Medium",
      estimatedTime: "20 mins",
      hasSubmission: true,
      grade: "18/20",
      feedback: "Great work! Practice writing number 7 more clearly.",
    },
    {
      id: "3",
      title: "Creative Art Expression",
      subject: "Art",
      description: "Draw your family members and write one word to describe each person.",
      dueDate: "2025-08-28",
      status: "pending",
      difficulty: "Easy",
      estimatedTime: "45 mins",
      hasSubmission: false,
    },
    {
      id: "4",
      title: "Science Nature Walk",
      subject: "Science",
      description: "Take photos of 5 different plants or animals you see outside.",
      dueDate: "2025-08-30",
      status: "pending",
      difficulty: "Medium",
      estimatedTime: "60 mins",
      hasSubmission: false,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status === "pending"

    if (isOverdue) {
      return (
        <Badge variant="destructive" className="text-xs">
          {t('assignments.list.statuses.overdue')}
        </Badge>
      )
    }

    switch (status) {
      case "submitted":
        return (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            {t('assignments.list.statuses.submitted')}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-xs">
            {t('assignments.list.statuses.pending')}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">REACH Hong Kong</h1>
                  <p className="text-sm text-muted-foreground">{t('assignments.list.title')}</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Emma Chen - K3
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{t('assignments.list.title')}</h2>
          <p className="text-muted-foreground">{t("assignments.list.subtitle")}</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder={t('assignments.list.searchPlaceholder')} className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('assignments.list.filterBySubject')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('assignments.list.subjects.all')}</SelectItem>
              <SelectItem value="english">{t('assignments.list.subjects.english')}</SelectItem>
              <SelectItem value="math">{t('assignments.list.subjects.mathematics')}</SelectItem>
              <SelectItem value="science">{t('assignments.list.subjects.science')}</SelectItem>
              <SelectItem value="art">{t('assignments.list.subjects.art')}</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t('assignments.list.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('assignments.list.statuses.all')}</SelectItem>
              <SelectItem value="pending">{t('assignments.list.statuses.pending')}</SelectItem>
              <SelectItem value="submitted">{t('assignments.list.statuses.submitted')}</SelectItem>
              <SelectItem value="graded">{t('assignments.list.statuses.graded')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assignment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(assignment.status)}
                    <Badge variant="outline" className="text-xs">
                      {assignment.subject}
                    </Badge>
                  </div>
                  {getStatusBadge(assignment.status, assignment.dueDate)}
                </div>
                <CardTitle className="text-lg leading-tight">{assignment.title}</CardTitle>
                <CardDescription className="text-sm">{assignment.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Assignment Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('assignments.list.labels.dueDate')}</p>
                    <p className="font-medium text-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('assignments.list.labels.estTime')}</p>
                    <p className="font-medium text-foreground">{assignment.estimatedTime}</p>
                  </div>
                </div>

                {/* Grade Display (if submitted) */}
                {assignment.hasSubmission && assignment.grade && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-green-800">{t('assignments.list.labels.grade')}</span>
                      <span className="text-lg font-bold text-green-600">{assignment.grade}</span>
                    </div>
                    {assignment.feedback && <p className="text-xs text-green-700">{assignment.feedback}</p>}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" asChild>
                      <Link href={`/assignments/${assignment.id}`}>
                        <Download className="w-4 h-4 mr-1" />
                        {t('assignments.list.actions.viewDetails')}
                      </Link>
                    </Button>

                    {!assignment.hasSubmission ? (
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`/assignments/${assignment.id}/submit`}>
                          <Upload className="w-4 h-4 mr-1" />
                          {t('assignments.list.actions.submitWork')}
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`/assignments/${assignment.id}/submission`}>{t('assignments.list.actions.viewSubmission')}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no assignments) */}
        {assignments.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{t('assignments.list.empty.title')}</h3>
            <p className="text-muted-foreground">{t('assignments.list.empty.description')}</p>
          </div>
        )}
      </main>
    </div>
  )
}
