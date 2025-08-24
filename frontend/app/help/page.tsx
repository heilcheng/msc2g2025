"use client";

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useFontSize } from "@/app/font-size-provider"
import {
  Users,
  Clock,
  Star,
  MessageCircle,
  Video,
  Heart
} from "lucide-react"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"
import TopNavbar from "@/components/top-navbar"

// Mock data for volunteers with Time Auction integration (localized)
const volunteersEn = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Former K3 Teacher",
    avatar: "👩‍🏫",
    rating: 4.9,
    hoursContributed: 42,
    timeAuctionBadge: "Gold Mentor",
    badgeColor: "bg-yellow-100 text-yellow-700",
    totalAnswers: 156,
    isOnline: true,
    specialties: ["Phonics", "Reading"],
  },
  {
    id: 2,
    name: "David Wong",
    role: "Parent of 3",
    avatar: "👨‍👨‍👧‍👦",
    rating: 4.8,
    hoursContributed: 28,
    timeAuctionBadge: "Silver Helper",
    badgeColor: "bg-gray-100 text-gray-700",
    totalAnswers: 89,
    isOnline: false,
    specialties: ["Homework Help", "Motivation"],
  },
  {
    id: 3,
    name: "Ms. Liu",
    role: "Child Psychologist",
    avatar: "👩‍⚕️",
    rating: 5.0,
    hoursContributed: 65,
    timeAuctionBadge: "Platinum Expert",
    badgeColor: "bg-purple-100 text-purple-700",
    totalAnswers: 203,
    isOnline: true,
    specialties: ["Learning Difficulties", "Development"],
  },
];

const volunteersZh = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "前 K3 老師",
    avatar: "👩‍🏫",
    rating: 4.9,
    hoursContributed: 42,
    timeAuctionBadge: "金級導師",
    badgeColor: "bg-yellow-100 text-yellow-700",
    totalAnswers: 156,
    isOnline: true,
    specialties: ["自然拼讀", "閱讀"],
  },
  {
    id: 2,
    name: "David Wong",
    role: "三孩家長",
    avatar: "👨‍👨‍👧‍👦",
    rating: 4.8,
    hoursContributed: 28,
    timeAuctionBadge: "銀級幫手",
    badgeColor: "bg-gray-100 text-gray-700",
    totalAnswers: 89,
    isOnline: false,
    specialties: ["功課協助", "學習動機"],
  },
  {
    id: 3,
    name: "Ms. Liu",
    role: "兒童心理學家",
    avatar: "👩‍⚕️",
    rating: 5.0,
    hoursContributed: 65,
    timeAuctionBadge: "白金專家",
    badgeColor: "bg-purple-100 text-purple-700",
    totalAnswers: 203,
    isOnline: true,
    specialties: ["學習困難", "發展"],
  },
];




// Mock user's volunteer progress (if they're a volunteer)
const myProgress = {
  hoursThisMonth: 12,
  hoursGoal: 20,
  totalHours: 67,
  rank: 5,
  rewardsAvailable: 3,
  nextReward: "Free REACH Workshop",
};

export default function VolunteerPage() {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const { isLarge } = useFontSize()
  const isZh = i18n.language?.startsWith('zh')
  const volunteers = isZh ? volunteersZh : volunteersEn
  const [search, setSearch] = useState("");

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        isLarge ? "min-text-lg text-lg" : ""
      }`}
    >
      <TopNavbar />
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Removed top header and start button per request */}



        {/* Removed My Impact section per request */}

        {/* Available Volunteers */}
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight mb-2">
              {t('volunteer.volunteers.title')}
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mb-2"></div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('volunteer.volunteers.search') || "Search volunteers..."}
              className="mt-4 px-4 py-2 w-full max-w-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            {volunteers
              .filter(volunteer => 
                volunteer.name.toLowerCase().includes(search.toLowerCase()) ||
                volunteer.role.toLowerCase().includes(search.toLowerCase()) ||
                volunteer.specialties.some(specialty => specialty.toLowerCase().includes(search.toLowerCase()))
              )
              .map((volunteer) => (
              <Card key={volunteer.id} className="bg-white border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Volunteer Header */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-lg">
                        {volunteer.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{volunteer.name}</h3>
                          {volunteer.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{volunteer.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 stroke-2" />
                          <span className="text-sm font-medium text-gray-700">{volunteer.rating}</span>
                          <span className="text-sm text-gray-500">• {volunteer.totalAnswers} {t('volunteer.volunteers.answers')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Removed Time Auction badge & hours per request */}

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1">
                      {volunteer.specialties.map((specialty) => (
                        <Badge 
                          key={specialty}
                          variant="outline" 
                          className="text-xs border-gray-200 text-gray-600"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons: call & video next to message */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
                        disabled={!volunteer.isOnline}
                      >
                        <MessageCircle className="w-4 h-4 mr-2 stroke-2" />
                        {volunteer.isOnline ? t('volunteer.volunteers.answerQuestions') : t('volunteer.volunteers.offline')}
                      </Button>
                      <Button 
                        variant="outline"
                        className="px-3 border-gray-200"
                        disabled={!volunteer.isOnline}
                        aria-label="Call"
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        className="px-3 border-gray-200"
                        disabled={!volunteer.isOnline}
                        aria-label="Video"
                      >
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
