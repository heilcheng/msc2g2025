from pydantic import BaseModel
from typing_extensions import List, Optional, Literal
from uuid import uuid4
from datetime import datetime

UserRole = Literal["parent", "volunteer"]

class User(BaseModel):
    id: str = str(uuid4())
    username: str
    password: str
    email: Optional[str] = None
    phone: Optional[str] = None
    verification_code: str = str(uuid4())
    role: UserRole
    verified: bool = False
    created_at: datetime = datetime.now()

class Student(BaseModel):
    name: str
    username: str
    password: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    verification_code: str = "Code" # mocked for demo, else it would be str(uuid4())
    guardian_name: str
    school: str
    scores: List[float] = []
    badges: List[int] = []
    verified: bool = False

class Volunteer(BaseModel):
    name: str
    username: str
    password: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    verification_code: str = "Code" # mocked for demo, else it would be str(uuid4())
    school: str
    volunteer_hours: float
    badges: List[str]
    verified: bool = False

class Admin(BaseModel):
    name: str
    username: str
    password: str
    verification_code: str = "Code" # mocked for demo, else it would be str(uuid4())
    verified: bool = False
    
class Assignment(BaseModel):
    title: str
    description: str
    path: Optional[str] = None  # Path to the uploaded file
    due_date: datetime

class AssignmentSubmission(BaseModel):
    assignment_id: str
    student_id: str
    submissions: List[str]
    score: float
    feedback: str

class AssignmentFeedback(BaseModel):
    assignment_id: str
    student_id: str
    feedback: str

class AssignmentDiscussion(BaseModel):
    assignment_id: str
    student_id: str
    comments: List[str] = [] # Comment ids

    
class Discussion(BaseModel):
    student_id: str
    comments: List[str] = []  # Comment ids


class Comment(BaseModel):
    student_id: str
    content: str
    attachments: List[str] = []  # List of attachment paths
    timestamp: datetime

class Badge(BaseModel):
    badge_path: str