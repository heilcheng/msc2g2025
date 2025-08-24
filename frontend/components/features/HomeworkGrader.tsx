"use client"

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  Star,
  Award,
  Target,
  Lightbulb,
  Heart,
  Sparkles
} from "lucide-react"
import { useTranslation } from "react-i18next"

interface GradingResults {
  parent_analysis: {
    overall_assessment: string
    glows: string[]
    grows: string[]
    parent_child_activities: string[]
  }
  child_encouragement: {
    praise_message: string
    badges: string[]
    fun_challenges: string[]
  }
  scores: {
    letter_formation: number
    line_adherence: number
    consistency_spacing: number
    overall_effort: number
  }
  total_score: number
}

type UploadState = 'ready' | 'uploading' | 'success' | 'error'

export function HomeworkGrader() {
  const { t } = useTranslation()
  const [uploadState, setUploadState] = useState<UploadState>('ready')
  const [results, setResults] = useState<GradingResults | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('請上傳圖片檔案 (JPG, PNG, 等)')
      setUploadState('error')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('圖片檔案大小不能超過 10MB')
      setUploadState('error')
      return
    }

    setUploadState('uploading')
    setErrorMessage('')

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)
      setSelectedImage(base64)

      // Call API
      const response = await fetch('/api/grade-homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          filename: file.name
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
      setUploadState('success')
    } catch (error) {
      console.error('Upload error:', error)
      setErrorMessage('哎呀，上傳失敗了。請檢查您的網路連線，然後再試一次。')
      setUploadState('error')
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = error => reject(error)
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const resetUpload = () => {
    setUploadState('ready')
    setResults(null)
    setErrorMessage('')
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'bg-primary-green'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  const getScoreLabel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return '優秀'
    if (percentage >= 60) return '良好'
    return '需要練習'
  }

  if (uploadState === 'ready' || uploadState === 'error') {
    return (
      <Card className="bg-white shadow-md rounded-3xl border-0 overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-green" />
            AI 手寫作業批改
          </CardTitle>
          <p className="text-gray-600 mt-2">讓 Dr. Owl 幫您的孩子分析字母練習</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {uploadState === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">上傳失敗</p>
                <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
              </div>
            </div>
          )}
          
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center cursor-pointer hover:border-primary-green hover:bg-green-50 transition-all duration-200"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <FileImage className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">上傳孩子的字母練習紙</h3>
                <p className="text-gray-600 mt-1">讓 Dr. Owl 幫您看看吧！</p>
                <p className="text-sm text-gray-500 mt-2">支援 JPG, PNG 格式，檔案大小限制 10MB</p>
              </div>
              <Button className="bg-primary-green hover:bg-green-600 text-white rounded-full px-6 py-2">
                <Upload className="w-4 h-4 mr-2" />
                選擇圖片
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>
    )
  }

  if (uploadState === 'uploading') {
    return (
      <Card className="bg-white shadow-md rounded-3xl border-0 overflow-hidden">
        <CardContent className="text-center py-16">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-primary-green/10 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">🦉</span>
              </div>
              <div className="absolute -inset-2">
                <div className="w-24 h-24 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">🦉 Dr. Owl 正在仔細看作業中</h3>
              <p className="text-gray-600">請稍候，我正在分析您孩子的字母練習...</p>
            </div>
            {selectedImage && (
              <div className="mt-6">
                <img 
                  src={selectedImage} 
                  alt="Uploaded homework" 
                  className="max-w-xs max-h-48 object-contain rounded-2xl shadow-md"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (uploadState === 'success' && results) {
    return (
      <Card className="bg-white shadow-md rounded-3xl border-0 overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary-green" />
            分析完成！
          </CardTitle>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-green">{results.total_score}</div>
              <div className="text-sm text-gray-600">總分</div>
            </div>
            <Badge className="bg-primary-green text-white px-4 py-2 rounded-full">
              {getScoreLabel(results.total_score, 110)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Breakdown */}
          <Card className="bg-gray-50 border-0 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-green" />
                詳細評分
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>字母形狀</span>
                    <span className="font-medium">{results.scores.letter_formation}/50</span>
                  </div>
                  <Progress 
                    value={(results.scores.letter_formation / 50) * 100} 
                    className={`h-2 ${getScoreColor(results.scores.letter_formation, 50)}`}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>線條遵循</span>
                    <span className="font-medium">{results.scores.line_adherence}/30</span>
                  </div>
                  <Progress 
                    value={(results.scores.line_adherence / 30) * 100}
                    className={`h-2 ${getScoreColor(results.scores.line_adherence, 30)}`}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>一致性與間距</span>
                    <span className="font-medium">{results.scores.consistency_spacing}/20</span>
                  </div>
                  <Progress 
                    value={(results.scores.consistency_spacing / 20) * 100}
                    className={`h-2 ${getScoreColor(results.scores.consistency_spacing, 20)}`}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>整體努力</span>
                    <span className="font-medium">{results.scores.overall_effort}/10</span>
                  </div>
                  <Progress 
                    value={(results.scores.overall_effort / 10) * 100}
                    className={`h-2 ${getScoreColor(results.scores.overall_effort, 10)}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Results */}
          <Tabs defaultValue="parent" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-2xl p-1">
              <TabsTrigger 
                value="parent" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                給家長的分析
              </TabsTrigger>
              <TabsTrigger 
                value="child"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                給小朋友的鼓勵
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="parent" className="mt-6 space-y-6">
              {/* Overall Assessment */}
              <Card className="bg-blue-50 border-blue-200 rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                    <Star className="w-5 h-5" />
                    總體評價
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-900">{results.parent_analysis.overall_assessment}</p>
                </CardContent>
              </Card>

              {/* Glows */}
              <Card className="bg-green-50 border-green-200 rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <Heart className="w-5 h-5" />
                    做得好的地方
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.parent_analysis.glows.map((glow, index) => (
                      <li key={index} className="flex items-start gap-2 text-green-900">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{glow}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Grows */}
              <Card className="bg-orange-50 border-orange-200 rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <Target className="w-5 h-5" />
                    可以進步的地方
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.parent_analysis.grows.map((grow, index) => (
                      <li key={index} className="flex items-start gap-2 text-orange-900">
                        <Lightbulb className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>{grow}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Parent-Child Activities */}
              <Card className="bg-purple-50 border-purple-200 rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                    <Heart className="w-5 h-5" />
                    建議的親子練習
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.parent_analysis.parent_child_activities.map((activity, index) => (
                      <li key={index} className="flex items-start gap-2 text-purple-900">
                        <Award className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="child" className="mt-6 space-y-6">
              {/* Child Praise */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 rounded-2xl">
                <CardContent className="text-center py-8">
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">太棒了，小朋友！</h3>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {results.child_encouragement.praise_message}
                  </p>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 rounded-2xl">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg flex items-center justify-center gap-2 text-blue-800">
                    <Award className="w-5 h-5" />
                    恭喜獲得徽章！
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-3">
                    {results.child_encouragement.badges.map((badge, index) => (
                      <Badge 
                        key={index} 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-base"
                      >
                        🏆 {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fun Challenges */}
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200 rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <Sparkles className="w-5 h-5" />
                    下次試試看
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.child_encouragement.fun_challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3 text-green-900">
                        <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-800 font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="text-base">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={resetUpload}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full"
            >
              分析新作業
            </Button>
            <Button 
              onClick={() => window.print()}
              className="flex-1 bg-primary-green hover:bg-green-600 text-white rounded-full"
            >
              列印結果
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
