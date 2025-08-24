# AI Grading System with Gemma
from .models import AIGradingSession, PerformanceAlert, UserStreak
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from typing import List, Optional, Dict, Any
import asyncio
import json
import time
from datetime import datetime, timedelta
import os

class AIGradingDAL:
    def __init__(self, 
                 ai_grading_collection: AsyncIOMotorCollection,
                 alerts_collection: AsyncIOMotorCollection,
                 streaks_collection: AsyncIOMotorCollection,
                 submissions_collection: AsyncIOMotorCollection,
                 students_collection: AsyncIOMotorCollection):
        self.ai_grading_collection = ai_grading_collection
        self.alerts_collection = alerts_collection
        self.streaks_collection = streaks_collection
        self.submissions_collection = submissions_collection
        self.students_collection = students_collection

    async def grade_submission(self, submission_id: str, submission_content: str, assignment_context: dict) -> AIGradingSession:
        """Grade a submission using AI and create personalized feedback"""
        start_time = time.time()
        
        # Simulate AI grading (replace with actual Gemma API call)
        grading_result = await self._call_gemma_api(submission_content, assignment_context)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        # Create grading session
        grading_session = AIGradingSession(
            submission_id=submission_id,
            model_used="gemma",
            raw_score=grading_result["raw_score"],
            adjusted_score=grading_result["adjusted_score"],
            confidence_level=grading_result["confidence"],
            grading_criteria=grading_result["criteria"],
            ai_feedback=grading_result["feedback"],
            personalized_suggestions=grading_result["suggestions"],
            processing_time_ms=processing_time
        )
        
        await self.ai_grading_collection.insert_one(grading_session.model_dump())
        
        # Check if we need to create performance alerts
        await self._check_performance_alerts(submission_id, grading_result["adjusted_score"])
        
        return grading_session

    async def _call_gemma_api(self, content: str, context: dict) -> dict:
        """Call Gemma API for grading (simulated for now)"""
        # This would be replaced with actual Gemma API integration
        # For now, we'll simulate intelligent grading
        
        await asyncio.sleep(0.5)  # Simulate API call delay
        
        # Simulate grading logic based on content analysis
        content_length = len(content.split())
        has_keywords = any(word in content.lower() for word in ["reading", "book", "story", "character"])
        
        # Base score calculation
        base_score = min(100, (content_length * 2) + (30 if has_keywords else 0))
        raw_score = max(20, base_score + (hash(content) % 20 - 10))  # Add some randomness
        
        # Adjust score based on context
        grade_level = context.get("grade_level", "K3")
        subject = context.get("subject", "English")
        
        adjustment_factor = 1.0
        if grade_level in ["K1", "K2", "K3"]:
            adjustment_factor = 1.1  # More lenient for younger students
        
        adjusted_score = min(100, raw_score * adjustment_factor)
        
        # Generate personalized feedback
        feedback = self._generate_feedback(content, adjusted_score, subject)
        suggestions = self._generate_suggestions(content, adjusted_score, grade_level)
        
        return {
            "raw_score": raw_score,
            "adjusted_score": adjusted_score,
            "confidence": 0.85,  # Simulated confidence level
            "criteria": {
                "content_relevance": min(100, content_length * 3),
                "vocabulary_usage": 75 if has_keywords else 50,
                "structure": 80,
                "creativity": hash(content) % 40 + 60
            },
            "feedback": feedback,
            "suggestions": suggestions
        }

    def _generate_feedback(self, content: str, score: float, subject: str) -> str:
        """Generate personalized feedback based on submission"""
        if score >= 90:
            return f"Excellent work! Your {subject.lower()} submission shows great understanding and creativity. Keep up the fantastic effort!"
        elif score >= 80:
            return f"Great job! Your {subject.lower()} work is well done. With a bit more detail, it could be even better!"
        elif score >= 70:
            return f"Good effort! Your {subject.lower()} submission shows you understand the topic. Try adding more examples next time."
        elif score >= 60:
            return f"Nice try! Your {subject.lower()} work is on the right track. Focus on explaining your ideas more clearly."
        else:
            return f"Keep practicing! {subject} can be challenging, but you're learning. Ask for help if you need it."

    def _generate_suggestions(self, content: str, score: float, grade_level: str) -> str:
        """Generate personalized learning suggestions"""
        suggestions = []
        
        if len(content.split()) < 10:
            suggestions.append("Try writing longer sentences to express your ideas better.")
        
        if score < 70:
            if grade_level in ["K1", "K2", "K3"]:
                suggestions.append("Practice reading picture books together with your parent.")
                suggestions.append("Try drawing a picture to go with your story.")
            else:
                suggestions.append("Review the assignment instructions carefully.")
                suggestions.append("Ask your teacher for examples of good work.")
        
        if not suggestions:
            suggestions.append("Continue practicing and exploring new vocabulary words!")
        
        return " ".join(suggestions)

    async def _check_performance_alerts(self, submission_id: str, score: float):
        """Check if performance alerts should be created"""
        # Get submission details
        submission = await self.submissions_collection.find_one({"_id": ObjectId(submission_id)})
        if not submission:
            return
        
        student_id = submission["student_id"]
        parent_id = submission["parent_id"]
        
        # Check for low score alert
        if score < 60:
            await self._create_alert(
                student_id=student_id,
                parent_id=parent_id,
                alert_type="low_score",
                severity="medium" if score >= 40 else "high",
                message=f"Student scored {score:.1f}% on recent assignment. Consider additional support.",
                trigger_data={"score": score, "submission_id": submission_id}
            )
        
        # Check for declining performance
        recent_scores = await self._get_recent_scores(student_id, limit=5)
        if len(recent_scores) >= 3:
            avg_recent = sum(recent_scores[:3]) / 3
            avg_older = sum(recent_scores[3:]) / len(recent_scores[3:]) if len(recent_scores) > 3 else avg_recent
            
            if avg_recent < avg_older - 15:  # Significant decline
                await self._create_alert(
                    student_id=student_id,
                    parent_id=parent_id,
                    alert_type="declining_performance",
                    severity="medium",
                    message=f"Student's performance has declined from {avg_older:.1f}% to {avg_recent:.1f}% average.",
                    trigger_data={"recent_average": avg_recent, "previous_average": avg_older}
                )

    async def _get_recent_scores(self, student_id: str, limit: int = 10) -> List[float]:
        """Get recent scores for a student"""
        pipeline = [
            {"$match": {"student_id": student_id, "status": "graded"}},
            {"$lookup": {
                "from": "ai_grading_sessions",
                "localField": "_id",
                "foreignField": "submission_id",
                "as": "grading"
            }},
            {"$unwind": "$grading"},
            {"$sort": {"submitted_at": -1}},
            {"$limit": limit},
            {"$project": {"score": "$grading.adjusted_score"}}
        ]
        
        cursor = self.submissions_collection.aggregate(pipeline)
        scores = []
        async for doc in cursor:
            if doc.get("score") is not None:
                scores.append(float(doc["score"]))
        
        return scores

    async def _create_alert(self, student_id: str, parent_id: str, alert_type: str, 
                          severity: str, message: str, trigger_data: dict):
        """Create a performance alert"""
        alert = PerformanceAlert(
            student_id=student_id,
            parent_id=parent_id,
            alert_type=alert_type,
            severity=severity,
            message=message,
            trigger_data=trigger_data
        )
        
        await self.alerts_collection.insert_one(alert.model_dump())
        
        # If severity is high or critical, notify NGO immediately
        if severity in ["high", "critical"]:
            await self._notify_ngo(alert)

    async def _notify_ngo(self, alert: PerformanceAlert):
        """Notify NGO/Admin about critical performance issues"""
        # Mark alert as sent to NGO
        await self.alerts_collection.update_one(
            {"_id": ObjectId(alert.id)},
            {"$set": {
                "sent_to_ngo": True,
                "ngo_notified_at": datetime.now()
            }}
        )
        
        # Here you would integrate with email/SMS service to notify NGO
        # For now, we'll just log it
        print(f"NGO ALERT: {alert.alert_type} - {alert.message}")

    async def update_streak(self, user_id: str, student_id: str, streak_type: str, successful: bool = True):
        """Update user's streak"""
        today = datetime.now().date()
        
        # Find existing streak
        streak = await self.streaks_collection.find_one({
            "user_id": user_id,
            "student_id": student_id,
            "streak_type": streak_type
        })
        
        if not streak:
            # Create new streak
            new_streak = UserStreak(
                user_id=user_id,
                student_id=student_id,
                streak_type=streak_type,
                current_streak=1 if successful else 0,
                longest_streak=1 if successful else 0,
                last_activity_date=today if successful else None
            )
            await self.streaks_collection.insert_one(new_streak.model_dump())
            return

        # Update existing streak
        streak_obj = UserStreak(**streak)
        
        if successful:
            # Check if this is consecutive
            if streak_obj.last_activity_date == today - timedelta(days=1):
                streak_obj.current_streak += 1
            elif streak_obj.last_activity_date == today:
                # Same day, don't change streak
                return
            else:
                # Streak broken, start over
                streak_obj.current_streak = 1
            
            streak_obj.last_activity_date = today
            streak_obj.longest_streak = max(streak_obj.longest_streak, streak_obj.current_streak)
        else:
            # Streak broken
            if streak_obj.current_streak > 0:
                await self._create_alert(
                    student_id=student_id,
                    parent_id=user_id,
                    alert_type="streak_broken",
                    severity="low",
                    message=f"{streak_type.replace('_', ' ').title()} streak of {streak_obj.current_streak} days was broken.",
                    trigger_data={"streak_type": streak_type, "broken_streak": streak_obj.current_streak}
                )
            streak_obj.current_streak = 0
        
        streak_obj.updated_at = datetime.now()
        
        await self.streaks_collection.update_one(
            {"user_id": user_id, "student_id": student_id, "streak_type": streak_type},
            {"$set": streak_obj.model_dump()}
        )

    async def get_user_alerts(self, user_id: str, unresolved_only: bool = True) -> List[PerformanceAlert]:
        """Get alerts for a user"""
        query = {"parent_id": user_id}
        if unresolved_only:
            query["is_resolved"] = False
        
        cursor = self.alerts_collection.find(query).sort("created_at", -1)
        alerts = []
        async for alert_data in cursor:
            alerts.append(PerformanceAlert(**alert_data))
        
        return alerts

    async def resolve_alert(self, alert_id: str) -> bool:
        """Mark an alert as resolved"""
        result = await self.alerts_collection.update_one(
            {"_id": ObjectId(alert_id)},
            {"$set": {
                "is_resolved": True,
                "resolved_at": datetime.now()
            }}
        )
        return result.modified_count > 0

    async def get_student_analytics(self, student_id: str) -> dict:
        """Get comprehensive analytics for a student"""
        # Get recent submissions and scores
        recent_scores = await self._get_recent_scores(student_id, limit=10)
        
        # Get streaks
        streaks_cursor = self.streaks_collection.find({"student_id": student_id})
        streaks = {}
        async for streak_data in streaks_cursor:
            streak = UserStreak(**streak_data)
            streaks[streak.streak_type] = {
                "current": streak.current_streak,
                "longest": streak.longest_streak
            }
        
        # Calculate trends
        improvement_trend = "stable"
        if len(recent_scores) >= 5:
            recent_avg = sum(recent_scores[:3]) / 3
            older_avg = sum(recent_scores[3:5]) / 2
            
            if recent_avg > older_avg + 5:
                improvement_trend = "improving"
            elif recent_avg < older_avg - 5:
                improvement_trend = "declining"
        
        return {
            "recent_scores": recent_scores,
            "average_score": sum(recent_scores) / len(recent_scores) if recent_scores else 0,
            "streaks": streaks,
            "improvement_trend": improvement_trend,
            "total_submissions": len(recent_scores)
        }
