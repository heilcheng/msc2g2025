"use client"

import React from 'react'
import { HomeworkGrader } from '@/components/features/HomeworkGrader'
import TopNavbar from '@/components/top-navbar'
import { useTranslation } from 'react-i18next'
import "@/lib/i18n"

export default function AIHomeworkGraderPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <TopNavbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 手寫作業分析
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            上傳您孩子的字母練習作業，讓 Dr. Owl 人工智能為您提供專業的學習分析和個人化建議
          </p>
        </div>

        <HomeworkGrader />

        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              關於 Dr. Owl AI 分析
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">精準分析</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  基於幼兒教育專業標準，從字母形狀、線條遵循、一致性等多維度進行評估
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">溫暖鼓勵</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  專為 K3 幼兒設計的正面回饋，重點培養學習興趣和自信心
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">親子指導</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  提供實用的親子練習活動建議，讓家長參與孩子的學習過程
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
