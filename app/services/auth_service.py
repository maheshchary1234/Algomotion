import uuid
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, Header, Depends
from app.database import get_db_connection, hash_password, verify_password
from app.schemas.auth import UserProfile, DashboardStats

SESSION_DAYS = 30

def get_current_user_optional(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    """Extracts authenticated user from Authorization header if present."""
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        return None

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.full_name, u.username, u.email, u.current_streak, u.longest_streak, u.created_at, s.expires_at
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    # Check expiration
    expires_at = datetime.fromisoformat(row["expires_at"])
    if datetime.utcnow() > expires_at:
        return None

    return {
        "id": row["id"],
        "full_name": row["full_name"],
        "username": row["username"],
        "email": row["email"],
        "current_streak": row["current_streak"],
        "longest_streak": row["longest_streak"],
        "created_at": row["created_at"],
    }

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Strict authentication dependency."""
    user = get_current_user_optional(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required. Please log in.")
    return user

def register_user(full_name: str, username: str, email: str, password: str, confirm_password: str) -> tuple[Dict[str, Any], str]:
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    email_clean = email.strip().lower()
    username_clean = username.strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check duplicate email
    cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    # Check duplicate username
    cursor.execute("SELECT id FROM users WHERE username = ?", (username_clean,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username is already taken. Please choose another.")

    user_id = f"user-{uuid.uuid4().hex[:12]}"
    pwd_hash, salt = hash_password(password)
    now_str = datetime.utcnow().isoformat()
    today_str = datetime.utcnow().strftime("%Y-%m-%d")

    cursor.execute("""
        INSERT INTO users (id, full_name, username, email, password_hash, salt, created_at, current_streak, longest_streak, last_active_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    """, (user_id, full_name.strip(), username_clean, email_clean, pwd_hash, salt, now_str, today_str))

    # Create session
    token = secrets.token_urlsafe(32)
    expires_at = (datetime.utcnow() + timedelta(days=SESSION_DAYS)).isoformat()
    cursor.execute("""
        INSERT INTO sessions (token, user_id, created_at, expires_at)
        VALUES (?, ?, ?, ?)
    """, (token, user_id, now_str, expires_at))

    conn.commit()
    conn.close()

    user_data = {
        "id": user_id,
        "full_name": full_name.strip(),
        "username": username_clean,
        "email": email_clean,
        "current_streak": 1,
        "longest_streak": 1,
        "created_at": now_str,
    }
    return user_data, token

def login_user(email: str, password: str) -> tuple[Dict[str, Any], str]:
    email_clean = email.strip().lower()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, full_name, username, email, password_hash, salt, created_at, current_streak, longest_streak, last_active_date
        FROM users
        WHERE email = ?
    """, (email_clean,))
    row = cursor.fetchone()

    if not row or not verify_password(password, row["password_hash"], row["salt"]):
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    user_id = row["id"]
    now = datetime.utcnow()
    now_str = now.isoformat()
    today_str = now.strftime("%Y-%m-%d")
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    last_active = row["last_active_date"]
    current_streak = row["current_streak"]
    longest_streak = row["longest_streak"]

    if last_active == yesterday_str:
        current_streak += 1
        if current_streak > longest_streak:
            longest_streak = current_streak
    elif last_active != today_str:
        # Streak reset
        current_streak = 1

    cursor.execute("""
        UPDATE users
        SET current_streak = ?, longest_streak = ?, last_active_date = ?
        WHERE id = ?
    """, (current_streak, longest_streak, today_str, user_id))

    # Create fresh session token
    token = secrets.token_urlsafe(32)
    expires_at = (now + timedelta(days=SESSION_DAYS)).isoformat()
    cursor.execute("""
        INSERT INTO sessions (token, user_id, created_at, expires_at)
        VALUES (?, ?, ?, ?)
    """, (token, user_id, now_str, expires_at))

    conn.commit()
    conn.close()

    user_data = {
        "id": user_id,
        "full_name": row["full_name"],
        "username": row["username"],
        "email": row["email"],
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "created_at": row["created_at"],
    }
    return user_data, token

def logout_user(token: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
    conn.commit()
    conn.close()

def create_password_reset(email: str) -> str:
    email_clean = email.strip().lower()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        # To prevent user enumeration, return success message even if not found
        return "reset-simulation"

    user_id = row["id"]
    token = secrets.token_urlsafe(24)
    expires_at = (datetime.utcnow() + timedelta(hours=2)).isoformat()
    cursor.execute("""
        INSERT INTO password_resets (id, user_id, token, expires_at, used)
        VALUES (?, ?, ?, ?, 0)
    """, (f"pr-{uuid.uuid4().hex[:8]}", user_id, token, expires_at))
    conn.commit()
    conn.close()
    return token

def reset_password(token: str, new_password: str):
    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT user_id, expires_at, used FROM password_resets WHERE token = ?
    """, (token,))
    row = cursor.fetchone()

    if not row or row["used"] == 1:
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    if datetime.utcnow() > datetime.fromisoformat(row["expires_at"]):
        conn.close()
        raise HTTPException(status_code=400, detail="Password reset token has expired.")

    user_id = row["user_id"]
    pwd_hash, salt = hash_password(new_password)

    cursor.execute("""
        UPDATE users SET password_hash = ?, salt = ? WHERE id = ?
    """, (pwd_hash, salt, user_id))

    cursor.execute("UPDATE password_resets SET used = 1 WHERE token = ?", (token,))
    # Invalidate old sessions
    cursor.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))

    conn.commit()
    conn.close()

def save_user_draft(user_id: str, problem_id: str, language: str, code: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT INTO user_code_drafts (id, user_id, problem_id, language, code, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, problem_id, language) DO UPDATE SET
            code = excluded.code,
            updated_at = excluded.updated_at
    """, (f"draft-{uuid.uuid4().hex[:8]}", user_id, problem_id, language, code, now_str))

    # Also update last active problem
    cursor.execute("""
        INSERT INTO user_activity (user_id, last_problem_id, last_language, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            last_problem_id = excluded.last_problem_id,
            last_language = excluded.last_language,
            updated_at = excluded.updated_at
    """, (user_id, problem_id, language, now_str))

    conn.commit()
    conn.close()

def get_user_draft(user_id: str, problem_id: str, language: str) -> Optional[str]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT code FROM user_code_drafts WHERE user_id = ? AND problem_id = ? AND language = ?
    """, (user_id, problem_id, language))
    row = cursor.fetchone()
    conn.close()
    return row["code"] if row else None

def toggle_user_bookmark(user_id: str, problem_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM user_bookmarks WHERE user_id = ? AND problem_id = ?", (user_id, problem_id))
    row = cursor.fetchone()
    is_bookmarked = False
    if row:
        cursor.execute("DELETE FROM user_bookmarks WHERE user_id = ? AND problem_id = ?", (user_id, problem_id))
        is_bookmarked = False
    else:
        cursor.execute("""
            INSERT INTO user_bookmarks (id, user_id, problem_id, created_at)
            VALUES (?, ?, ?, ?)
        """, (f"bm-{uuid.uuid4().hex[:8]}", user_id, problem_id, datetime.utcnow().isoformat()))
        is_bookmarked = True
    conn.commit()
    conn.close()
    return is_bookmarked

def get_user_bookmarks(user_id: str) -> List[str]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT problem_id FROM user_bookmarks WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [r["problem_id"] for r in rows]

def mark_problem_progress(user_id: str, problem_id: str, is_accepted: bool):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.utcnow().isoformat()
    if is_accepted:
        cursor.execute("""
            INSERT INTO user_progress (id, user_id, problem_id, status, solved_at)
            VALUES (?, ?, ?, 'solved', ?)
            ON CONFLICT(user_id, problem_id) DO UPDATE SET
                status = 'solved',
                solved_at = excluded.solved_at
        """, (f"prog-{uuid.uuid4().hex[:8]}", user_id, problem_id, now_str))
    else:
        # Check if already solved
        cursor.execute("SELECT status FROM user_progress WHERE user_id = ? AND problem_id = ?", (user_id, problem_id))
        row = cursor.fetchone()
        if not row or row["status"] != 'solved':
            cursor.execute("""
                INSERT INTO user_progress (id, user_id, problem_id, status, solved_at)
                VALUES (?, ?, ?, 'attempted', ?)
                ON CONFLICT(user_id, problem_id) DO UPDATE SET
                    status = CASE WHEN user_progress.status = 'solved' THEN 'solved' ELSE 'attempted' END
            """, (f"prog-{uuid.uuid4().hex[:8]}", user_id, problem_id, now_str))
    conn.commit()
    conn.close()

def record_user_submission(
    user_id: str,
    problem_id: str,
    problem_title: str,
    language: str,
    status: str,
    passed_cases: int,
    total_cases: int,
    execution_time_ms: float
):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT INTO user_submissions (id, user_id, problem_id, problem_title, language, status, passed_test_cases, total_test_cases, execution_time_ms, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (f"sub-{uuid.uuid4().hex[:8]}", user_id, problem_id, problem_title, language, status, passed_cases, total_cases, execution_time_ms, now_str))
    conn.commit()
    conn.close()

def compute_user_dashboard(user_id: str, all_problems: List[Dict[str, Any]]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    # User info
    cursor.execute("SELECT full_name, username, email, current_streak, longest_streak FROM users WHERE id = ?", (user_id,))
    u = cursor.fetchone()
    if not u:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Solved problem IDs
    cursor.execute("SELECT problem_id FROM user_progress WHERE user_id = ? AND status = 'solved'", (user_id,))
    solved_ids = set(r["problem_id"] for r in cursor.fetchall())

    # Submissions
    cursor.execute("""
        SELECT id, problem_id, problem_title, language, status, passed_test_cases, total_test_cases, execution_time_ms, created_at
        FROM user_submissions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 10
    """, (user_id,))
    recent_subs = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT COUNT(*) as count FROM user_submissions WHERE user_id = ? AND status = 'Accepted'", (user_id,))
    accepted_count = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM user_submissions WHERE user_id = ?", (user_id,))
    total_attempts = cursor.fetchone()["count"]

    # Bookmarks
    cursor.execute("SELECT problem_id FROM user_bookmarks WHERE user_id = ?", (user_id,))
    b_ids = set(r["problem_id"] for r in cursor.fetchall())

    # Last opened problem
    cursor.execute("SELECT last_problem_id, last_language, updated_at FROM user_activity WHERE user_id = ?", (user_id,))
    activity_row = cursor.fetchone()
    last_opened = None
    if activity_row and activity_row["last_problem_id"]:
        last_pid = activity_row["last_problem_id"]
        # Find problem metadata
        match_prob = next((p for p in all_problems if p["id"] == last_pid), None)
        if match_prob:
            # Fetch saved draft if exists
            cursor.execute("SELECT code FROM user_code_drafts WHERE user_id = ? AND problem_id = ? AND language = ?", (user_id, last_pid, activity_row["last_language"]))
            draft_row = cursor.fetchone()
            last_opened = {
                "problem_id": match_prob["id"],
                "title": match_prob["title"],
                "difficulty": match_prob["difficulty"],
                "topic": match_prob["topic"],
                "language": activity_row["last_language"],
                "saved_code": draft_row["code"] if draft_row else None,
                "updated_at": activity_row["updated_at"]
            }

    conn.close()

    # Calculate difficulty counts
    easy_total = sum(1 for p in all_problems if p["difficulty"] == "Easy")
    medium_total = sum(1 for p in all_problems if p["difficulty"] == "Medium")
    hard_total = sum(1 for p in all_problems if p["difficulty"] == "Hard")

    easy_solved = sum(1 for p in all_problems if p["difficulty"] == "Easy" and p["id"] in solved_ids)
    medium_solved = sum(1 for p in all_problems if p["difficulty"] == "Medium" and p["id"] in solved_ids)
    hard_solved = sum(1 for p in all_problems if p["difficulty"] == "Hard" and p["id"] in solved_ids)

    total_probs = len(all_problems)
    total_solved = len(solved_ids)
    comp_pct = round((total_solved / max(1, total_probs)) * 100, 1)

    bookmarked_problems = [
        {"id": p["id"], "title": p["title"], "difficulty": p["difficulty"], "topic": p["topic"]}
        for p in all_problems if p["id"] in b_ids
    ]

    return {
        "total_solved": total_solved,
        "total_problems": total_probs,
        "completion_percentage": comp_pct,
        "easy_solved": easy_solved,
        "easy_total": easy_total,
        "medium_solved": medium_solved,
        "medium_total": medium_total,
        "hard_solved": hard_solved,
        "hard_total": hard_total,
        "accepted_submissions": accepted_count,
        "attempted_submissions": total_attempts,
        "current_streak": u["current_streak"],
        "longest_streak": u["longest_streak"],
        "recent_submissions": recent_subs,
        "bookmarked_problems": bookmarked_problems,
        "last_opened_problem": last_opened
    }
