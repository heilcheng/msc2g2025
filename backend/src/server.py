from contextlib import asynccontextmanager
from datetime import datetime
import os
import sys

from bson import ObjectId
from fastapi import FastAPI, status, UploadFile, Form, File
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn

from core import *

MONGODB_URI = os.environ["MONGODB_URI"]
DEBUG = os.environ.get("DEBUG", "").strip().lower() in {"1", "true", "on", "yes"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup:
    client = AsyncIOMotorClient(MONGODB_URI,tlsAllowInvalidCertificates=True)
    database = client.get_default_database()

    # Ensure the database is available:
    pong = await database.command("ping")
    if int(pong["ok"]) != 1:
        raise Exception("Cluster connection is not okay!")

    student_collection = database.get_collection("students")
    volunteer_collection = database.get_collection("volunteers")
    admin_collection = database.get_collection("admins")

    app.login_dal = LoginDAL(student_collection, volunteer_collection, admin_collection)

    assignment_collection = database.get_collection("assignments")

    app.assignment_dal = AssignmentDAL(assignment_collection)

    # Yield back to FastAPI Application:
    yield

    # Shutdown:
    client.close()


app = FastAPI(lifespan=lifespan, debug=DEBUG)

# -------------------------------------------  LOGIN APIS -------------------------------------------
# -------------------------------------------  sign up  -------------------------------------------
@app.post("/api/sign_up_student")
async def api_sign_u_student(newStudent: Student) -> str:
    return await app.login_dal.sign_up_student(newStudent)

@app.post("/api/sign_up_volunteer")
async def api_sign_up_volunteer(newVolunteer: Volunteer) -> str:
    return await app.login_dal.sign_up_volunteer(newVolunteer)

@app.post("/api/sign_up_admin")
async def api_sign_up_admin(newAdmin: Admin) -> str:
    return await app.login_dal.sign_up_admin(newAdmin)


# ------------------------------------------- verification -------------------------------------------
@app.post("/api/send_verification_code_student")
async def api_send_verification_code_student(student_id: str):
    return app.login_dal.send_verification_code_student(student_id)

@app.post("/api/send_verification_code_volunteer")
async def api_send_verification_code_volunteer(volunteer_id: str):
    return app.login_dal.send_verification_code_volunteer(volunteer_id)

@app.post("/api/send_verification_code_admin")
async def api_send_verification_code_admin(admin_id: str):
    return app.login_dal.send_verification_code_admin(admin_id)

@app.post("/api/verify_student")
async def api_verify_student(student_id: str, verification_code: str) -> bool:
    return await app.login_dal.verify_student(student_id, verification_code)

@app.post("/api/verify_volunteer")
async def api_verify_volunteer(volunteer_id: str, verification_code: str) -> bool:
    return await app.login_dal.verify_volunteer(volunteer_id, verification_code)

@app.post("/api/verify_admin")
async def api_verify_admin(admin_id: str, verification_code: str) -> bool:
    return await app.login_dal.verify_admin(admin_id, verification_code)

# ------------------------------------------- sign in -------------------------------------------
@app.post("/api/sign_in_student")
async def api_sign_in_student(username: str, password: str) -> bool:
    return await app.login_dal.sign_in_student(username, password)

@app.post("/api/sign_in_volunteer")
async def api_sign_in_volunteer(username: str, password: str) -> bool:
    return await app.login_dal.sign_in_volunteer(username, password)

@app.post("/api/sign_in_admin")
async def api_sign_in_admin(username: str, password: str) -> bool:
    return await app.login_dal.sign_in_admin(username, password)


# -------------------------------------------  ASSIGNMENT HUB APIS -------------------------------------------
@app.post("/api/create_assignment")
async def api_create_assignment(    
        title: str = Form(...),
        description: str = Form(...),
        due_date: datetime = Form(...),
        file: UploadFile = File(...)) -> str:
    return await app.assignment_dal.create_assignment(title, description, due_date, file)

def main(argv=sys.argv[1:]):
    try:
        uvicorn.run("server:app", host="0.0.0.0", port=3001, reload=DEBUG)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()