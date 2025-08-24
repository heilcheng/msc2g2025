#!/usr/bin/env python3
"""
Sample data insertion script for the new features:
- RPG Pet Game items and initial pet data
- Time Auction experiences
- Initial volunteer badges setup
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta

# Get MongoDB URI from environment or use default
MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/reach_hk")

async def insert_sample_data():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI, tlsAllowInvalidCertificates=True)
    database = client.get_default_database()
    
    print("🔗 Connected to MongoDB")
    
    # Pet Game Items
    pet_items = [
        {
            "name": "Magic Apple",
            "type": "food",
            "rarity": "common",
            "cost_exp": 50,
            "effect_health": 20,
            "effect_happiness": 10,
            "description": "A nutritious apple that restores health",
            "image_url": "/images/items/magic_apple.png",
            "created_at": datetime.now()
        },
        {
            "name": "Golden Toy",
            "type": "toy", 
            "rarity": "rare",
            "cost_exp": 150,
            "effect_health": 5,
            "effect_happiness": 30,
            "description": "A shiny toy that brings great joy",
            "image_url": "/images/items/golden_toy.png",
            "created_at": datetime.now()
        },
        {
            "name": "Dragon Treat",
            "type": "food",
            "rarity": "epic", 
            "cost_exp": 200,
            "effect_health": 30,
            "effect_happiness": 25,
            "description": "A special treat that dragons love",
            "image_url": "/images/items/dragon_treat.png",
            "created_at": datetime.now()
        },
        {
            "name": "Wisdom Crystal",
            "type": "accessory",
            "rarity": "legendary",
            "cost_exp": 500,
            "effect_health": 0,
            "effect_happiness": 50,
            "description": "A mystical crystal that boosts learning power",
            "image_url": "/images/items/wisdom_crystal.png",
            "created_at": datetime.now()
        },
        {
            "name": "Healing Potion",
            "type": "food",
            "rarity": "rare",
            "cost_exp": 120,
            "effect_health": 40,
            "effect_happiness": 0,
            "description": "A magical potion that fully restores health",
            "image_url": "/images/items/healing_potion.png",
            "created_at": datetime.now()
        }
    ]
    
    await database.get_collection("pet_items").insert_many(pet_items)
    print("🎮 Inserted pet game items")
    
    # Time Auction Experiences
    experiences = [
        {
            "title": "Michelin Star Cooking Class with Chef Wong",
            "description": "Learn authentic Cantonese cooking techniques from a renowned Michelin-starred chef. Master the art of dim sum and traditional stir-fry dishes.",
            "category": "culinary",
            "hours_required": 25,
            "max_participants": 8,
            "location": "Central, Hong Kong",
            "is_virtual": False,
            "experience_date": datetime.now() + timedelta(days=7),
            "registration_deadline": datetime.now() + timedelta(days=3),
            "organizer_name": "Chef Wong Kin-sang",
            "organizer_credentials": "Michelin Star Chef, 20+ years experience",
            "image_url": "/images/experiences/cooking_class.jpg",
            "is_active": True,
            "difficulty_level": "intermediate",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "title": "Entrepreneur Dinner with Tech Startup Founders",
            "description": "Join successful tech entrepreneurs for an exclusive dinner discussion about startup challenges, funding, and growth strategies.",
            "category": "business",
            "hours_required": 15,
            "max_participants": 12,
            "location": "Tsim Sha Tsui, Hong Kong",
            "is_virtual": False,
            "experience_date": datetime.now() + timedelta(days=14),
            "registration_deadline": datetime.now() + timedelta(days=10),
            "organizer_name": "Hong Kong Entrepreneurs Society",
            "organizer_credentials": "Collective of 50+ successful startup founders",
            "image_url": "/images/experiences/entrepreneur_dinner.jpg",
            "is_active": True,
            "difficulty_level": "advanced",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "title": "Traditional Chinese Calligraphy Workshop",
            "description": "Discover the meditative art of Chinese calligraphy with master calligrapher. Learn brush techniques and create your own artwork.",
            "category": "arts",
            "hours_required": 10,
            "max_participants": 15,
            "location": "Wan Chai, Hong Kong",
            "is_virtual": False,
            "experience_date": datetime.now() + timedelta(days=21),
            "registration_deadline": datetime.now() + timedelta(days=17),
            "organizer_name": "Master Li Mei-hua",
            "organizer_credentials": "Traditional Art Master, 30+ years teaching",
            "image_url": "/images/experiences/calligraphy.jpg",
            "is_active": True,
            "difficulty_level": "beginner",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "title": "Virtual Fitness Training with Olympic Coach",
            "description": "Get personalized fitness training from an Olympic-level coach. Improve your strength, endurance, and overall wellness.",
            "category": "wellness",
            "hours_required": 20,
            "max_participants": 20,
            "location": None,
            "is_virtual": True,
            "experience_date": datetime.now() + timedelta(days=10),
            "registration_deadline": datetime.now() + timedelta(days=6),
            "organizer_name": "Coach Sarah Chen",
            "organizer_credentials": "Olympic Swimming Coach, Certified Personal Trainer",
            "image_url": "/images/experiences/fitness_training.jpg",
            "is_active": True,
            "difficulty_level": "intermediate",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "title": "Tech Innovation Workshop with AI Experts",
            "description": "Explore the latest in AI and machine learning with industry experts. Learn about current trends and future possibilities.",
            "category": "technology",
            "hours_required": 30,
            "max_participants": 25,
            "location": None,
            "is_virtual": True,
            "experience_date": datetime.now() + timedelta(days=28),
            "registration_deadline": datetime.now() + timedelta(days=21),
            "organizer_name": "HK Tech Innovation Lab",
            "organizer_credentials": "Leading technology research institute",
            "image_url": "/images/experiences/ai_workshop.jpg",
            "is_active": True,
            "difficulty_level": "advanced",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]
    
    await database.get_collection("time_auction_experiences").insert_many(experiences)
    print("🎯 Inserted Time Auction experiences")
    
    print("\n✅ Sample data insertion completed successfully!")
    print("\nInserted:")
    print(f"  • {len(pet_items)} pet game items")
    print(f"  • {len(experiences)} Time Auction experiences")
    print("\n🚀 Your new features are ready to use!")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(insert_sample_data())
