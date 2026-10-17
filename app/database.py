import sqlite3
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(__file__), "algomotion.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TEXT NOT NULL,
        current_streak INTEGER DEFAULT 1,
        longest_streak INTEGER DEFAULT 1,
        last_active_date TEXT NOT NULL
    )
    """)

    # 2. Sessions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # 3. User Solved Progress
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        problem_id TEXT NOT NULL,
        status TEXT NOT NULL, -- 'solved' or 'attempted'
        solved_at TEXT NOT NULL,
        UNIQUE(user_id, problem_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # 4. User Code Drafts (Autosaved per user, per problem, per language)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_code_drafts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        problem_id TEXT NOT NULL,
        language TEXT NOT NULL,
        code TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, problem_id, language),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # 5. User Bookmarks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_bookmarks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        problem_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(user_id, problem_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # 6. User Submissions History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        problem_id TEXT NOT NULL,
        problem_title TEXT NOT NULL,
        language TEXT NOT NULL,
        status TEXT NOT NULL,
        passed_test_cases INTEGER NOT NULL,
        total_test_cases INTEGER NOT NULL,
        execution_time_ms REAL NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # 7. Password Reset Tokens
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS password_resets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # 8. User Activity History / Last Visited
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_activity (
        user_id TEXT PRIMARY KEY,
        last_problem_id TEXT,
        last_language TEXT DEFAULT 'python',
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    conn.commit()
    conn.close()

# Password Hashing with PBKDF2 and cryptographically secure random salt
def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return hashed, salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    computed_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(computed_hash, stored_hash)

# Initialize on import
init_db()
