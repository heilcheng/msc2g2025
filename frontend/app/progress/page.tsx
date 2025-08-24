 "use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Edit3, Volume2, TrendingUp, Smile, FileText, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react"
// Recharts temporarily removed due to React 19 compatibility issues
// import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useFontSize } from "@/app/font-size-provider"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"
import TopNavbar from "@/components/top-navbar"

// Skills data with progress and insights
const skillsDataRaw = [
  {
    name: "alphabet",
    progress: 85,
    insight: "Fantastic progress! Ready for extra practice with letter pairs like b/d.",
    icon: Edit3,
    Goal: 80,
    teacherComment: "Great improvement on lowercase shapes. Keep spacing consistent between letters.",
  },
  {
    name: "sightWords", 
    progress: 60,
    insight: "Great foundation! On track, just 15% more to go for the next milestone.",
    icon: BookOpen,
    Goal: 75,
    teacherComment: "Practice high-frequency words daily. Try flashcards during reading time.",
  },
  {
    name: "vocabulary",
    progress: 72,
    insight: "Wonderful word collection! Ahead of schedule and ready for new challenges.",
    icon: BookOpen,
    Goal: 70,
    teacherComment: "Introduce new words in conversation and ask for examples in sentences.",
  },
  {
    name: "phonemicAwareness",
    progress: 79,
    insight: "Excellent listening skills! Blending sounds beautifully every day.",
    icon: Volume2,
    Goal: 75,
    teacherComment: "Keep practicing sound blending with simple CVC words (e.g., cat, map).",
  },
  {
    name: "pointAndRead",
    progress: 91,
    insight: "Amazing confidence! Reading independently like a champion.",
    icon: BookOpen,
    Goal: 85,
    teacherComment: "Encourage finger-tracking for tricky lines to maintain steady pace.",
  },
]

// Sort skills by priority (weakest first, considering Goal benchmark)
const skillsData = skillsDataRaw
  .map(skill => ({
    ...skill,
    priority: skill.progress - skill.Goal, // Negative = needs attention
    status: skill.progress < skill.Goal ? 'needs-focus' : 'good'
  }))
  .sort((a, b) => a.priority - b.priority)

// Progress timeline data
const progressData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 71 },
  { month: "Apr", score: 74 },
  { month: "May", score: 76 },
  { month: "Jun", score: 80 },
]

// Worksheet submission records data
const worksheetRecords = [
  {
    week: 1,
    status: 'submitted',
    score: 88,
    submittedDate: '2024-01-15',
    aiReport: {
      strengths: ['良好的字母識別', '清晰的字跡'],
      improvements: ['注意 b 和 d 的區別', '增加字母間距'],
      overallProgress: '85%'
    },
    teacherComment: '進步很大！繼續保持良好的練習習慣。'
  },
  {
    week: 2,
    status: 'submitted',
    score: 92,
    submittedDate: '2024-01-22',
    aiReport: {
      strengths: ['字母形狀準確', '頁面整潔'],
      improvements: ['可以嘗試更多創意寫法'],
      overallProgress: '88%'
    },
    teacherComment: '非常棒的表現！字母寫得越來越好了。'
  },
  {
    week: 3,
    status: 'submitted',
    score: 78,
    submittedDate: '2024-01-29',
    aiReport: {
      strengths: ['努力完成所有練習'],
      improvements: ['需要更注意字母大小', '練習手寫流暢度'],
      overallProgress: '82%'
    },
    teacherComment: '這週有點急躁，慢慢寫會更好。'
  },
  {
    week: 4,
    status: 'submitted',
    score: 95,
    submittedDate: '2024-02-05',
    aiReport: {
      strengths: ['優秀的字母識別能力', '整齊的排版'],
      improvements: ['可以挑戰更複雜的詞彙'],
      overallProgress: '90%'
    },
    teacherComment: '太棒了！這是你最好的作品。'
  },
  {
    week: 5,
    status: 'submitted',
    score: 86,
    submittedDate: '2024-02-12',
    aiReport: {
      strengths: ['持續的改進', '創意思維'],
      improvements: ['注意拼寫準確性'],
      overallProgress: '87%'
    },
    teacherComment: '很有創意的答案，但要注意拼寫哦！'
  },
  {
    week: 6,
    status: 'submitted',
    score: 91,
    submittedDate: '2024-02-19',
    aiReport: {
      strengths: ['拼寫準確度提高', '字跡清楚'],
      improvements: ['可以增加詞彙量'],
      overallProgress: '89%'
    },
    teacherComment: '看到你的進步了，拼寫改善很多！'
  },
  {
    week: 7,
    status: 'submitted',
    score: 94,
    submittedDate: '2024-02-26',
    aiReport: {
      strengths: ['詞彙量增加', '語句表達清楚'],
      improvements: ['可以嘗試更長的句子'],
      overallProgress: '91%'
    },
    teacherComment: '很高興看到你嘗試新詞彙！'
  },
  {
    week: 8,
    status: 'submitted',
    score: 89,
    submittedDate: '2024-03-05',
    aiReport: {
      strengths: ['勇於嘗試複雜句子', '表達豐富'],
      improvements: ['注意語法結構'],
      overallProgress: '88%'
    },
    teacherComment: '句子寫得很好，但要注意語法。'
  },
  {
    week: 9,
    status: 'pending',
    score: null,
    submittedDate: '2024-03-12',
    aiReport: null,
    teacherComment: null
  },
  {
    week: 10,
    status: 'submitted',
    score: 97,
    submittedDate: '2024-03-19',
    aiReport: {
      strengths: ['語法準確', '創意表達', '整體組織良好'],
      improvements: ['繼續保持這個水準'],
      overallProgress: '95%'
    },
    teacherComment: '太優秀了！這是完美的作品。'
  },
  {
    week: 11,
    status: 'not_submitted',
    score: null,
    submittedDate: null,
    aiReport: null,
    teacherComment: null
  }
]

export default function ProgressPage() {
  const { t } = useTranslation('common')
  const { isLarge } = useFontSize()
  const [selectedWorksheet, setSelectedWorksheet] = useState<number | null>(null)
  
    // Use translation keys instead of static text
  const getSkillName = (skillKey: string) => t(`progress.skills.${skillKey}.name`)
  const getSkillInsight = (skillKey: string) => t(`progress.skills.${skillKey}.insight`)
  // Calculate radar chart points for pentagon (Apple iOS style - mobile optimized)
  const calculateRadarPoints = () => {
    const centerX = 180
    const centerY = 170
    const maxRadius = 70
    
    const skills = [
      { name: "alphabet", progress: 85, Goal: 80 },
      { name: "sightWords", progress: 60, Goal: 75 },
      { name: "vocabulary", progress: 72, Goal: 70 },
      { name: "phonemicAwareness", progress: 79, Goal: 75 },
      { name: "pointAndRead", progress: 91, Goal: 85 },
    ]
    
    
    return skills.map((skill, index) => {
      const angle = (index * 72 - 90) * (Math.PI / 180) // Pentagon angles (starting from top)
      const currentRadius = (skill.progress / 100) * maxRadius
      const GoalRadius = (skill.Goal / 100) * maxRadius
      
      // Data points
      const currentX = centerX + currentRadius * Math.cos(angle)
      const currentY = centerY + currentRadius * Math.sin(angle)
      const GoalX = centerX + GoalRadius * Math.cos(angle)
      const GoalY = centerY + GoalRadius * Math.sin(angle)
      
      // Grid line endpoints
      const gridX = centerX + maxRadius * Math.cos(angle)
      const gridY = centerY + maxRadius * Math.sin(angle)
      
      // Label positions with generous spacing for mobile
      const labelRadius = maxRadius + 55
      const labelX = centerX + labelRadius * Math.cos(angle)
      const labelY = centerY + labelRadius * Math.sin(angle)
      
      return { 
        current: { x: currentX, y: currentY }, 
        Goal: { x: GoalX, y: GoalY },
        grid: { x: gridX, y: gridY },
        label: { x: labelX, y: labelY },
        skill,
        angle: angle * (180 / Math.PI),
        index
      }
    })
  }

  const radarPoints = calculateRadarPoints()
  const currentPathData = radarPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.current.x} ${point.current.y}`
  ).join(' ') + ' Z'
  
  const GoalPathData = radarPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.Goal.x} ${point.Goal.y}`
  ).join(' ') + ' Z'

  const overallScore = progressData[progressData.length - 1]?.score ?? 0

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isLarge ? 'min-text-lg text-lg' : ''}`}>
      <TopNavbar />
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Removed top header per request */}
        {/* Removed separate top icon card to keep only header circle */}


        {/* Five-Dimension Radar Chart */}
        {!isLarge && (
        <>
          <h2 className="text-3xl font-bold text-black dark:text-white text-center tracking-tight mb-2">
  {t('progress.radar.title')}
</h2>
<div className="w-16 h-1 bg-primary rounded-full mx-auto mb-2"></div>
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
        <div className="space-y-6">
              
              <div className="flex justify-center w-full">
                <svg width="100%" height="280" viewBox="0 0 360 280" className="max-w-sm mx-auto">
                  {/* Definitions for Apple-style effects */}
                  <defs>
                    <filter id="chartShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                      <feOffset dx="0" dy="1" result="offset"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.08"/>
                      </feComponentTransfer>
                      <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Minimal grid pentagons (Apple Health style) */}
                  {/* Outer pentagon (100%) */}
              <polygon
                    points="180,100 235,135 215,205 145,205 125,135"
                fill="none"
                    stroke="currentColor"
                strokeWidth="1"
                    opacity="0.6"
                    className="text-gray-200 dark:text-gray-600"
              />
                  
                  {/* Middle pentagon (75%) */}
              <polygon
                    points="180,117 218,143 206,188 154,188 142,143"
                fill="none"
                    stroke="currentColor"
                strokeWidth="1"
                    opacity="0.4"
                    className="text-gray-200 dark:text-gray-600"
              />
                  
                  {/* Inner pentagon (50%) */}
              <polygon
                    points="180,135 201,152 196,170 164,170 159,152"
                fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.3"
                    className="text-gray-200 dark:text-gray-600"
                  />
                  
                  {/* Axis lines (ultra minimal) */}
                  {radarPoints.map((point, index) => (
                    <line
                      key={`axis-${index}`}
                      x1="180"
                      y1="170"
                      x2={point.grid.x}
                      y2={point.grid.y}
                      stroke="currentColor"
                strokeWidth="1"
                      opacity="0.4"
                      className="text-gray-200 dark:text-gray-600"
                    />
                  ))}
                  
                  {/* Goal level (benchmark) - Apple gray dashed */}
                  <path
                    d={GoalPathData}
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    opacity="0.6"
                  />
                  
                  {/* Current progress polygon - Duolingo green */}
                  <path
                    d={currentPathData}
                    fill="rgba(34, 197, 94, 0.10)"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    filter="url(#chartShadow)"
                  />
                  
                  {/* Data points with Apple styling */}
                  {radarPoints.map((point, index) => (
                    <circle
                      key={`point-${index}`}
                      cx={point.current.x}
                      cy={point.current.y}
                      r="3.5"
                      fill="#22c55e"
                      stroke="#ffffff"
                      strokeWidth="2"
                      filter="url(#chartShadow)"
                    />
                  ))}
                  
                  {/* Skill labels with proper positioning */}
                  {radarPoints.map((point, index) => {
                    // Fixed positions for each skill to avoid overlaps
                    const labelPositions = [
                      // Alphabet (top)
                      { x: 180, y: 65, anchor: "middle", percentY: 78 },
                      // Sight Words (top right) 
                      { x: 280, y: 120, anchor: "start", percentY: 133 },
                      // Vocabulary (bottom right)
                      { x: 280, y: 230, anchor: "start", percentY: 243 },
                      // Phonemic Awareness (bottom left)
                      { x: 80, y: 230, anchor: "end", percentY: 243 },
                      // Point-and-Read (top left)
                      { x: 80, y: 120, anchor: "end", percentY: 133 }
                    ]
                    
                    const pos = labelPositions[index]
                    
                    return (
                      <g key={`label-group-${index}`}>
                        {/* Skill name */}
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor={pos.anchor as "start" | "middle" | "end"}
                          className="fill-gray-700 dark:fill-gray-300 select-none"
                          style={{ 
                            fontSize: '10px', 
                            fontWeight: '600',
                            fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
                          }}
                        >
                          {getSkillName(point.skill.name)}
                        </text>
                        
                        {/* Percentage */}
                        <text
                          x={pos.x}
                          y={pos.percentY}
                          textAnchor={pos.anchor as "start" | "middle" | "end"}
                          className="fill-green-500 select-none"
                          style={{ 
                            fontSize: '10px', 
                            fontWeight: '700',
                            fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
                          }}
                        >
                          {point.skill.progress}%
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Clean Apple-style legend */}
                  <g>
                    {/* Current level indicator */}
                    <line x1="20" y1="260" x2="35" y2="260" stroke="#22c55e" strokeWidth="2.5" />
                    <text 
                      x="40" 
                      y="264" 
                      className="fill-gray-600 dark:fill-gray-400 select-none"
                      style={{ 
                        fontSize: '10px', 
                        fontWeight: '500',
                        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
                      }}
                    >
                      {t('progress.radar.legend.current')}
                    </text>
                    
                    {/* Goal level indicator */}
                    <line x1="140" y1="260" x2="155" y2="260" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3,3" />
                    <text 
                      x="160" 
                      y="264" 
                      className="fill-gray-600 dark:fill-gray-400 select-none"
                      style={{ 
                        fontSize: '10px', 
                        fontWeight: '500',
                        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
                      }}
                    >
                      {t('progress.radar.legend.goal')}
                    </text>
                  </g>
            </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        </>
        )}

        {/* Skills Breakdown */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-text-primary dark:text-white text-center tracking-tight mb-2">
  {t('progress.skills.title')}
</h2>
<div className="w-16 h-1 bg-primary-green rounded-full mx-auto mb-2"></div>
          <div className="space-y-4">
            {skillsData.map((skill, index) => {
              const isNeedsFocus = skill.status === 'needs-focus'
              const priorityBadge = index === 0 && isNeedsFocus ? t('progress.skills.focusFirst') : null
              
              return (
                <Card 
                  key={skill.name} 
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-ios border-0"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Icon Container - Duolingo Style */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isNeedsFocus ? 'bg-orange-50' : 'bg-primary-green/10'
                      }`}>
                        <skill.icon className={`w-6 h-6 stroke-2 ${
                          isNeedsFocus ? 'text-orange-600' : 'text-primary-green'
                        }`} />
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        {/* Title and Badge Row */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-text-primary dark:text-white text-lg">
                              {getSkillName(skill.name)}
                            </h3>
                            {priorityBadge && (
                              <Badge 
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 border-orange-200 rounded-full"
                              >
                                {priorityBadge}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Subtitle */}
                        <p className="text-text-secondary dark:text-gray-400 text-sm mb-4 font-normal">
                                                  {t('progress.skills.goalLabel')}{skill.Goal}% • 
                        {skill.progress >= skill.Goal ? (
                          <span className="text-primary-green font-medium">{t('progress.skills.aboveGoal')}</span>
                        ) : (
                          <span className="text-text-secondary dark:text-gray-400 font-medium">{t('progress.skills.onTrack', { remaining: skill.Goal - skill.progress })}</span>
                        )}
                        </p>

                        {/* Progress Bar - Duolingo Style */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                            <div
                              className={`h-4 rounded-full transition-all duration-500 ${
                                isNeedsFocus ? 'bg-orange-500' : 'bg-primary-green'
                              }`}
                              style={{ width: `${skill.progress}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold tabular-nums min-w-[3rem] text-right ${
                            isNeedsFocus ? 'text-orange-600' : 'text-primary-green'
                          }`}>
                            {skill.progress}%
                          </span>
                        </div>

                        {/* Insight Text */}
                        {!isLarge && (
                          <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed mt-3">
                            {getSkillInsight(skill.name)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Worksheet Records */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-text-primary dark:text-white text-center tracking-tight mb-2">
            {t('progress.worksheets.title')}
          </h2>
          <div className="w-16 h-1 bg-primary-green rounded-full mx-auto mb-2"></div>
          
          <div className="space-y-3">
            {worksheetRecords.map((record) => {
              const getStatusIcon = () => {
                switch (record.status) {
                  case 'submitted':
                    return <CheckCircle className="w-5 h-5 text-green-500" />
                  case 'pending':
                    return <Clock className="w-5 h-5 text-yellow-500" />
                  case 'not_submitted':
                    return <AlertCircle className="w-5 h-5 text-red-500" />
                  default:
                    return <FileText className="w-5 h-5 text-gray-400" />
                }
              }

              const getStatusText = () => {
                switch (record.status) {
                  case 'submitted':
                    return t('progress.worksheets.submitted')
                  case 'pending':
                    return t('progress.worksheets.pending')
                  case 'not_submitted':
                    return t('progress.worksheets.notSubmitted')
                  default:
                    return ''
                }
              }

              const getStatusColor = () => {
                switch (record.status) {
                  case 'submitted':
                    return 'text-green-600 dark:text-green-400'
                  case 'pending':
                    return 'text-yellow-600 dark:text-yellow-400'
                  case 'not_submitted':
                    return 'text-red-600 dark:text-red-400'
                  default:
                    return 'text-gray-500 dark:text-gray-400'
                }
              }

              return (
                <Card 
                  key={record.week}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-ios border-0"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Week and Status */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary dark:text-white text-base">
                            {t('progress.worksheets.week', { number: record.week })}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {getStatusIcon()}
                            <span className={`text-sm font-medium ${getStatusColor()}`}>
                              {getStatusText()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score and Actions */}
                      <div className="flex items-center gap-3">
                        {record.score && (
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary-green">
                              {record.score}
                            </p>
                            <p className="text-xs text-text-secondary dark:text-gray-400">
                              /100
                            </p>
                          </div>
                        )}
                        {record.status === 'submitted' && (
                          <button
                            onClick={() => setSelectedWorksheet(record.week)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Submitted Date */}
                    {record.submittedDate && (
                      <p className="text-xs text-text-secondary dark:text-gray-400 mt-2 ml-13">
                        {t('progress.worksheets.submittedOn', { date: record.submittedDate })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Worksheet Detail Modal */}
        {selectedWorksheet && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                {(() => {
                  const record = worksheetRecords.find(r => r.week === selectedWorksheet)
                  if (!record) return null

                  return (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-text-primary dark:text-white">
                          {t('progress.worksheets.week', { number: record.week })}
                        </h3>
                        <button
                          onClick={() => setSelectedWorksheet(null)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="text-gray-500 dark:text-gray-400 text-xl">×</span>
                        </button>
                      </div>

                      {/* Score */}
                      {record.score && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
                          <p className="text-center">
                            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                              {record.score}
                            </span>
                            <span className="text-green-600 dark:text-green-400 ml-1">/100</span>
                          </p>
                        </div>
                      )}

                      {/* AI Report */}
                      {record.aiReport && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-text-primary dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {t('progress.worksheets.aiReport')}
                          </h4>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                                {t('progress.worksheets.strengths')}
                              </p>
                              <ul className="text-sm text-text-secondary dark:text-gray-400 space-y-1">
                                {record.aiReport.strengths.map((strength, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">
                                {t('progress.worksheets.improvements')}
                              </p>
                              <ul className="text-sm text-text-secondary dark:text-gray-400 space-y-1">
                                {record.aiReport.improvements.map((improvement, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                              <p className="text-sm">
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  {t('progress.worksheets.overallProgress')}:
                                </span>
                                <span className="ml-2 text-text-primary dark:text-white">
                                  {record.aiReport.overallProgress}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Teacher Comment */}
                      <div>
                        <h4 className="font-semibold text-text-primary dark:text-white mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {t('progress.worksheets.teacherComment')}
                        </h4>
                        {record.teacherComment ? (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm text-text-secondary dark:text-gray-300">
                              {record.teacherComment}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            {t('progress.worksheets.noComment')}
                          </p>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* (AI Personalized Practices removed from Progress page) */}

        {/* Progress Over Time */}
        <h2 className="text-3xl font-bold text-black dark:text-white text-center tracking-tight mb-2">
  {t('progress.trend.title')}
</h2>
<div className="w-16 h-1 bg-primary rounded-full mx-auto mb-2"></div>
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-5">
        <div className="space-y-4">
          { !isLarge && <TrendingUp className="w-5 h-5 text-green-500 stroke-2" />}

              <div className="h-48 relative">
                {/* CSS Line Chart Alternative */}
                <div className="h-full flex items-end justify-between px-4 py-4">
                  {progressData.map((data, index) => (
                    <div key={data.month} className="flex flex-col items-center h-full justify-end">
                      {/* Month label */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 h-4">
                        {data.month}
                      </div>
                      {/* Progress bar */}
                      <div className="relative flex-1 flex items-end w-8">
                        <div 
                          className="w-full bg-primary-green rounded-t-lg transition-all duration-700 hover:bg-secondary-green cursor-pointer flex items-end justify-center text-white text-xs font-bold pb-1"
                          style={{ height: `${((data.score - 60) / 25) * 100}%` }}
                          title={`${data.month}: ${data.score}%`}
                        >
                          {data.score}
                        </div>
                        {/* Connection line to next point */}
                        {index < progressData.length - 1 && (
                          <div 
                            className="absolute top-0 left-full w-full h-1 bg-primary-green/30"
                            style={{
                              transform: `translateY(${100 - ((data.score - 60) / 25) * 100}%) rotate(${Math.atan2(
                                (progressData[index + 1].score - data.score) * 2, 100
                              ) * 180 / Math.PI}deg)`,
                              transformOrigin: 'left center'
                            }}
                          />
                        )}
                        {/* Data point dot */}
                        <div 
                          className="absolute w-3 h-3 bg-primary-green rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-sm"
                          style={{ 
                            top: `${100 - ((data.score - 60) / 25) * 100}%`,
                            left: '50%'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500 py-4">
                  <span>85%</span>
                  <span>80%</span>
                  <span>75%</span>
                  <span>70%</span>
                  <span>65%</span>
                  <span>60%</span>
                </div>
              </div>

              {/* Milestone markers */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t('progress.trend.milestone1')}</span>
          </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t('progress.trend.milestone2')}</span>
                </div>
              </div>
              
              {/* Motivational text */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-800 dark:text-green-300 text-center">
                  {t('progress.trend.motivation')}
                </p>
          </div>
        </div>
          </CardContent>
      </Card>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}