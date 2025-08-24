"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Upload, Camera, Video, FileText, ArrowLeft, X, Check } from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"
import { use } from "react"

export default function SubmitAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation()
  const resolvedParams = use(params)
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      id: string
      name: string
      type: string
      size: string
      preview?: string
    }>
  >([])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Mock assignment data
  const assignment = {
    id: resolvedParams.id,
    title: "English Reading Comprehension",
    subject: "English",
    dueDate: "2025-08-23",
    maxPoints: 20,
    submissionTypes: ["photo", "video", "pdf"],
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const newFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }

      setUploadedFiles((prev) => [...prev, newFile])
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // In real app, redirect to success page or assignment detail
    }, 2500)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Camera className="w-4 h-4 text-primary" />
      case "video":
        return <Video className="w-4 h-4 text-primary" />
      case "document":
        return <FileText className="w-4 h-4 text-red-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/assignments/${assignment.id}`} className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('assignments.submit.header')}</h1>
                <p className="text-sm text-muted-foreground">{t('assignments.submit.reach')}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Emma Chen - K3
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Assignment Info */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <CardDescription>{t('assignments.submit.submitDesc')}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t('assignments.submit.dueDate')}</p>
                  <p className="font-bold text-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('assignments.submit.uploadYourWork')}</CardTitle>
                  <CardDescription>
                    {t('assignments.submit.uploadDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">{t('assignments.submit.dragDrop')}</h3>
                    <p className="text-muted-foreground mb-4">{t('assignments.submit.orClick')}</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer bg-transparent">
                        {t('assignments.submit.chooseFiles')}
                      </Button>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">{t('assignments.submit.supported')}</p>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">{t('assignments.submit.uploadedFiles')}</h4>
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          {file.preview ? (
                            <img
                              src={file.preview || "/placeholder.svg"}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              {getFileIcon(file.type)}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.size}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('assignments.submit.additionalNotes')}</CardTitle>
                  <CardDescription>{t('assignments.submit.additionalNotesDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={t('assignments.submit.notesPlaceholder')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Upload Progress */}
              {isSubmitting && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{t('assignments.submit.uploading')}</span>
                        <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Submission Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('assignments.submit.submissionGuidelines')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>{t('assignments.submit.guidelines.clearMedia')}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>{t('assignments.submit.guidelines.readableText')}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>{t("assignments.submit.guidelines.includeName")}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>{t('assignments.submit.guidelines.beforeDue')}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Accepted Formats */}
              <Card>
                <CardHeader>
                  <CardTitle>Accepted Formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignment.submissionTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        {getFileIcon(type)}
                        <span className="text-sm text-foreground capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={uploadedFiles.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        {t('assignments.submit.submitting')}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {t('assignments.submit.submitAssignment')}
                      </>
                    )}
                  </Button>
                  {uploadedFiles.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {t('assignments.submit.uploadAtLeastOne')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
