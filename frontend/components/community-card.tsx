"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Heart, Clock, Pin, Star, HelpCircle } from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

interface Discussion {
  id: string
  title: string
  category: string
  author: string
  isAnonymous: boolean
  replies: number
  likes: number
  lastActivity: string
  isPinned?: boolean
  isPopular?: boolean
  isVolunteer?: boolean
  preview: string
}

interface CommunityCardProps {
  discussion: Discussion
}

export function CommunityCard({ discussion }: CommunityCardProps) {
  const { t } = useTranslation()
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
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
                {discussion.isVolunteer && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    <HelpCircle className="w-3 h-3 mr-1" />
                    {t('components.communityCard.badges.volunteer')}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {discussion.category}
                </Badge>
              </div>
            </div>

            <Link href={`/community/discussions/${discussion.id}`}>
              <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors mb-2">
                {discussion.title}
              </h3>
            </Link>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{discussion.preview}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>
                  {t('components.communityCard.by')}{" "}
                  <span className="font-medium">{discussion.isAnonymous ? t('components.communityCard.anonymousParent') : discussion.author}</span>
                </span>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{discussion.replies}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{discussion.likes}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{discussion.lastActivity}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
