"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, MessageSquare, ArrowLeft, Heart, Reply, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

import { use } from "react"

export default function AssignmentDiscussionPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation()
  const [newMessage, setNewMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const resolvedParams = use(params)

  // Mock assignment data
  const assignment = {
    id: resolvedParams.id,
    title: "English Reading Comprehension",
    subject: "English",
    dueDate: "2025-08-23",
  }

  const messages = [
    {
      id: "1",
      author: "Sarah_HK",
      isAnonymous: false,
      content:
        "Emma is struggling with the reading comprehension questions. Any tips on how to help her understand the story better?",
      createdAt: "4 hours ago",
      likes: 3,
      isOriginalPoster: true,
    },
    {
      id: "2",
      author: "TeacherVolunteer",
      isAnonymous: false,
      isVolunteer: true,
      content: `Here are some strategies that work well for K3 students:

1. **Read together first** - Go through the story with your child before they attempt the questions
2. **Ask simple questions** - "Who is in the story?" "What happened first?"
3. **Use pictures** - Point to illustrations to help with understanding
4. **Break it down** - Read one paragraph at a time, then discuss

The key is to make it interactive and fun, not stressful!`,
      createdAt: "3 hours ago",
      likes: 8,
      isOriginalPoster: false,
    },
    {
      id: "3",
      author: "Anonymous_Parent",
      isAnonymous: true,
      content:
        "Thank you @TeacherVolunteer! We tried reading together and it helped so much. My son was able to answer 3 out of 5 questions correctly.",
      createdAt: "2 hours ago",
      likes: 2,
      isOriginalPoster: false,
    },
    {
      id: "4",
      author: "Creative_Dad",
      isAnonymous: false,
      content:
        "We also act out the story sometimes! My daughter loves pretending to be the characters. It really helps her remember the details.",
      createdAt: "1 hour ago",
      likes: 5,
      isOriginalPoster: false,
    },
  ]

  const handleSubmitMessage = () => {
    if (newMessage.trim()) {
      // In real app, submit to API
      console.log("Submitting message:", { content: newMessage, isAnonymous })
      setNewMessage("")
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
                <h1 className="text-xl font-bold text-foreground">{t('assignments.discussion.header')}</h1>
                <p className="text-sm text-muted-foreground">{assignment.title}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Emma Chen - K3
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Assignment Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>{assignment.title}</span>
            </CardTitle>
            <CardDescription>
              {t('assignments.discussion.help')} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{messages.length} {t('assignments.discussion.messagesCount')}</span>
              <span>•</span>
              <span>{t('assignments.discussion.lastActivity')} {messages[messages.length - 1]?.createdAt}</span>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-muted">
                      {message.isAnonymous ? "A" : message.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-medium text-foreground">
                        {message.isAnonymous ? "Anonymous Parent" : message.author}
                      </p>
                      {message.isVolunteer && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          <HelpCircle className="w-3 h-3 mr-1" />
                          Volunteer
                        </Badge>
                      )}
                      {message.isOriginalPoster && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          OP
                        </Badge>
                      )}
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{message.createdAt}</span>
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none mb-3">
                      <div className="whitespace-pre-wrap text-foreground">{message.content}</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Heart className="w-4 h-4 mr-1" />
                        {message.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Reply className="w-4 h-4 mr-1" />
                        {t('assignments.discussion.reply')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('assignments.discussion.join')}</CardTitle>
            <CardDescription>{t('assignments.discussion.joinDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t('assignments.discussion.placeholder')}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous-assignment"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="anonymous-assignment" className="text-sm text-muted-foreground">
                  {t('assignments.discussion.postAnonymously')}
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">{t('assignments.discussion.cancel')}</Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSubmitMessage}
                  disabled={!newMessage.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {t('assignments.discussion.postMessage')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <HelpCircle className="w-4 h-4" />
              <span>
                Need more help? Check out the{" "}
                <Link href="/community" className="text-primary hover:underline">
                  general community discussions
                </Link>{" "}
                or ask a{" "}
                <Link href="/community?tab=volunteers" className="text-primary hover:underline">
                  volunteer
                </Link>
                .
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
