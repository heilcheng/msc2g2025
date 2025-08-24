# Functions related to login features
from .models import Student, Volunteer, Admin
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument


class LoginDAL:
    def __init__(self, student_collection: AsyncIOMotorCollection, volunteer_collection: AsyncIOMotorCollection, admin_collection: AsyncIOMotorCollection):
        self.student_collection = student_collection
        self.volunteer_collection = volunteer_collection
        self.admin_collection = admin_collection
        self.intermediate_collections = {}
        self.admin_phone_number = ""

    def send_email(self, to_email: str, verification_code: str):
        # Logic to send email
        pass
    
    def send_sms(self, to_phone: str, verification_code: str):
        # Logic to send SMS
        pass

    async def sign_up_student(self, newStudent: Student) -> str:
        # Logic for signing up a new student
        # Add new student to database
        result = await self.student_collection.insert_one(newStudent.model_dump())
        self.intermediate_collections[str(result.inserted_id)] = newStudent
        return str(result.inserted_id)

    async def sign_up_volunteer(self, newVolunteer: Volunteer) -> str:
        # Logic for signing up a new volunteer
        # Add new volunteer to database
        result = await self.volunteer_collection.insert_one(newVolunteer.model_dump())
        self.intermediate_collections[str(result.inserted_id)] = newVolunteer
        return str(result.inserted_id)

    async def sign_up_admin(self, newAdmin: Admin) -> str:
        # Logic for signing up a new admin
        # Add new admin to database
        result = await self.admin_collection.insert_one(newAdmin.model_dump())
        self.intermediate_collections[str(result.inserted_id)] = newAdmin
        return str(result.inserted_id)

    # VERIFICATION
    def send_verification_code_student(self, student_id: str):
        if student_id in self.intermediate_collections:
            student = self.intermediate_collections[student_id]
            verification_code = student.verification_code

            if student.email:
                self.send_email(student.email, verification_code)
            elif student.phone_number:
                # Send code via SMS
                self.send_sms(student.phone_number, verification_code)
            else:
                # Send code to admin phone number
                self.send_sms(self.admin_phone_number, verification_code)
            
            return True
        else:
            return False

    def send_verification_code_volunteer(self, volunteer_id: str):
        if volunteer_id in self.intermediate_collections:
            volunteer = self.intermediate_collections[volunteer_id]
            verification_code = volunteer.verification_code

            if volunteer.email:
                self.send_email(volunteer.email, verification_code)
            elif volunteer.phone_number:
                # Send code via SMS
                self.send_sms(volunteer.phone_number, verification_code)
            return True
        else:
            return False

    def send_verification_code_admin(self, admin_id: str):
        if admin_id in self.intermediate_collections:
            admin = self.intermediate_collections[admin_id]
            verification_code = admin.verification_code
            self.send_sms(self.admin_phone_number, verification_code)
            return True
        else:
            return False

    async def verify_student(self, student_id: str, verification_code: str):
        if student_id in self.intermediate_collections:
            student = self.intermediate_collections[student_id]
            if student.verification_code == verification_code:
                student.verified = True
                # Move student from intermediate to main collection
                result = await self.student_collection.update_one({"_id": ObjectId(student_id)}, {"$set": {"verified": True}})
                del self.intermediate_collections[student_id]
                return True
        return False

    async def verify_volunteer(self, volunteer_id: str, verification_code: str):
        if volunteer_id in self.intermediate_collections:
            volunteer = self.intermediate_collections[volunteer_id]
            if volunteer.verification_code == verification_code:
                volunteer.verified = True
                # Move volunteer from intermediate to main collection
                result = await self.volunteer_collection.update_one({"_id": ObjectId(volunteer_id)}, {"$set": {"verified": True}})
                del self.intermediate_collections[volunteer_id]
                return True
        return False

    async def verify_admin(self, admin_id: str, verification_code: str):
        # Logic for verifying an admin's email/phone
        if admin_id in self.intermediate_collections:
            admin = self.intermediate_collections[admin_id]
            if admin.verification_code == verification_code:
                admin.verified = True
                # Move admin from intermediate to main collection
                result = await self.admin_collection.update_one({"_id": ObjectId(admin_id)}, {"$set": {"verified": True}})
                del self.intermediate_collections[admin_id]
                return True
        return False

    # SIGN IN
    async def sign_in_student(self, username: str, password: str):
        # Logic for signing in a student
        student = await self.student_collection.find_one({"username": username})
        if student and student["password"] == password:
            return True
        return False

    async def sign_in_volunteer(self, username: str, password: str):
        # Logic for signing in a volunteer
        volunteer = await self.volunteer_collection.find_one({"username": username})
        if volunteer and volunteer["password"] == password:
            return True
        return False


    async def sign_in_admin(self, username: str, password: str):
        # Logic for signing in an admin
        admin = await self.admin_collection.find_one({"username": username})
        if admin and admin["password"] == password:
            return True
        return False