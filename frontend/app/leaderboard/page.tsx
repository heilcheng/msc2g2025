"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, Star, Medal, EyeOff, Eye, Flame, Clock, ArrowRight, ThumbsUp, Users, Handshake, X, TrendingDown, ChevronUp, ChevronDown, Rocket, Target, BookOpen, Upload, Play, Mic } from "lucide-react"
import { useFontSize } from "@/app/font-size-provider"
import { SkillsRadarChart } from "@/components/skills-radar-chart"
import { useTranslation } from "react-i18next"
import { useSettings } from "@/contexts/settings-context"
import TopNavbar from "@/components/top-navbar"

// League definitions
type League = 'bronze' | 'silver' | 'gold' | 'diamond'

interface Team {
  id: string;
  teamName: string;
  avatar: string;
  rank: number;
  totalScore: number;
  coopXP: number;
  lessonXP: number;
  streak: number;
  league: League;
  highFives: number;
  skills?: {
    alphabet: number;
    sightWords: number;
    vocabulary: number;
    phonemicAwareness: number;
    pointAndRead: number;
  };
}

// Mock data for different leagues
const mockTeams: Record<League, Team[]> = {
  bronze: [
    {
      id: "team1",
      teamName: "英語小勇士",
      avatar: "🦸‍♂️",
      rank: 1,
      totalScore: 1250,
      coopXP: 450,
      lessonXP: 800,
      streak: 8,
      league: 'bronze',
      highFives: 12,
      skills: { alphabet: 65, sightWords: 45, vocabulary: 58, phonemicAwareness: 62, pointAndRead: 55 }
    },
    {
      id: "team2",
      teamName: "快樂學習團",
      avatar: "🌟",
      rank: 2,
      totalScore: 1180,
      coopXP: 380,
      lessonXP: 800,
      streak: 6,
      league: 'bronze',
      highFives: 8,
      skills: { alphabet: 62, sightWords: 48, vocabulary: 55, phonemicAwareness: 60, pointAndRead: 52 }
    },
    {
      id: "team3",
      teamName: "親子探險隊",
      avatar: "🚀",
      rank: 3,
      totalScore: 1120,
      coopXP: 320,
      lessonXP: 800,
      streak: 4,
      league: 'bronze',
      highFives: 15,
      skills: { alphabet: 58, sightWords: 42, vocabulary: 50, phonemicAwareness: 58, pointAndRead: 48 }
    },
    {
      id: "team4",
      teamName: "夢想起飛",
      avatar: "✈️",
      rank: 4,
      totalScore: 1080,
      coopXP: 280,
      lessonXP: 800,
      streak: 3,
      league: 'bronze',
      highFives: 6,
      skills: { alphabet: 55, sightWords: 40, vocabulary: 48, phonemicAwareness: 55, pointAndRead: 45 }
    },
    {
      id: "team5",
      teamName: "知識寶藏",
      avatar: "💎",
      rank: 5,
      totalScore: 1020,
      coopXP: 220,
      lessonXP: 800,
      streak: 2,
      league: 'bronze',
      highFives: 4,
      skills: { alphabet: 52, sightWords: 38, vocabulary: 45, phonemicAwareness: 52, pointAndRead: 42 }
    }
  ],
  silver: [
    {
      id: "team6",
      teamName: "銀河戰士",
      avatar: "🌌",
      rank: 1,
      totalScore: 2450,
      coopXP: 850,
      lessonXP: 1600,
      streak: 15,
      league: 'silver',
      highFives: 25,
      skills: { alphabet: 75, sightWords: 70, vocabulary: 78, phonemicAwareness: 72, pointAndRead: 75 }
    },
    {
      id: "team7", 
      teamName: "智慧之光",
      avatar: "💡",
      rank: 2,
      totalScore: 2380,
      coopXP: 780,
      lessonXP: 1600,
      streak: 12,
      league: 'silver',
      highFives: 22,
      skills: { alphabet: 72, sightWords: 68, vocabulary: 75, phonemicAwareness: 70, pointAndRead: 72 }
    }
  ],
  gold: [
    {
      id: "team8",
      teamName: "黃金聯盟",
      avatar: "👑",
      rank: 1,
      totalScore: 3250,
      coopXP: 1250,
      lessonXP: 2000,
      streak: 25,
      league: 'gold',
      highFives: 45,
      skills: { alphabet: 85, sightWords: 80, vocabulary: 88, phonemicAwareness: 82, pointAndRead: 85 }
    }
  ],
  diamond: []
}

// Current user's team (for demonstration)
// Current team will use translation inside the component
const currentTeamBase = {
  id: "current",
  teamNameKey: "leaderboard.currentTeam.name",
  avatar: "👨‍👩‍👧‍👦",
  rank: 3,
  totalScore: 1120,
  coopXP: 320,
  lessonXP: 800,
  streak: 4,
  league: 'bronze',
  highFives: 15,
  skills: { alphabet: 58, sightWords: 42, vocabulary: 50, phonemicAwareness: 58, pointAndRead: 48 }
}

// League info with translation keys (names will be translated in component)
const leagueInfoBase = {
  bronze: { nameKey: "leaderboard.leagues.bronze", color: "bg-orange-600", textColor: "text-orange-600", icon: "🥉" },
  silver: { nameKey: "leaderboard.leagues.silver", color: "bg-gray-400", textColor: "text-gray-600", icon: "🥈" },
  gold: { nameKey: "leaderboard.leagues.gold", color: "bg-yellow-500", textColor: "text-yellow-600", icon: "🥇" },
  diamond: { nameKey: "leaderboard.leagues.diamond", color: "bg-blue-500", textColor: "text-blue-600", icon: "💎" }
}

export default function LeaderboardPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { leaderboardVisible } = useSettings()
  const [currentLeague, setCurrentLeague] = useState<League>('bronze')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [givenHighFives, setGivenHighFives] = useState<Set<string>>(new Set())
	const { isLarge } = useFontSize()
	const [optedOut, setOptedOut] = useState(false)

  // Redirect to home if leaderboard is disabled
  useEffect(() => {
    if (!leaderboardVisible) {
      router.push('/')
    }
  }, [leaderboardVisible, router])

  // Generate translated league info
  const leagueInfo = Object.fromEntries(
    Object.entries(leagueInfoBase).map(([key, info]) => [
      key, 
      { 
        name: t(info.nameKey),
        color: info.color,
        textColor: info.textColor,
        icon: info.icon
      }
    ])
  ) as Record<League, { name: string; color: string; textColor: string; icon: string }>

  // Generate translated current team
  const currentTeam: Team = {
    ...currentTeamBase,
    teamName: t(currentTeamBase.teamNameKey)
  } as Team

	useEffect(() => {
		try {
			const stored = localStorage.getItem("leaderboard-opt-out")
			setOptedOut(stored === "true")
		} catch {}
	}, [])

	const handleOptOut = () => {
		try {
			localStorage.setItem("leaderboard-opt-out", "true")
		} catch {}
		setOptedOut(true)
	}

	const handleOptIn = () => {
		try {
			localStorage.setItem("leaderboard-opt-out", "false")
		} catch {}
		setOptedOut(false)
	}

  const handleHighFive = (teamId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setGivenHighFives(prev => new Set([...prev, teamId]))
  }

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team)
  }

  const getPromotionZone = (teams: Team[]) => {
    return teams.slice(0, 3) // Top 3 get promoted
  }

  const getRelegationZone = (teams: Team[]) => {
    return teams.slice(-2) // Bottom 2 get relegated
  }

  const currentLeagueTeams = mockTeams[currentLeague]
  const promotionZone = getPromotionZone(currentLeagueTeams)
  const relegationZone = getRelegationZone(currentLeagueTeams)

  if (optedOut) {
	return (
      <div className="min-h-screen bg-background-light font-sf-pro">
        <TopNavbar />
        <div className="max-w-md mx-auto px-6 py-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <EyeOff className="w-16 h-16 text-text-secondary mx-auto" />
            <h1 className="text-2xl font-bold text-text-primary">{t('leaderboard.hiddenTitle')}</h1>
            <p className="text-text-secondary">{t('leaderboard.hiddenDesc')}</p>
						<Button
              onClick={handleOptIn}
              className="bg-primary-green hover:bg-primary-green/90 text-white rounded-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('leaderboard.optIn')}
						</Button>
					</div>
									</div>
								</div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light font-sf-pro">
      <TopNavbar />
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Header with League Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">{t('leaderboard.title')}</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOptOut}
              className="border-border-soft text-text-secondary hover:bg-background-light rounded-full"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              {t('leaderboard.optOut')}
            </Button>
							</div>

                    {/* League Tabs - Redesigned as engaging badges */}
          <div className="flex gap-3 p-2 bg-background-card rounded-3xl shadow-ios">
            {(Object.keys(leagueInfo) as League[]).map((league) => (
              <button
                key={league}
                onClick={() => setCurrentLeague(league)}
                className={`relative flex-1 py-3 px-4 rounded-2xl text-sm font-extrabold transition-all duration-300 transform ${
                  currentLeague === league
                    ? 'bg-primary-green text-white shadow-ios scale-105 border-b-4 border-b-green-600'
                    : 'text-text-secondary hover:bg-background-light hover:scale-102 border-b-2 border-b-transparent'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{leagueInfo[league].icon}</span>
                  <span className="text-xs font-bold leading-tight">{leagueInfo[league].name}</span>
                </div>
                {currentLeague === league && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-primary-green rounded-full"></div>
                )}
              </button>
            ))}
          </div>

                    {/* Current Team Status - Compact */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-primary-green/30 rounded-3xl shadow-ios">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="text-2xl">{currentTeam.avatar}</div>
                  <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-green rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{t('leaderboard.me')}</span>
                  </div>
										</div>
										<div className="flex-1">
                  <h3 className="font-extrabold text-base text-text-primary">{currentTeam.teamName}</h3>
                  <p className="text-sm text-text-secondary font-medium">
                    {t('leaderboard.rank', { rank: currentTeam.rank })} • {currentTeam.totalScore} {t('leaderboard.points')}
                  </p>
										</div>
                <div className="text-right bg-white/60 rounded-xl p-2">
                  <div className="text-xl font-extrabold text-primary-green">{currentTeam.streak}</div>
                  <div className="text-xs text-text-secondary font-bold">{t('leaderboard.overall.dayStreak')}</div>
										</div>
									</div>
							</CardContent>
						</Card>
        </div>

        {/* League Info and Zones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${leagueInfo[currentLeague].color}`}></div>
            <h2 className="font-bold text-text-primary">{leagueInfo[currentLeague].name}</h2>
          </div>

                    {/* Promotion Zone Info - Compact */}
          {currentLeague !== 'diamond' && (
            <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 rounded-2xl p-3 shadow-ios">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-extrabold text-base leading-tight">{t('leaderboard.promotionZone.title')}</h3>
                  <p className="text-white/90 text-xs font-medium">{t('leaderboard.promotionZone.desc')}</p>
                </div>
                <div className="text-lg">🏆</div>
              </div>
					</div>
				)}

          {/* Relegation Zone Info - Compact */}
          {currentLeague !== 'bronze' && (
            <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 rounded-2xl p-3 border border-orange-300/50 shadow-soft">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-400/30 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-orange-700" />
									</div>
									<div className="flex-1">
                  <h3 className="text-orange-800 font-extrabold text-base leading-tight">{t('leaderboard.demotionZone.title')}</h3>
                  <p className="text-orange-700 text-xs font-medium">{t('leaderboard.demotionZone.desc')}</p>
                </div>
                <div className="text-lg">⚡</div>
              </div>
            </div>
          )}
        </div>

                {/* Leaderboard - Compact Duolingo-style rows */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xl text-text-primary">{t('home.thisWeek')} {t('leaderboard.ranking')}</h3>
          
          {/* Compact list container */}
          <div className="bg-background-card rounded-3xl shadow-ios overflow-hidden">
            {currentLeagueTeams.map((team, index) => {
              const isPromotionZone = promotionZone.includes(team)
              const isRelegationZone = relegationZone.includes(team)
              const isCurrentTeam = team.id === currentTeam.id
              const hasGivenHighFive = givenHighFives.has(team.id)
              const isLastItem = index === currentLeagueTeams.length - 1

              // Determine background highlighting
              let bgClass = ''
              if (isCurrentTeam) bgClass = 'bg-green-50'
              else if (isPromotionZone) bgClass = 'bg-green-25'
              else if (isRelegationZone) bgClass = 'bg-orange-25'

              return (
                <div 
                  key={team.id}
                  className={`
                    relative py-4 px-4 cursor-pointer transition-all duration-200 hover:bg-gray-50
                    ${bgClass}
                    ${!isLastItem ? 'border-b border-gray-200' : ''}
                  `}
                  onClick={() => handleTeamClick(team)}
                >
                  {/* Single-line horizontal layout */}
                  <div className="flex items-center gap-4">
                    
                    {/* Rank Number */}
                    <div className="w-8 text-center">
                      <span className="text-lg font-extrabold text-text-secondary">
                        {team.rank}
                      </span>
                    </div>

                    {/* Avatar with Medal Overlay */}
                    <div className="relative flex-shrink-0">
                      <div className="text-2xl w-10 h-10 flex items-center justify-center">
                        {team.avatar}
                      </div>
                      {/* Medal overlay for top 3 */}
                      {team.rank <= 3 && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center">
                          <span className="text-sm">
                            {team.rank === 1 ? '🥇' : team.rank === 2 ? '🥈' : '🥉'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name & Streak - Single line */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-text-primary truncate">
                          {team.teamName}
                        </h4>
                        <div className="flex items-center gap-1 text-orange-500">
                          <Flame className="w-3 h-3" />
                          <span className="text-sm font-bold text-text-secondary">{team.streak}</span>
                        </div>
                        {isCurrentTeam && (
                          <Badge className="bg-primary-green text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                            {t('leaderboard.me')}
                          </Badge>
                        )}
                      </div>
									</div>

                    {/* Score */}
									<div className="text-right">
                      <div className="text-lg font-extrabold text-text-primary">{team.totalScore}</div>
                      <div className="text-xs text-text-secondary">{t('leaderboard.points')}</div>
                    </div>

                    {/* Hover action indicator */}
                    {!isCurrentTeam && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ThumbsUp className="w-4 h-4 text-text-secondary" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
									</div>
								</div>

        {/* Team Profile Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background-card rounded-3xl shadow-ios-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-soft/50">
                <h2 className="text-xl font-bold text-text-primary">{t('leaderboard.teamProfile')}</h2>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="w-8 h-8 rounded-full bg-background-light flex items-center justify-center hover:bg-border-soft transition-transform-colors hover:scale-105"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Team Info */}
                <div className="text-center space-y-4">
                  <div className="text-4xl">{selectedTeam.avatar}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">{selectedTeam.teamName}</h3>
                    <p className="text-text-secondary">
                      {leagueInfo[selectedTeam.league].name} • {t('leaderboard.rank', { rank: selectedTeam.rank })}
                    </p>
							</div>
                  
                                  {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-green">{selectedTeam.totalScore}</div>
                    <div className="text-xs text-text-secondary">{t('leaderboard.totalScore')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-green">{selectedTeam.streak}</div>
                    <div className="text-xs text-text-secondary">{t('leaderboard.overall.dayStreak')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-green">{selectedTeam.highFives}</div>
                    <div className="text-xs text-text-secondary">{t('leaderboard.highFives')}</div>
                  </div>
                </div>

                {/* Detailed breakdown - moved from main list */}
                <div className="mt-4 p-3 bg-gray-50 rounded-2xl">
                  <h4 className="font-bold text-text-primary text-sm mb-2">{t('leaderboard.scoreBreakdown')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-primary-green" />
                        <span className="text-text-secondary">{t('leaderboard.coopMissions')}</span>
                      </div>
                      <span className="font-bold text-text-primary">{selectedTeam.coopXP} {t('leaderboard.pointsUnit')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="text-text-secondary">{t('leaderboard.courseLearning')}</span>
										</div>
                      <span className="font-bold text-text-primary">{selectedTeam.lessonXP} {t('leaderboard.pointsUnit')}</span>
										</div>
										</div>
									</div>
					</div>

                {/* Skills Radar Chart */}
                <div className="space-y-3">
                  <h4 className="font-bold text-text-primary text-center">{t('leaderboard.learningProgress')}</h4>
                  {selectedTeam.skills && (
                    <SkillsRadarChart
                      skills={[
                        { name: "alphabet", progress: selectedTeam.skills.alphabet, Goal: 80 },
                        { name: "sightWords", progress: selectedTeam.skills.sightWords, Goal: 75 },
                        { name: "vocabulary", progress: selectedTeam.skills.vocabulary, Goal: 70 },
                        { name: "phonemicAwareness", progress: selectedTeam.skills.phonemicAwareness, Goal: 75 },
                        { name: "pointAndRead", progress: selectedTeam.skills.pointAndRead, Goal: 85 },
                      ]}
                      size="small"
                      className="bg-background-light rounded-2xl p-4"
                    />
                  )}
                </div>

                {/* High Five Button */}
                {selectedTeam.id !== currentTeam.id && (
                  <Button
                    onClick={(e) => handleHighFive(selectedTeam.id, e)}
                    disabled={givenHighFives.has(selectedTeam.id)}
                    className={`
                      w-full rounded-full font-semibold shadow-soft transition-transform-colors hover:scale-105 hover:-translate-y-1
                      ${givenHighFives.has(selectedTeam.id)
                        ? 'bg-background-light text-text-secondary cursor-not-allowed'
                        : 'bg-primary-green hover:bg-primary-green/90 text-white'
                      }
                    `}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {givenHighFives.has(selectedTeam.id) ? t('leaderboard.liked') : t('leaderboard.giveHighFive')}
						</Button>
					)}
				</div>
			</div>
          </div>
        )}
			
                {/* Bonus Tasks Section */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xl text-text-primary">{t('leaderboard.bonusTasks')}</h3>
          <p className="text-text-secondary text-sm">{t('leaderboard.bonusTasksDesc')}</p>
          
          <div className="space-y-2">
            {/* Upload Worksheet */}
            <div className="bg-background-card rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-text-primary">{t('leaderboard.bonusTask1.title')}</h4>
                  <p className="text-text-secondary text-sm">{t('leaderboard.bonusTask1.desc')}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-green">+50</div>
                  <div className="text-xs text-text-secondary">{t('leaderboard.pointsUnit')}</div>
                </div>
              </div>
            </div>

            {/* Watch Tutorial Video */}
            <div className="bg-background-card rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-text-primary">{t('leaderboard.bonusTask2.title')}</h4>
                  <p className="text-text-secondary text-sm">{t('leaderboard.bonusTask2.desc')}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-green">+30</div>
                  <div className="text-xs text-text-secondary">{t('leaderboard.pointsUnit')}</div>
                </div>
              </div>
            </div>

            {/* Pronunciation Practice */}
            <div className="bg-background-card rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Mic className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-text-primary">{t('leaderboard.bonusTask3.title')}</h4>
                  <p className="text-text-secondary text-sm">{t('leaderboard.bonusTask3.desc')}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-green">+100</div>
                  <div className="text-xs text-text-secondary">{t('leaderboard.pointsUnit')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
		</div>
	)
}