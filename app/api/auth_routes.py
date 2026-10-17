from fastapi import APIRouter, Depends, Header, HTTPException
from typing import Optional, Dict, Any
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    UserProfile,
    SaveDraftRequest,
    BookmarkToggleRequest,
    ActivityUpdateRequest,
    DashboardStats
)
from app.services.auth_service import (
    register_user,
    login_user,
    logout_user,
    get_current_user,
    get_current_user_optional,
    create_password_reset,
    reset_password,
    save_user_draft,
    get_user_draft,
    toggle_user_bookmark,
    get_user_bookmarks,
    compute_user_dashboard
)
from app.api.routes import PROBLEMS_DATA

router = APIRouter(prefix="/auth", tags=["Authentication"])
user_router = APIRouter(prefix="/user", tags=["User Progress"])

# --- Authentication Endpoints ---

@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest):
    user_data, token = register_user(
        req.full_name,
        req.username,
        req.email,
        req.password,
        req.confirm_password
    )
    return AuthResponse(
        token=token,
        user=UserProfile(**user_data),
        message="Registration successful! Welcome to AlgoMotion."
    )

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    user_data, token = login_user(req.email, req.password)
    return AuthResponse(
        token=token,
        user=UserProfile(**user_data),
        message="Login successful."
    )

@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        logout_user(token)
    return {"message": "Logged out successfully."}

@router.get("/me", response_model=UserProfile)
def get_profile(user: Dict[str, Any] = Depends(get_current_user)):
    return UserProfile(**user)

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    token = create_password_reset(req.email)
    return {
        "message": "If an account exists with that email, a password reset link has been dispatched.",
        "reset_token_dev": token # Provided for testing / dev convenience
    }

@router.post("/reset-password")
def reset_password_endpoint(req: ResetPasswordRequest):
    reset_password(req.token, req.new_password)
    return {"message": "Password has been successfully updated. You may now log in."}


# --- Student Progress & Dashboard Endpoints ---

@user_router.get("/dashboard", response_model=DashboardStats)
def get_dashboard(user: Dict[str, Any] = Depends(get_current_user)):
    stats = compute_user_dashboard(user["id"], PROBLEMS_DATA)
    return DashboardStats(**stats)

@user_router.post("/draft")
def save_draft(req: SaveDraftRequest, user: Dict[str, Any] = Depends(get_current_user)):
    save_user_draft(user["id"], req.problem_id, req.language, req.code)
    return {"message": "Draft autosaved successfully.", "updated_at": "now"}

@user_router.get("/draft/{problem_id}/{language}")
def get_draft(problem_id: str, language: str, user: Dict[str, Any] = Depends(get_current_user)):
    code = get_user_draft(user["id"], problem_id, language)
    return {"problem_id": problem_id, "language": language, "code": code}

@user_router.post("/bookmark")
def toggle_bookmark(req: BookmarkToggleRequest, user: Dict[str, Any] = Depends(get_current_user)):
    is_bookmarked = toggle_user_bookmark(user["id"], req.problem_id)
    return {"problem_id": req.problem_id, "is_bookmarked": is_bookmarked}

@user_router.get("/bookmarks")
def list_bookmarks(user: Dict[str, Any] = Depends(get_current_user)):
    bookmarks = get_user_bookmarks(user["id"])
    return {"bookmarks": bookmarks}

@user_router.get("/progress")
def list_progress(user: Dict[str, Any] = Depends(get_current_user)):
    from app.database import get_db_connection
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT problem_id, status FROM user_progress WHERE user_id = ?", (user["id"],))
    rows = cursor.fetchall()
    conn.close()
    solved = [r["problem_id"] for r in rows if r["status"] == "solved"]
    attempted = [r["problem_id"] for r in rows if r["status"] == "attempted"]
    return {"solved": solved, "attempted": attempted}
