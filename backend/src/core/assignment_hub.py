# Functions related to assignment hub features
from .models import Assignment, AssignmentSubmission, AssignmentFeedback, AssignmentDiscussion
from bson import ObjectId
from pymongo import ReturnDocument
import os
from uuid import uuid4
import shutil

class AssignmentDAL:
    def __init__(self, assignment_collection, upload_dir="uploaded_assignments"):
        self.assignment_collection = assignment_collection
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    
    async def create_assignment(self, title, description, due_date, file) -> str:
        # Save file locally
        newAssignment = Assignment.model_validate({
            "title": title,
            "description": description,
            "due_date": due_date
        })
        file_location = os.path.join(self.upload_dir, str(uuid4()) + "_" + file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        newAssignment.path = file_location
        result = await self.assignment_collection.insert_one(newAssignment.model_dump())
        return str(result.inserted_id)

    # TODO: BELOW APIS
    async def get_assignment(self, assignment_id: str) -> Assignment:
        assignment_data = await self.assignment_collection.find_one({"_id": ObjectId(assignment_id)})
        if assignment_data:
            return Assignment(**assignment_data)
        return None

    async def update_assignment(self, assignment_id: str, updated_assignment: Assignment) -> bool:
        result = await self.assignment_collection.update_one(
            {"_id": ObjectId(assignment_id)},
            {"$set": updated_assignment.model_dump()}
        )
        return result.modified_count > 0

    async def delete_assignment(self, assignment_id: str) -> bool:
        result = await self.assignment_collection.delete_one({"_id": ObjectId(assignment_id)})
        return result.deleted_count > 0
