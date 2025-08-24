"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  ArrowLeft,
  Heart,
  MessageCircle,
  Pin,
  Star,
  HelpCircle,
  ThumbsUp,
  Reply,
  Flag,
} from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"
import { use } from "react"

// Localized discussion and replies (EN / ZH)
const discussionEn = {
  title: "Tips for K3 to Primary 1 Transition",
  category: "general",
  author: "Parent_Mom123",
  isAnonymous: true,
  content: `My daughter is starting Primary 1 next year and I'm really worried about the transition. She's doing well in K3 but I've heard P1 is much more demanding.

Has anyone been through this transition recently? What should I be preparing her for? Any tips on:
- Academic preparation
- Social adjustment
- Daily routine changes
- Homework expectations

I want to make sure she's ready but don't want to overwhelm her. Any advice would be greatly appreciated!`,
  replies: 24,
  likes: 18,
  createdAt: "2 days ago",
  isPinned: true,
  isPopular: true,
  tags: ["transition", "primary-1", "preparation"],
}

const discussionZh = {
  title: "K3 升小一過渡小秘訣",
  category: "general",
  author: "Parent_Mom123",
  isAnonymous: true,
  content: `我女兒明年要升小一，我有點擔心過渡期。她在 K3 表現不錯，但聽說小一要求高很多。

有沒有最近經歷過這個階段的家長？我應該如何幫她準備？例如：
- 學術準備
- 社交適應
- 每日作息調整
- 功課要求

我想幫她做好準備，但不想讓她壓力太大。任何建議都非常感謝！`,
  replies: 24,
  likes: 18,
  createdAt: "2 天前",
  isPinned: true,
  isPopular: true,
  tags: ["過渡", "小一", "準備"],
}

const repliesEn = [
  {
    id: "1",
    author: "TeacherVolunteer",
    isAnonymous: false,
    isVolunteer: true,
    content: `As a former K3 teacher, I can share some insights that might help:

**Academic Preparation:**
- Focus on basic reading fluency - she should be comfortable reading simple sentences
- Practice writing her name and basic characters clearly
- Work on number recognition and simple addition/subtraction

**Social Skills:**
- Encourage independence in tasks like organizing her bag
- Practice following multi-step instructions
- Help her express her needs clearly to adults

The transition is gradual, so don't worry too much! Most children adapt well within the first month.`,
    likes: 12,
    createdAt: "1 day ago",
    isHelpful: true,
  },
  {
    id: "2",
    author: "ExperiencedMom",
    isAnonymous: false,
    isVolunteer: false,
    content: `I went through this with my eldest last year. The biggest change was the homework routine! 

Start establishing a quiet study time now, even if it's just 15-20 minutes. We found that having a dedicated homework space really helped.

Also, don't underestimate the importance of good sleep habits. P1 days are longer and more tiring.`,
    likes: 8,
    createdAt: "1 day ago",
    isHelpful: false,
  },
  {
    id: "3",
    author: "Anonymous_Parent",
    isAnonymous: true,
    isVolunteer: false,
    content: `Thank you both for the advice! @TeacherVolunteer your tips are really helpful. I'm going to start working on the independence skills you mentioned.

@ExperiencedMom good point about the homework routine. We'll start practicing that now.

One more question - how much Chinese should she know? We speak mostly English at home and I'm worried about the Chinese lessons.`,
    likes: 3,
    createdAt: "18 hours ago",
    isHelpful: false,
  },
  {
    id: "4",
    author: "BilingualDad",
    isAnonymous: false,
    isVolunteer: true,
    content: `@Anonymous_Parent Don't worry too much about Chinese! Many families are in the same situation.

Here are some practical tips:
- Start with basic characters for everyday items (水, 火, 人, etc.)
- Use Chinese picture books - even if she can't read, she'll get familiar with the characters
- Consider Chinese educational apps that make learning fun
- Most importantly, communicate with her P1 teacher about your concerns

Schools are very understanding about different language backgrounds at home.`,
    likes: 15,
    createdAt: "12 hours ago",
    isHelpful: true,
  },
]

const repliesZh = [
  {
    id: "1",
    author: "TeacherVolunteer",
    isAnonymous: false,
    isVolunteer: true,
    content: `作為前 K3 老師，分享一些可能有用的建議：

**學術準備：**
- 加強基礎閱讀流暢度，能讀簡單句子
- 練習清楚地寫名字與基本字
- 認識數字與簡單加減

**社交技巧：**
- 鼓勵自理，例如整理書包
- 練習遵循多步驟指示
- 練習向大人清楚表達需要

過渡是漸進的，不用太擔心！大多數孩子在第一個月就能適應。`,
    likes: 12,
    createdAt: "1 天前",
    isHelpful: true,
  },
  {
    id: "2",
    author: "ExperiencedMom",
    isAnonymous: false,
    isVolunteer: false,
    content: `我去年陪大女兒經歷過這段時間，最大變化是功課作息！

現在就建立安靜學習時間，即使只有 15-20 分鐘也好。我們發現有專屬的功課空間幫助很大。

另外，別忽略良好睡眠習慣。小一天數較長，也更容易疲倦。`,
    likes: 8,
    createdAt: "1 天前",
    isHelpful: false,
  },
  {
    id: "3",
    author: "Anonymous_Parent",
    isAnonymous: true,
    isVolunteer: false,
    content: `謝謝大家的建議！@TeacherVolunteer 你的提示很實用。我會開始練習你提到的自理能力。

@ExperiencedMom 關於功課作息的提醒很好。我們會開始練習。

還有一個問題：中文要學到什麼程度？我們在家主要說英文，我擔心中文課程。`,
    likes: 3,
    createdAt: "18 小時前",
    isHelpful: false,
  },
  {
    id: "4",
    author: "BilingualDad",
    isAnonymous: false,
    isVolunteer: true,
    content: `@Anonymous_Parent 不用太擔心中文！很多家庭情況相似。

一些實用建議：
- 先從生活常用字開始（例如：水、火、人 等）
- 多看中文圖畫書，即使不會讀，也能熟悉字形
- 可考慮有趣的中文學習 App
- 最重要的是與小一班主任溝通你的擔心

學校普遍理解家庭語言背景不同。`,
    likes: 15,
    createdAt: "12 小時前",
    isHelpful: true,
  },
]

export default function DiscussionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, i18n } = useTranslation()
  const [newReply, setNewReply] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const resolvedParams = use(params)

  const isZh = i18n.language?.startsWith('zh')
  const discussionBase = isZh ? discussionZh : discussionEn
  const discussion = { id: resolvedParams.id, ...discussionBase }
  const replies = isZh ? repliesZh : repliesEn

  const handleSubmitReply = () => {
    if (newReply.trim()) {
      // In real app, submit to API
      console.log("Submitting reply:", { content: newReply, isAnonymous })
      setNewReply("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/community" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('community.discussion.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('community.discussion.reach')}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Emma Chen - K3
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Original Post */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  {discussion.isPinned && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                      <Pin className="w-3 h-3 mr-1" />
                      {t('components.communityCard.badges.pinned')}
                    </Badge>
                  )}
                  {discussion.isPopular && (
                    <Badge variant="secondary" className="text-xs bg-accent/10 text-accent-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      {t('components.communityCard.badges.popular')}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {t('community.discussion.generalDiscussion')}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{discussion.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-muted">
                  {discussion.isAnonymous ? "A" : discussion.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {discussion.isAnonymous ? t('components.communityCard.anonymousParent') : discussion.author}
                </p>
                <p className="text-sm text-muted-foreground">{discussion.createdAt}</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground">{discussion.content}</div>
            </div>

            {/* Tags */}
            <div className="flex items-center space-x-2">
              {discussion.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Heart className="w-4 h-4 mr-1" />
                  {discussion.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {discussion.replies}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Flag className="w-4 h-4 mr-1" />
                  {t('community.discussion.report')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">{t('community.discussion.replies')} ({replies.length})</h3>

          {replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-muted">
                      {reply.isAnonymous ? "A" : reply.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-medium text-foreground">
                        {reply.isAnonymous ? t('components.communityCard.anonymousParent') : reply.author}
                      </p>
                      {reply.isVolunteer && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          <HelpCircle className="w-3 h-3 mr-1" />
                          {t('components.communityCard.badges.volunteer')}
                        </Badge>
                      )}
                      {reply.isHelpful && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {t('community.discussion.helpful')}
                        </Badge>
                      )}
                      <p className="text-sm text-muted-foreground">{reply.createdAt}</p>
                    </div>

                    <div className="prose prose-sm max-w-none mb-3">
                      <div className="whitespace-pre-wrap text-foreground">{reply.content}</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Heart className="w-4 h-4 mr-1" />
                        {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Reply className="w-4 h-4 mr-1" />
                        {t('community.discussion.postReply')}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Flag className="w-4 h-4 mr-1" />
                        {t('community.discussion.report')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('community.discussion.addReply')}</CardTitle>
            <CardDescription>{t('community.discussion.addReplyDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t('community.discussion.replyPlaceholder')}
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              rows={4}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="anonymous" className="text-sm text-muted-foreground">
                  {t('community.discussion.postAnonymously')}
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">{t('community.discussion.cancel')}</Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSubmitReply}
                  disabled={!newReply.trim()}
                >
                  {t('community.discussion.postReply')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
