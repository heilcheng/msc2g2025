"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageCircle, Users, Share2, Clock, Search, Plus, HelpCircle, Heart } from "lucide-react"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

const discussionTabs = [
  { id: "help", label: "Get Help", icon: HelpCircle },
  { id: "give", label: "Give Help", icon: Heart },
  { id: "resources", label: "Shared Resources", icon: Share2 },
  { id: "groups", label: "Practice Groups", icon: Users },
]

const helpRequests = [
  {
    id: 1,
    title: "Need help with Alphabet Time Module 2",
    author: "Parent A",
    timeAgo: "2 hours ago",
    replies: 3,
    points: 50,
    category: "Alphabet Time",
  },
  {
    id: 2,
    title: "My child struggles with sight words",
    author: "Parent B",
    timeAgo: "5 hours ago",
    replies: 7,
    points: 75,
    category: "Sight Words Time",
  },
]

const giveHelpOpportunities = [
  {
    id: 1,
    title: "Looking for vocabulary practice tips",
    author: "Parent C",
    timeAgo: "1 hour ago",
    points: 100,
    category: "Vocabulary Time",
    urgent: true,
  },
  {
    id: 2,
    title: "Reading comprehension strategies needed",
    author: "Parent D",
    timeAgo: "3 hours ago",
    points: 75,
    category: "Reading Time",
    urgent: false,
  },
]

const sharedResources = [
  {
    id: 1,
    title: "Free Alphabet Flashcards PDF",
    author: "Parent E",
    downloads: 45,
    rating: 4.8,
    category: "Alphabet Time",
  },
  {
    id: 2,
    title: "Sight Words Practice Videos",
    author: "Parent F",
    downloads: 32,
    rating: 4.9,
    category: "Sight Words Time",
  },
]

const practiceGroups = [
  {
    id: 1,
    name: "Morning Alphabet Practice",
    members: 12,
    nextSession: "Tomorrow 9:00 AM",
    level: "Beginner",
  },
  {
    id: 2,
    name: "Vocabulary Builders",
    members: 8,
    nextSession: "Today 7:00 PM",
    level: "Intermediate",
  },
]

export default function DiscussionsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("help")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-orange-600" />
            {t('discussions.header')}
          </h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('discussions.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 gap-2">
          {discussionTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`flex items-center gap-2 ${activeTab === tab.id ? "bg-orange-600 hover:bg-orange-700" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs">{t(`discussions.tabs.${tab.id}`)}</span>
            </Button>
          ))}
        </div>

        {/* Get Help Tab */}
        {activeTab === "help" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t('discussions.help.title')}</h2>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-1" />
                {t('discussions.help.askQuestion')}
              </Button>
            </div>
            {helpRequests.map((request) => (
              <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 flex-1">{request.title}</h3>
                      <Badge variant="secondary" className="ml-2">
                        {request.points} pts
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{request.author}</span>
                      <span>•</span>
                      <span>{request.timeAgo}</span>
                      <span>•</span>
                      <span>{request.replies} {t('discussions.help.replies')}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {request.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Give Help Tab */}
        {activeTab === "give" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t('discussions.give.title')}</h2>
            {giveHelpOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 flex-1">{opportunity.title}</h3>
                      <div className="flex items-center gap-2">
                        {opportunity.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            {t('discussions.give.urgent')}
                          </Badge>
                        )}
                        <Badge variant="secondary">{opportunity.points} {t('discussions.give.pts')}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{opportunity.author}</span>
                      <span>•</span>
                      <span>{opportunity.timeAgo}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {opportunity.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Shared Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t('discussions.resources.title')}</h2>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-1" />
                {t('discussions.resources.share')}
              </Button>
            </div>
            {sharedResources.map((resource) => (
              <Card key={resource.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">{resource.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{t('discussions.resources.by')} {resource.author}</span>
                      <span>{resource.downloads} {t('discussions.resources.downloads')}</span>
                      <span>⭐ {resource.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Practice Groups Tab */}
        {activeTab === "groups" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t('discussions.groups.title')}</h2>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-1" />
                {t('discussions.groups.create')}
              </Button>
            </div>
            {practiceGroups.map((group) => (
              <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{group.name}</h3>
                      <Badge variant="secondary">{group.level}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.members} {t('discussions.groups.members')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{group.nextSession}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      {t('discussions.groups.join')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
