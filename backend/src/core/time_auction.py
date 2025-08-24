# Time Auction Volunteer System
from .models import TimeAuctionExperience, VolunteerHourLog, ExperienceRegistration, VolunteerBadge
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from typing import List, Optional, Dict
from datetime import datetime, timedelta

class TimeAuctionDAL:
    def __init__(self, 
                 experiences_collection: AsyncIOMotorCollection,
                 volunteer_hours_collection: AsyncIOMotorCollection,
                 registrations_collection: AsyncIOMotorCollection,
                 badges_collection: AsyncIOMotorCollection,
                 users_collection: AsyncIOMotorCollection):
        self.experiences_collection = experiences_collection
        self.volunteer_hours_collection = volunteer_hours_collection
        self.registrations_collection = registrations_collection
        self.badges_collection = badges_collection
        self.users_collection = users_collection

    # Experience Management
    async def create_experience(self, experience_data: dict) -> str:
        """Create a new Time Auction experience"""
        experience = TimeAuctionExperience(**experience_data)
        result = await self.experiences_collection.insert_one(experience.model_dump())
        return str(result.inserted_id)

    async def get_experiences(self, category: str = None, is_virtual: bool = None, 
                            active_only: bool = True) -> List[TimeAuctionExperience]:
        """Get available experiences with optional filtering"""
        query = {}
        
        if active_only:
            query["is_active"] = True
            query["registration_deadline"] = {"$gte": datetime.now()}
        
        if category:
            query["category"] = category
        
        if is_virtual is not None:
            query["is_virtual"] = is_virtual
        
        cursor = self.experiences_collection.find(query).sort("experience_date", 1)
        experiences = []
        async for exp_data in cursor:
            experiences.append(TimeAuctionExperience(**exp_data))
        
        return experiences

    async def get_experience(self, experience_id: str) -> Optional[TimeAuctionExperience]:
        """Get a specific experience"""
        exp_data = await self.experiences_collection.find_one({"_id": ObjectId(experience_id)})
        if exp_data:
            return TimeAuctionExperience(**exp_data)
        return None

    # Volunteer Hours Management
    async def log_volunteer_hours(self, volunteer_id: str, activity_type: str, 
                                hours_earned: float, description: str = None) -> str:
        """Log volunteer hours for an activity"""
        hour_log = VolunteerHourLog(
            volunteer_id=volunteer_id,
            activity_type=activity_type,
            hours_earned=hours_earned,
            description=description
        )
        result = await self.volunteer_hours_collection.insert_one(hour_log.model_dump())
        
        # Update volunteer badges
        await self._update_volunteer_badges(volunteer_id)
        
        return str(result.inserted_id)

    async def verify_volunteer_hours(self, log_id: str, verified_by: str, 
                                   verification_notes: str = None) -> bool:
        """Verify logged volunteer hours"""
        result = await self.volunteer_hours_collection.update_one(
            {"_id": ObjectId(log_id)},
            {"$set": {
                "is_verified": True,
                "verified_by": verified_by,
                "verification_notes": verification_notes,
                "verified_at": datetime.now()
            }}
        )
        
        if result.modified_count > 0:
            # Get volunteer ID and update badges
            log_data = await self.volunteer_hours_collection.find_one({"_id": ObjectId(log_id)})
            if log_data:
                await self._update_volunteer_badges(log_data["volunteer_id"])
        
        return result.modified_count > 0

    async def get_volunteer_hours_balance(self, volunteer_id: str) -> float:
        """Get volunteer's total verified hours balance"""
        pipeline = [
            {"$match": {"volunteer_id": volunteer_id, "is_verified": True}},
            {"$group": {"_id": None, "total_hours": {"$sum": "$hours_earned"}}}
        ]
        
        result = await self.volunteer_hours_collection.aggregate(pipeline).to_list(1)
        return result[0]["total_hours"] if result else 0.0

    async def get_volunteer_hours_spent(self, volunteer_id: str) -> float:
        """Get volunteer's total hours spent on experiences"""
        pipeline = [
            {"$match": {"volunteer_id": volunteer_id, "registration_status": "completed"}},
            {"$group": {"_id": None, "total_spent": {"$sum": "$hours_spent"}}}
        ]
        
        result = await self.registrations_collection.aggregate(pipeline).to_list(1)
        return result[0]["total_spent"] if result else 0.0

    async def get_available_hours(self, volunteer_id: str) -> float:
        """Get volunteer's available hours (earned - spent)"""
        earned = await self.get_volunteer_hours_balance(volunteer_id)
        spent = await self.get_volunteer_hours_spent(volunteer_id)
        return max(0, earned - spent)

    # Experience Registration
    async def register_for_experience(self, volunteer_id: str, experience_id: str) -> bool:
        """Register volunteer for an experience"""
        # Check if experience exists and is available
        experience = await self.get_experience(experience_id)
        if not experience or not experience.is_active:
            return False
        
        # Check registration deadline
        if experience.registration_deadline and datetime.now() > experience.registration_deadline:
            return False
        
        # Check if volunteer has enough hours
        available_hours = await self.get_available_hours(volunteer_id)
        if available_hours < experience.hours_required:
            return False
        
        # Check if already registered
        existing = await self.registrations_collection.find_one({
            "experience_id": experience_id,
            "volunteer_id": volunteer_id
        })
        if existing:
            return False
        
        # Check participant limit
        current_registrations = await self.registrations_collection.count_documents({
            "experience_id": experience_id,
            "registration_status": {"$in": ["registered", "confirmed"]}
        })
        
        if current_registrations >= experience.max_participants:
            return False
        
        # Create registration
        registration = ExperienceRegistration(
            experience_id=experience_id,
            volunteer_id=volunteer_id,
            hours_spent=experience.hours_required
        )
        
        result = await self.registrations_collection.insert_one(registration.model_dump())
        return result.inserted_id is not None

    async def confirm_registration(self, registration_id: str) -> bool:
        """Confirm a registration (admin action)"""
        result = await self.registrations_collection.update_one(
            {"_id": ObjectId(registration_id)},
            {"$set": {"registration_status": "confirmed"}}
        )
        return result.modified_count > 0

    async def complete_experience(self, registration_id: str, rating: int = None, 
                                feedback: str = None) -> bool:
        """Mark experience as completed"""
        update_data = {
            "registration_status": "completed",
            "completed_at": datetime.now()
        }
        
        if rating:
            update_data["completion_rating"] = rating
        if feedback:
            update_data["feedback"] = feedback
        
        result = await self.registrations_collection.update_one(
            {"_id": ObjectId(registration_id)},
            {"$set": update_data}
        )
        
        return result.modified_count > 0

    async def cancel_registration(self, registration_id: str) -> bool:
        """Cancel a registration"""
        result = await self.registrations_collection.update_one(
            {"_id": ObjectId(registration_id)},
            {"$set": {"registration_status": "cancelled"}}
        )
        return result.modified_count > 0

    async def get_volunteer_registrations(self, volunteer_id: str) -> List[dict]:
        """Get all registrations for a volunteer with experience details"""
        pipeline = [
            {"$match": {"volunteer_id": volunteer_id}},
            {"$lookup": {
                "from": "time_auction_experiences",
                "localField": "experience_id",
                "foreignField": "_id",
                "as": "experience"
            }},
            {"$unwind": "$experience"},
            {"$sort": {"registered_at": -1}}
        ]
        
        cursor = self.registrations_collection.aggregate(pipeline)
        return await cursor.to_list(length=None)

    # Badge System
    async def _update_volunteer_badges(self, volunteer_id: str):
        """Update volunteer's badges based on their hours and performance"""
        total_hours = await self.get_volunteer_hours_balance(volunteer_id)
        
        # Calculate quality score based on ratings
        quality_score = await self._calculate_quality_score(volunteer_id)
        
        # Define badge requirements
        badge_tiers = [
            {"type": "helper", "hours": 10, "quality": 3.0},
            {"type": "mentor", "hours": 25, "quality": 3.5},
            {"type": "expert", "hours": 50, "quality": 4.0},
            {"type": "champion", "hours": 100, "quality": 4.5},
            {"type": "legend", "hours": 200, "quality": 4.8}
        ]
        
        badge_levels = ["bronze", "silver", "gold", "platinum", "diamond"]
        
        for badge_tier in badge_tiers:
            if total_hours >= badge_tier["hours"] and quality_score >= badge_tier["quality"]:
                # Determine badge level based on hours
                level_index = min(len(badge_levels) - 1, int(total_hours / badge_tier["hours"]) - 1)
                badge_level = badge_levels[level_index]
                
                # Check if badge already exists
                existing_badge = await self.badges_collection.find_one({
                    "volunteer_id": volunteer_id,
                    "badge_type": badge_tier["type"],
                    "badge_level": badge_level
                })
                
                if not existing_badge:
                    badge = VolunteerBadge(
                        volunteer_id=volunteer_id,
                        badge_type=badge_tier["type"],
                        badge_level=badge_level,
                        hours_requirement=badge_tier["hours"],
                        quality_score=quality_score
                    )
                    await self.badges_collection.insert_one(badge.model_dump())

    async def _calculate_quality_score(self, volunteer_id: str) -> float:
        """Calculate volunteer's quality score based on ratings and feedback"""
        pipeline = [
            {"$match": {
                "volunteer_id": volunteer_id,
                "registration_status": "completed",
                "completion_rating": {"$exists": True}
            }},
            {"$group": {
                "_id": None,
                "avg_rating": {"$avg": "$completion_rating"},
                "count": {"$sum": 1}
            }}
        ]
        
        result = await self.registrations_collection.aggregate(pipeline).to_list(1)
        
        if result and result[0]["count"] > 0:
            return float(result[0]["avg_rating"])
        
        return 3.0  # Default score for new volunteers

    async def get_volunteer_badges(self, volunteer_id: str) -> List[VolunteerBadge]:
        """Get all badges for a volunteer"""
        cursor = self.badges_collection.find({"volunteer_id": volunteer_id}).sort("earned_at", -1)
        badges = []
        async for badge_data in cursor:
            badges.append(VolunteerBadge(**badge_data))
        return badges

    async def get_volunteer_stats(self, volunteer_id: str) -> dict:
        """Get comprehensive volunteer statistics"""
        total_hours = await self.get_volunteer_hours_balance(volunteer_id)
        spent_hours = await self.get_volunteer_hours_spent(volunteer_id)
        available_hours = total_hours - spent_hours
        
        quality_score = await self._calculate_quality_score(volunteer_id)
        badges = await self.get_volunteer_badges(volunteer_id)
        
        # Get activity breakdown
        pipeline = [
            {"$match": {"volunteer_id": volunteer_id, "is_verified": True}},
            {"$group": {
                "_id": "$activity_type",
                "hours": {"$sum": "$hours_earned"},
                "count": {"$sum": 1}
            }}
        ]
        
        activity_cursor = self.volunteer_hours_collection.aggregate(pipeline)
        activities = {}
        async for activity in activity_cursor:
            activities[activity["_id"]] = {
                "hours": activity["hours"],
                "count": activity["count"]
            }
        
        return {
            "total_hours": total_hours,
            "spent_hours": spent_hours,
            "available_hours": available_hours,
            "quality_score": quality_score,
            "badges_count": len(badges),
            "latest_badge": badges[0] if badges else None,
            "activity_breakdown": activities
        }

    # Leaderboard
    async def get_volunteer_leaderboard(self, period: str = "all_time", limit: int = 10) -> List[dict]:
        """Get volunteer leaderboard"""
        match_stage = {"is_verified": True}
        
        if period == "this_month":
            start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            match_stage["created_at"] = {"$gte": start_of_month}
        elif period == "this_week":
            start_of_week = datetime.now() - timedelta(days=datetime.now().weekday())
            start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
            match_stage["created_at"] = {"$gte": start_of_week}
        
        pipeline = [
            {"$match": match_stage},
            {"$group": {
                "_id": "$volunteer_id",
                "total_hours": {"$sum": "$hours_earned"},
                "activity_count": {"$sum": 1}
            }},
            {"$lookup": {
                "from": "users",
                "localField": "_id",
                "foreignField": "_id",
                "as": "user"
            }},
            {"$unwind": "$user"},
            {"$sort": {"total_hours": -1}},
            {"$limit": limit},
            {"$project": {
                "volunteer_id": "$_id",
                "name": "$user.full_name",
                "total_hours": 1,
                "activity_count": 1
            }}
        ]
        
        cursor = self.volunteer_hours_collection.aggregate(pipeline)
        return await cursor.to_list(length=None)

    # Admin Functions
    async def get_pending_verifications(self) -> List[dict]:
        """Get hours that need verification"""
        pipeline = [
            {"$match": {"is_verified": False}},
            {"$lookup": {
                "from": "users",
                "localField": "volunteer_id",
                "foreignField": "_id",
                "as": "volunteer"
            }},
            {"$unwind": "$volunteer"},
            {"$sort": {"created_at": -1}}
        ]
        
        cursor = self.volunteer_hours_collection.aggregate(pipeline)
        return await cursor.to_list(length=None)
