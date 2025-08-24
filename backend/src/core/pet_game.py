# RPG Pet Game System
from .models import UserPet, ExperienceLog, PetItem, UserPetItem
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from typing import List, Optional
import asyncio
from datetime import datetime, timedelta

class PetGameDAL:
    def __init__(self, 
                 pet_collection: AsyncIOMotorCollection,
                 exp_log_collection: AsyncIOMotorCollection,
                 pet_items_collection: AsyncIOMotorCollection,
                 user_pet_items_collection: AsyncIOMotorCollection):
        self.pet_collection = pet_collection
        self.exp_log_collection = exp_log_collection
        self.pet_items_collection = pet_items_collection
        self.user_pet_items_collection = user_pet_items_collection

    async def create_pet(self, user_id: str, pet_name: str = "My Learning Buddy", pet_type: str = "dragon") -> str:
        """Create a new pet for a user"""
        new_pet = UserPet(
            user_id=user_id,
            pet_name=pet_name,
            pet_type=pet_type
        )
        result = await self.pet_collection.insert_one(new_pet.model_dump())
        return str(result.inserted_id)

    async def get_user_pet(self, user_id: str) -> Optional[UserPet]:
        """Get user's pet"""
        pet_data = await self.pet_collection.find_one({"user_id": user_id})
        if pet_data:
            return UserPet(**pet_data)
        return None

    async def add_experience(self, user_id: str, activity_type: str, exp_gained: int, description: str = None) -> bool:
        """Add experience to user's pet and level up if necessary"""
        pet = await self.get_user_pet(user_id)
        if not pet:
            # Create pet if doesn't exist
            pet_id = await self.create_pet(user_id)
            pet = await self.get_user_pet(user_id)
        
        # Log the experience gain
        exp_log = ExperienceLog(
            user_id=user_id,
            pet_id=pet.id,
            activity_type=activity_type,
            exp_gained=exp_gained,
            description=description
        )
        await self.exp_log_collection.insert_one(exp_log.model_dump())
        
        # Update pet's experience and level
        new_exp = pet.experience_points + exp_gained
        new_level = self._calculate_level(new_exp)
        
        update_data = {
            "experience_points": new_exp,
            "level": new_level,
            "updated_at": datetime.now()
        }
        
        # Level up bonus - restore health and happiness
        if new_level > pet.level:
            update_data["health"] = min(100, pet.health + 20)
            update_data["happiness"] = min(100, pet.happiness + 20)
        
        result = await self.pet_collection.update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0

    def _calculate_level(self, experience: int) -> int:
        """Calculate level based on experience points"""
        # Level 1: 0-99 exp, Level 2: 100-249 exp, Level 3: 250-499 exp, etc.
        if experience < 100:
            return 1
        elif experience < 250:
            return 2
        elif experience < 500:
            return 3
        elif experience < 1000:
            return 4
        elif experience < 1750:
            return 5
        elif experience < 2750:
            return 6
        elif experience < 4000:
            return 7
        elif experience < 5500:
            return 8
        elif experience < 7500:
            return 9
        else:
            return 10 + (experience - 7500) // 1000

    async def feed_pet(self, user_id: str, item_id: str) -> bool:
        """Feed pet with an item"""
        pet = await self.get_user_pet(user_id)
        if not pet:
            return False
        
        # Check if user has the item
        user_item = await self.user_pet_items_collection.find_one({
            "user_id": user_id,
            "item_id": item_id,
            "quantity": {"$gt": 0}
        })
        
        if not user_item:
            return False
        
        # Get item details
        item_data = await self.pet_items_collection.find_one({"_id": ObjectId(item_id)})
        if not item_data:
            return False
        
        item = PetItem(**item_data)
        
        # Apply item effects
        new_health = min(100, pet.health + item.effect_health)
        new_happiness = min(100, pet.happiness + item.effect_happiness)
        
        # Update pet
        await self.pet_collection.update_one(
            {"user_id": user_id},
            {"$set": {
                "health": new_health,
                "happiness": new_happiness,
                "last_fed": datetime.now(),
                "updated_at": datetime.now()
            }}
        )
        
        # Decrease item quantity
        await self.user_pet_items_collection.update_one(
            {"user_id": user_id, "item_id": item_id},
            {"$inc": {"quantity": -1}}
        )
        
        return True

    async def buy_item(self, user_id: str, item_id: str) -> bool:
        """Buy an item with experience points"""
        pet = await self.get_user_pet(user_id)
        if not pet:
            return False
        
        # Get item details
        item_data = await self.pet_items_collection.find_one({"_id": ObjectId(item_id)})
        if not item_data:
            return False
        
        item = PetItem(**item_data)
        
        # Check if user has enough experience
        if pet.experience_points < item.cost_exp:
            return False
        
        # Deduct experience points
        await self.pet_collection.update_one(
            {"user_id": user_id},
            {"$inc": {"experience_points": -item.cost_exp},
             "$set": {"updated_at": datetime.now()}}
        )
        
        # Add item to user's inventory
        existing_item = await self.user_pet_items_collection.find_one({
            "user_id": user_id,
            "item_id": item_id
        })
        
        if existing_item:
            await self.user_pet_items_collection.update_one(
                {"user_id": user_id, "item_id": item_id},
                {"$inc": {"quantity": 1}}
            )
        else:
            new_user_item = UserPetItem(
                user_id=user_id,
                pet_id=pet.id,
                item_id=item_id,
                quantity=1
            )
            await self.user_pet_items_collection.insert_one(new_user_item.model_dump())
        
        return True

    async def get_user_items(self, user_id: str) -> List[dict]:
        """Get all items owned by user"""
        pipeline = [
            {"$match": {"user_id": user_id, "quantity": {"$gt": 0}}},
            {"$lookup": {
                "from": "pet_items",
                "localField": "item_id",
                "foreignField": "_id",
                "as": "item_details"
            }},
            {"$unwind": "$item_details"},
            {"$project": {
                "quantity": 1,
                "item": "$item_details"
            }}
        ]
        
        cursor = self.user_pet_items_collection.aggregate(pipeline)
        return await cursor.to_list(length=None)

    async def get_shop_items(self) -> List[PetItem]:
        """Get all available items in the shop"""
        cursor = self.pet_items_collection.find({"is_available": {"$ne": False}})
        items = []
        async for item_data in cursor:
            items.append(PetItem(**item_data))
        return items

    async def update_pet_status(self, user_id: str):
        """Update pet's health and happiness based on time since last activity"""
        pet = await self.get_user_pet(user_id)
        if not pet:
            return
        
        now = datetime.now()
        hours_since_fed = (now - pet.last_fed).total_seconds() / 3600
        
        # Decrease happiness over time if not fed
        if hours_since_fed > 24:
            happiness_loss = min(int(hours_since_fed / 24) * 10, pet.happiness)
            new_happiness = max(0, pet.happiness - happiness_loss)
            
            await self.pet_collection.update_one(
                {"user_id": user_id},
                {"$set": {
                    "happiness": new_happiness,
                    "updated_at": now
                }}
            )

    async def get_experience_history(self, user_id: str, limit: int = 10) -> List[ExperienceLog]:
        """Get user's recent experience gains"""
        cursor = self.exp_log_collection.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        logs = []
        async for log_data in cursor:
            logs.append(ExperienceLog(**log_data))
        return logs

# Experience points mapping for different activities
EXP_REWARDS = {
    "assignment_completion": 50,
    "perfect_score": 75,
    "streak_bonus": 25,
    "helping_others": 30,
    "daily_login": 10,
    "first_submission": 100,
    "improvement": 40,
    "participation": 20
}

def get_exp_reward(activity_type: str, bonus_multiplier: float = 1.0) -> int:
    """Get experience reward for an activity"""
    base_exp = EXP_REWARDS.get(activity_type, 10)
    return int(base_exp * bonus_multiplier)
