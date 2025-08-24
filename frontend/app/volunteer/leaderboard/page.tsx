"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, Star, Medal, EyeOff, Eye, Flame, Clock, ArrowRight, Heart } from "lucide-react"
import { useFontSize } from "@/app/font-size-provider"
import { useSettings } from "@/contexts/settings-context"
import "@/lib/i18n"
import { useTranslation } from "react-i18next"

const leaderboardData = [
	{ rank: 1, name: "Volunteer A", likes: 2450, streak: 15, badge: "gold" },
	{ rank: 2, name: "Volunteer B", likes: 2380, streak: 12, badge: "silver" },
	{ rank: 3, name: "Volunteer C", likes: 2250, streak: 8, badge: "bronze" },
	{ rank: 4, name: "Volunteer D", likes: 2100, streak: 10, badge: null },
	{ rank: 5, name: "Volunteer E", likes: 1950, streak: 6, badge: null },
]

const mostImprovedData = [
	{ rank: 1, name: "Volunteer F", improvement: "+450 likes", period: "This week" },
	{ rank: 2, name: "Volunteer G", improvement: "+380 likes", period: "This week" },
	{ rank: 3, name: "Volunteer H", improvement: "+320 likes", period: "This week" },
]

export default function LeaderboardPage() {
	const { t } = useTranslation()
	const router = useRouter()
	const { leaderboardVisible } = useSettings()
	const [activeTab, setActiveTab] = useState<"overall" | "improved">("overall")
	const { isLarge } = useFontSize()
	const [optedOut, setOptedOut] = useState(false)

	// Redirect to volunteer home if leaderboard is disabled
	useEffect(() => {
		if (!leaderboardVisible) {
			router.push('/volunteer')
		}
	}, [leaderboardVisible, router])

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

	const getBadgeColor = (badge: string | null) => {
		switch (badge) {
			case "gold":
				return "bg-yellow-500"
			case "silver":
				return "bg-gray-400"
			case "bronze":
				return "bg-orange-600"
			default:
				return "bg-gray-200"
		}
	}

	return (
		<div className={`min-h-screen bg-background ${isLarge ? 'min-text-lg text-lg' : ''}`}>
			<div className="max-w-md mx-auto px-4 py-6 space-y-6">
				{/* Removed Personal Stats section (Days Streak, Activity Hours, Points Earned) */}

				{/* Removed Redeem Points button/card */}

				{optedOut && (
					<Card className="duolingo-card border-0 shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-bold text-foreground">{t('leaderboard.hiddenTitle')}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">{t('leaderboard.hiddenDesc')}</p>
						</CardContent>
					</Card>
				)}

				{/* Tab Navigation */}
				{!optedOut && (
				<div className="grid grid-cols-2 gap-3">
					<Button
						variant={activeTab === "overall" ? "default" : "outline"}
						className={`duolingo-button ${isLarge ? 'py-4 text-base' : 'py-3'} ${
							activeTab === "overall" 
								? "duolingo-gradient-primary border-0 text-white shadow-lg" 
								: "border-border bg-card hover:bg-accent/50"
						}`}
						onClick={() => setActiveTab("overall")}
					>
						{!isLarge && <Heart className="w-4 h-4 mr-2" />}
						{t('Most Likes')}
					</Button>
					<Button
						variant={activeTab === "improved" ? "default" : "outline"}
						className={`duolingo-button ${isLarge ? 'py-4 text-base' : 'py-3'} ${
							activeTab === "improved" 
								? "duolingo-gradient-primary border-0 text-white shadow-lg" 
								: "border-border bg-card hover:bg-accent/50"
						}`}
						onClick={() => setActiveTab("improved")}
					>
						{!isLarge && <TrendingUp className="w-4 h-4 mr-2" />}
						{t('leaderboard.tabs.improved')}
					</Button>
				</div>
				)}

				{/* Overall Leaderboard */}
				{!optedOut && activeTab === "overall" && (
					<div className="space-y-5">
						{/* Your Rank - Moved to Top */}
						<Card className="duolingo-card border-0 shadow-lg overflow-hidden">
							<div className="duolingo-gradient-light p-5">
								<div className="flex items-center gap-4">
									<div className="flex items-center justify-center w-10 h-10 rounded-full duolingo-gradient-primary text-white shadow-lg">
										<span className="text-sm font-bold">{optedOut ? "?" : "#12"}</span>
									</div>
									<div className="flex-1">
										<p className="font-semibold text-primary">{t('leaderboard.overall.you')}</p>
										<p className="text-sm text-primary/70">5 {t('leaderboard.overall.dayStreak')}</p>
									</div>
									<div className="text-right flex items-center gap-1">
										<p className="font-bold text-primary text-lg">1250</p>
										<Heart className="w-5 h-5 text-red-600 fill-red-600 inline" />
									</div>
								</div>
							</div>
						</Card>

						<h2 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-semibold text-gray-900`}>{t('leaderboard.overall.topPerformers')}</h2>
						<Card className="duolingo-card border-0 shadow-lg">
							<CardHeader>
								{/* header moved outside */}
							</CardHeader>
							<CardContent className="space-y-3">
								{leaderboardData.map((user) => (
									<div key={user.rank} className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
										<div className="flex items-center justify-center w-10 h-10 rounded-full bg-card border-2 border-border shadow-sm">
											{user.rank <= 3 ? (
												<Medal className={`w-6 h-6 ${getBadgeColor(user.badge)} text-white rounded-full p-1`} />
											) : (
												<span className="text-sm font-bold text-muted-foreground">#{user.rank}</span>
											)}
										</div>
										<div className="flex-1">
											<p className="font-semibold text-foreground">{user.name}</p>
											<p className="text-sm text-muted-foreground">{user.streak} {t('leaderboard.overall.dayStreak')}</p>
										</div>
										<div className="text-right flex items-center gap-1">
											<p className="font-bold text-primary text-lg">{user.likes}</p>
											<Heart className="w-5 h-5 text-red-600 fill-red-600 inline" />
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				)}

				{/* Most Improved */}
				{!optedOut && activeTab === "improved" && (
					<div className="space-y-5">
						{/* Your Improvement - Moved to Top */}
						<Card className="duolingo-card border-0 shadow-lg overflow-hidden">
							<div className="duolingo-gradient-light p-5">
								<div className="flex items-center gap-4">
									<div className="flex items-center justify-center w-10 h-10 rounded-full duolingo-gradient-success text-white shadow-lg">
										<TrendingUp className="w-5 h-5" />
									</div>
									<div className="flex-1">
										<p className="font-semibold text-primary">{t('leaderboard.overall.you')}</p>
										<p className="text-sm text-primary/70">+75 likes this week</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-primary text-lg">{optedOut ? "?" : "#8"}</p>
										<p className="text-xs text-primary/70">This Week</p>
									</div>
								</div>
							</div>
						</Card>

						<h2 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-semibold text-gray-900`}>{t('leaderboard.improved.title')}</h2>
						<Card className="duolingo-card border-0 shadow-lg">
							<CardHeader>
								{/* header moved outside */}
							</CardHeader>
							<CardContent className="space-y-3">
								{mostImprovedData.map((user) => (
									<div key={user.rank} className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
										<div className="flex items-center justify-center w-10 h-10 rounded-full duolingo-gradient-success text-white shadow-lg">
											<TrendingUp className="w-5 h-5" />
										</div>
										<div className="flex-1">
											<p className="font-semibold text-foreground">{user.name}</p>
											<p className="text-sm text-muted-foreground">{user.period}</p>
										</div>
										<div className="text-right flex items-center gap-1">
											<p className="font-bold text-primary text-lg">{user.improvement.replace("pts", "likes")}</p>
											<Heart className="w-5 h-5 text-red-600 fill-red-600 inline" />
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				)}

				{/* Opt-out / Opt-in Control */}
				<div className="flex w-full">
					{!optedOut ? (
						<Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100 w-full" onClick={handleOptOut}>
							{!isLarge && <EyeOff className="w-4 h-4 mr-2" />}
							{t('leaderboard.optOut')}
						</Button>
					) : (
						<Button className="duolingo-gradient-primary border-0 text-white shadow-lg w-full" onClick={handleOptIn}>
							{!isLarge && <Eye className="w-4 h-4 mr-2" />}
							{t('leaderboard.optIn')}
						</Button>
					)}
				</div>
			</div>
			
		</div>
	)
}
