"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  TrendingDown, 
  Target, 
  Clock, 
  CheckCircle,
  X,
  BarChart3,
  Brain,
  Lightbulb
} from "lucide-react"
import { useFontSize } from "@/app/font-size-provider"
import { useTranslation } from "react-i18next"

interface PerformanceAlert {
  id: string
  student_id: string
  parent_id: string
  alert_type: string
  severity: string
  message: string
  trigger_data?: any
  is_resolved: boolean
  sent_to_ngo: boolean
  ngo_notified_at?: string
  created_at: string
  resolved_at?: string
}

interface AIGradingSession {
  id: string
  submission_id: string
  model_used: string
  raw_score?: number
  adjusted_score?: number
  confidence_level?: number
  grading_criteria?: any
  ai_feedback?: string
  personalized_suggestions?: string
  processing_time_ms?: number
  created_at: string
}

interface StudentAnalytics {
  recent_scores: number[]
  average_score: number
  streaks: Record<string, { current: number; longest: number }>
  improvement_trend: string
  total_submissions: number
}

interface AIGradingAlertsProps {
  userId: string
  studentId?: string
}

// Mock data for development
const mockAlerts: PerformanceAlert[] = [
  {
    id: "alert-1",
    student_id: "student-123",
    parent_id: "parent-456",
    alert_type: "low_score",
    severity: "medium",
    message: "Student scored 45% on recent English assignment. Consider additional support.",
    trigger_data: { score: 45, subject: "English" },
    is_resolved: false,
    sent_to_ngo: false,
    created_at: new Date().toISOString()
  },
  {
    id: "alert-2", 
    student_id: "student-123",
    parent_id: "parent-456",
    alert_type: "declining_performance",
    severity: "high",
    message: "Student's performance has declined from 78% to 52% average over recent assignments.",
    trigger_data: { recent_average: 52, previous_average: 78 },
    is_resolved: false,
    sent_to_ngo: true,
    ngo_notified_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
]

const mockAnalytics: StudentAnalytics = {
  recent_scores: [65, 72, 45, 58, 67, 71, 52],
  average_score: 61.4,
  streaks: {
    daily_login: { current: 5, longest: 12 },
    assignment_submission: { current: 0, longest: 8 }
  },
  improvement_trend: "declining",
  total_submissions: 15
}

const mockLatestGrading: AIGradingSession = {
  id: "grading-1",
  submission_id: "sub-123",
  model_used: "gemma",
  raw_score: 65,
  adjusted_score: 68,
  confidence_level: 0.87,
  ai_feedback: "Good effort on the reading comprehension. The student shows understanding of the main story elements. Focus on adding more detail in written responses.",
  personalized_suggestions: "Try reading similar stories together and discussing the characters' feelings. Practice writing longer sentences to express ideas more clearly.",
  processing_time_ms: 1200,
  created_at: new Date().toISOString()
}

export function AIGradingAlerts({ userId, studentId }: AIGradingAlertsProps) {
  const { t } = useTranslation()
  const { isLarge } = useFontSize()
  const [alerts, setAlerts] = useState<PerformanceAlert[]>(mockAlerts)
  const [analytics, setAnalytics] = useState<StudentAnalytics>(mockAnalytics)
  const [latestGrading, setLatestGrading] = useState<AIGradingSession>(mockLatestGrading)
  const [loading, setLoading] = useState(false)

  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 border-blue-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200"
    }
    return colors[severity] || colors.medium
  }

  const getAlertIcon = (alertType: string) => {
    const icons: Record<string, any> = {
      low_score: Target,
      declining_performance: TrendingDown,
      streak_broken: Clock,
      no_activity: AlertTriangle
    }
    const Icon = icons[alertType] || AlertTriangle
    return <Icon className="w-5 h-5" />
  }

  const getTrendColor = (trend: string): string => {
    const colors: Record<string, string> = {
      improving: "text-green-600",
      stable: "text-blue-600", 
      declining: "text-red-600"
    }
    return colors[trend] || colors.stable
  }

  const handleResolveAlert = async (alertId: string) => {
    setLoading(true)
    try {
      // In real implementation, call API
      // await fetch(`/api/grading/resolve_alert`, { method: 'POST', body: JSON.stringify({ alert_id: alertId }) })
      
      // Mock behavior
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_resolved: true, resolved_at: new Date().toISOString() }
          : alert
      ))
    } catch (error) {
      console.error('Error resolving alert:', error)
    } finally {
      setLoading(false)
    }
  }

  const unresolvedAlerts = alerts.filter(alert => !alert.is_resolved)
  const resolvedAlerts = alerts.filter(alert => alert.is_resolved)

  return (
    <div className="w-full space-y-6">
      {/* Latest AI Grading Results */}
      {latestGrading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Latest AI Grading Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {latestGrading.adjusted_score}%
                </div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((latestGrading.confidence_level || 0) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {latestGrading.processing_time_ms}ms
                </div>
                <div className="text-sm text-muted-foreground">Process Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {latestGrading.model_used.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">AI Model</div>
              </div>
            </div>
            
            {latestGrading.ai_feedback && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Feedback:</strong> {latestGrading.ai_feedback}
                </AlertDescription>
              </Alert>
            )}
            
            {latestGrading.personalized_suggestions && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Personalized Suggestions:</strong> {latestGrading.personalized_suggestions}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Student Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {analytics.average_score.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {analytics.total_submissions}
              </div>
              <div className="text-sm text-muted-foreground">Total Submissions</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getTrendColor(analytics.improvement_trend)}`}>
                {analytics.improvement_trend.charAt(0).toUpperCase() + analytics.improvement_trend.slice(1)}
              </div>
              <div className="text-sm text-muted-foreground">Trend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {analytics.streaks.daily_login?.current || 0}
              </div>
              <div className="text-sm text-muted-foreground">Login Streak</div>
            </div>
          </div>
          
          {/* Recent Scores Chart */}
          {analytics.recent_scores.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Recent Scores Trend</h4>
              <div className="flex items-end gap-2 h-32">
                {analytics.recent_scores.map((score, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(score / 100) * 100}%` }}
                    />
                    <div className="text-xs mt-1">{score}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {unresolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Active Alerts ({unresolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unresolvedAlerts.map((alert) => (
              <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.alert_type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.alert_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.sent_to_ngo && (
                          <Badge variant="destructive" className="text-xs">
                            NGO NOTIFIED
                          </Badge>
                        )}
                      </div>
                      <AlertDescription className="text-sm">
                        {alert.message}
                      </AlertDescription>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(alert.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolveAlert(alert.id)}
                    disabled={loading}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Resolve
                  </Button>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Resolved Alerts ({resolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resolvedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg opacity-60">
                {getAlertIcon(alert.alert_type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {alert.alert_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                      RESOLVED
                    </Badge>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    Resolved: {alert.resolved_at ? new Date(alert.resolved_at).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Alerts Message */}
      {alerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">All Good!</h3>
            <p className="text-muted-foreground">
              No performance alerts at this time. Keep up the great work!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
