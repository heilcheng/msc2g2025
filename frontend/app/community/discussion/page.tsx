"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Bookmark, 
  Heart, 
  MessageCircle, 
  Share, 
  Send,
  User
} from "lucide-react"
import Link from "next/link"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

// Mock data for the discussion post
const discussionPostEn = {
  id: 1,
  title: "Tips for K3 to Primary 1 Transition",
  author: "Anonymous Parent",
  authorRole: "Parent",
  timestamp: "2 hours ago",
  content: "My child is moving to Primary 1 next year, and I'm worried about English readiness. How do you practice sight words at home? Any specific activities or games that worked well for your children?",
  tags: ["General", "Transition"],
  engagement: { likes: 12, replies: 8, shares: 3 },
  isLiked: false,
  isBookmarked: false
}

const discussionPostZh = {
  id: 1,
  title: "K3 升小一過渡小秘訣",
  author: "匿名家長",
  authorRole: "Parent",
  timestamp: "2 小時前",
  content: "孩子明年升小一，擔心英語準備不足。大家在家如何練習常見詞？有沒有特別有效的活動或遊戲？",
  tags: ["一般", "過渡"],
  engagement: { likes: 12, replies: 8, shares: 3 },
  isLiked: false,
  isBookmarked: false
}

// Mock replies data
const repliesEn = [
  { id: 1, author: "Sarah M.", authorRole: "Parent", timestamp: "1 hour ago", content: "We use bedtime reading — 10 min daily worked wonders for sight words. My daughter went from recognizing 5 words to 30+ in just 2 months!", likes: 8, isLiked: true },
  { id: 2, author: "Ms. Chen", authorRole: "Teacher", timestamp: "45 min ago", content: "Try flashcards with pictures! Make it a game - if they get 5 right, they choose the next bedtime story. We also joined REACH's weekly storytime group — very helpful!", likes: 15, isLiked: false, replies: [ { id: 3, author: "Anonymous Parent", authorRole: "Parent", timestamp: "30 min ago", content: "That's a great idea! Where can I find the storytime group schedule?", likes: 3, isLiked: false } ] },
  { id: 4, author: "David L.", authorRole: "Volunteer", timestamp: "20 min ago", content: "As a volunteer tutor, I've seen great results with the 'word hunt' game. Hide sight word cards around the house and let them find them. Makes learning active and fun!", likes: 6, isLiked: false }
]

const repliesZh = [
  { id: 1, author: "Sarah M.", authorRole: "Parent", timestamp: "1 小時前", content: "我們睡前閱讀—每天 10 分鐘，常見詞進步很快。女兒兩個月從 5 個到 30+！", likes: 8, isLiked: true },
  { id: 2, author: "Ms. Chen", authorRole: "Teacher", timestamp: "45 分鐘前", content: "試試帶圖片的字卡！做成遊戲—答對 5 個就讓他選睡前故事。我們也參加 REACH 每週說故事活動—很有幫助！", likes: 15, isLiked: false, replies: [ { id: 3, author: "匿名家長", authorRole: "Parent", timestamp: "30 分鐘前", content: "好主意！在哪裡可以看到說故事活動時間表？", likes: 3, isLiked: false } ] },
  { id: 4, author: "David L.", authorRole: "Volunteer", timestamp: "20 分鐘前", content: "作為義教，我很推薦『找字遊戲』。把常見詞卡片藏在家裡，讓孩子找，學習更有趣！", likes: 6, isLiked: false }
]

export default function DiscussionPost() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language?.startsWith('zh')
  const discussionPost = isZh ? discussionPostZh : discussionPostEn
  const replies = isZh ? repliesZh : repliesEn
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Link href="/community">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <ArrowLeft className="w-5 h-5 text-gray-600 stroke-2" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">{t('community.discussion.title')}</h1>
            </div>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              <Bookmark className={`w-5 h-5 stroke-2 ${discussionPost.isBookmarked ? 'text-green-600 fill-green-100' : 'text-gray-600'}`} />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Original Post */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="space-y-4">
                {/* Post Header */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600 stroke-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{discussionPost.author}</span>
                      <Badge className={`text-xs px-2 py-0.5 ${
                        discussionPost.authorRole === 'Teacher' ? 'bg-purple-100 text-white border-purple-200' :
                        discussionPost.authorRole === 'Volunteer' ? 'bg-orange-100 text-white border-orange-200' :
                        discussionPost.authorRole === 'Parent' ? 'bg-teal-100 text-white border-teal-200' :
                        'bg-green-100 text-green-700 border-green-200'
                      }`}>
                        {discussionPost.authorRole}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{discussionPost.timestamp}</span>
                  </div>
                </div>

                {/* Post Title */}
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {discussionPost.title}
                </h2>

                {/* Post Content */}
                <p className="text-gray-700 leading-relaxed">
                  {discussionPost.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {discussionPost.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary" 
                      className="bg-gray-100 text-gray-600 border-gray-200 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 group">
                      <Heart className={`w-5 h-5 stroke-2 group-hover:text-red-500 transition-colors ${
                        discussionPost.isLiked ? 'text-red-500 fill-red-100' : 'text-gray-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-600">{discussionPost.engagement.likes}</span>
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5 text-gray-500 stroke-2" />
                      <span className="text-sm font-medium text-gray-600">{discussionPost.engagement.replies}</span>
                    </div>
                    
                    <button className="flex items-center gap-1.5 group">
                      <Share className="w-5 h-5 text-gray-500 stroke-2 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-gray-600">{discussionPost.engagement.shares}</span>
                    </button>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    {t('community.discussion.followPost')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('community.discussion.replies')} ({discussionPost.engagement.replies})
            </h3>

            {replies.map((reply) => (
              <div key={reply.id} className="space-y-3">
                {/* Main Reply */}
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Reply Header */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-green-600 stroke-2" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">{reply.author}</span>
                            <Badge className={`text-xs px-2 py-0.5 ${
                              reply.authorRole === 'Teacher' ? 'bg-purple-100 text-white border-purple-200' :
                              reply.authorRole === 'Volunteer' ? 'bg-orange-100 text-white border-orange-200' :
                              reply.authorRole === 'Parent' ? 'bg-teal-100 text-white border-teal-200' :
                              'bg-green-100 text-green-700 border-green-200'
                            }`}>
                              {reply.authorRole}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{reply.timestamp}</span>
                        </div>
                      </div>

                      {/* Reply Content */}
                      <p className="text-gray-700 text-sm leading-relaxed ml-11">
                        {reply.content}
                      </p>

                      {/* Reply Actions */}
                      <div className="flex items-center gap-3 ml-11">
                        <button className="flex items-center gap-1 group">
                          <Heart className={`w-4 h-4 stroke-2 group-hover:text-red-500 transition-colors ${
                            reply.isLiked ? 'text-red-500 fill-red-100' : 'text-gray-400'
                          }`} />
                          <span className="text-xs text-gray-500">{reply.likes}</span>
                        </button>
                        
                        <button className="text-xs text-green-600 font-medium hover:text-green-700">
                          {t('community.discussion.postReply')}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Nested Replies */}
                {reply.replies && reply.replies.map((nestedReply) => (
                  <div key={nestedReply.id} className="ml-6">
                    <Card className="bg-gray-50 border-0 shadow-sm">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          {/* Nested Reply Header */}
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-3 h-3 text-green-600 stroke-2" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 text-xs">{nestedReply.author}</span>
                                <Badge className={`text-xs px-1.5 py-0.5 ${
                                  nestedReply.authorRole === 'Teacher' ? 'bg-purple-100 text-white border-purple-200' :
                                  nestedReply.authorRole === 'Volunteer' ? 'bg-orange-100 text-white border-orange-200' :
                                  nestedReply.authorRole === 'Parent' ? 'bg-teal-100 text-white border-teal-200' :
                                  'bg-green-100 text-green-700 border-green-200'
                                }`}>
                                  {nestedReply.authorRole}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500">{nestedReply.timestamp}</span>
                            </div>
                          </div>

                          {/* Nested Reply Content */}
                          <p className="text-gray-700 text-xs leading-relaxed ml-8">
                            {nestedReply.content}
                          </p>

                          {/* Nested Reply Actions */}
                          <div className="flex items-center gap-2 ml-8">
                            <button className="flex items-center gap-1 group">
                              <Heart className={`w-3 h-3 stroke-2 group-hover:text-red-500 transition-colors ${
                                nestedReply.isLiked ? 'text-red-500 fill-red-100' : 'text-gray-400'
                              }`} />
                              <span className="text-xs text-gray-500">{nestedReply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Reply Input Bar - Sticky Bottom */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-green-600 stroke-2" />
            </div>
            <div className="flex-1 relative">
              <Input 
                placeholder={t('community.discussion.writeReply')} 
                className="pr-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-green-300 rounded-full"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1 bg-primary hover:bg-primary/90 text-white rounded-full h-8 w-8 p-0"
              >
                <Send className="w-4 h-4 stroke-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
