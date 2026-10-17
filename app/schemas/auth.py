from typing import Optional, List, Dict, Any
import re
from pydantic import BaseModel, Field, field_validator

EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=60)
    username: str = Field(..., min_length=3, max_length=30)
    email: str = Field(...)
    password: str = Field(..., min_length=6, max_length=100)
    confirm_password: str = Field(..., min_length=6, max_length=100)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(EMAIL_PATTERN, v):
            raise ValueError("Invalid email address format.")
        return v

class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(EMAIL_PATTERN, v):
            raise ValueError("Invalid email address format.")
        return v

class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(EMAIL_PATTERN, v):
            raise ValueError("Invalid email address format.")
        return v

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class UserProfile(BaseModel):
    id: str
    full_name: str
    username: str
    email: str
    current_streak: int
    longest_streak: int
    created_at: str

class AuthResponse(BaseModel):
    token: str
    user: UserProfile
    message: str = "Success"

class SaveDraftRequest(BaseModel):
    problem_id: str
    language: str
    code: str

class BookmarkToggleRequest(BaseModel):
    problem_id: str

class ActivityUpdateRequest(BaseModel):
    problem_id: str
    language: Optional[str] = "python"

class DashboardStats(BaseModel):
    total_solved: int
    total_problems: int
    completion_percentage: float
    easy_solved: int
    easy_total: int
    medium_solved: int
    medium_total: int
    hard_solved: int
    hard_total: int
    accepted_submissions: int
    attempted_submissions: int
    current_streak: int
    longest_streak: int
    recent_submissions: List[Dict[str, Any]]
    bookmarked_problems: List[Dict[str, Any]]
    last_opened_problem: Optional[Dict[str, Any]] = None
