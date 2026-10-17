import unittest
import os
import json
import urllib.request
import urllib.error
from app.database import get_db_connection, verify_password

BASE_URL = "http://127.0.0.1:8000"

def make_request(path: str, method: str = "GET", data: dict = None, token: str = None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = json.loads(response.read().decode("utf-8"))
            return status, body
    except urllib.error.HTTPError as e:
        status = e.code
        body = json.loads(e.read().decode("utf-8"))
        return status, body

class TestAuthAndStudentProgress(unittest.TestCase):
    def test_01_registration_and_db_hashing(self):
        suffix = os.urandom(4).hex()
        payload = {
            "full_name": "Antigravity Student",
            "username": f"student_{suffix}",
            "email": f"student_{suffix}@test.com",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!"
        }
        status, body = make_request("/api/auth/register", method="POST", data=payload)
        self.assertEqual(status, 200, body)
        self.assertIn("token", body)
        self.assertEqual(body["user"]["email"], payload["email"])
        self.assertEqual(body["user"]["username"], payload["username"])

        # Check DB directly to ensure password is not plaintext
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("SELECT password_hash, salt FROM users WHERE email = ?", (payload["email"],))
        row = c.fetchone()
        conn.close()
        self.assertIsNotNone(row)
        self.assertNotEqual(row["password_hash"], payload["password"])
        self.assertTrue(verify_password(payload["password"], row["password_hash"], row["salt"]))

    def test_02_duplicate_prevention_and_validation(self):
        suffix = os.urandom(4).hex()
        payload = {
            "full_name": "Test Duplicates",
            "username": f"dup_{suffix}",
            "email": f"dup_{suffix}@test.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
        status1, _ = make_request("/api/auth/register", method="POST", data=payload)
        self.assertEqual(status1, 200)

        # Duplicate email
        dup_email = dict(payload)
        dup_email["username"] = f"other_{suffix}"
        status2, body2 = make_request("/api/auth/register", method="POST", data=dup_email)
        self.assertEqual(status2, 400)
        self.assertIn("already exists", body2.get("detail", ""))

        # Duplicate username
        dup_user = dict(payload)
        dup_user["email"] = f"other_{suffix}@test.com"
        status3, body3 = make_request("/api/auth/register", method="POST", data=dup_user)
        self.assertEqual(status3, 400)
        self.assertIn("already taken", body3.get("detail", ""))

    def test_03_login_and_protected_routes(self):
        suffix = os.urandom(4).hex()
        email = f"auth_{suffix}@test.com"
        pwd = "AuthPass456!"

        status, _ = make_request("/api/auth/register", method="POST", data={
            "full_name": "Protected User",
            "username": f"auth_{suffix}",
            "email": email,
            "password": pwd,
            "confirm_password": pwd
        })
        self.assertEqual(status, 200)

        # Wrong password -> 401
        status_bad, body_bad = make_request("/api/auth/login", method="POST", data={
            "email": email,
            "password": "WrongPassword!"
        })
        self.assertEqual(status_bad, 401)
        self.assertIn("Invalid email or password", body_bad.get("detail", ""))

        # Good password -> 200
        status_ok, body_ok = make_request("/api/auth/login", method="POST", data={
            "email": email,
            "password": pwd
        })
        self.assertEqual(status_ok, 200)
        token = body_ok["token"]

        # Access /api/auth/me without token -> 401
        status_unauth, _ = make_request("/api/auth/me", method="GET")
        self.assertEqual(status_unauth, 401)

        # Access /api/auth/me with token -> 200
        status_me, body_me = make_request("/api/auth/me", method="GET", token=token)
        self.assertEqual(status_me, 200)
        self.assertEqual(body_me["email"], email)

    def test_04_draft_autosave_and_user_isolation(self):
        suffix_a = os.urandom(3).hex()
        suffix_b = os.urandom(3).hex()

        _, res_a = make_request("/api/auth/register", method="POST", data={
            "full_name": "Student A",
            "username": f"user_a_{suffix_a}",
            "email": f"user_a_{suffix_a}@test.com",
            "password": "Pass123!",
            "confirm_password": "Pass123!"
        })
        token_a = res_a["token"]

        _, res_b = make_request("/api/auth/register", method="POST", data={
            "full_name": "Student B",
            "username": f"user_b_{suffix_b}",
            "email": f"user_b_{suffix_b}@test.com",
            "password": "Pass123!",
            "confirm_password": "Pass123!"
        })
        token_b = res_b["token"]

        # Student A autosaves python code for 'rotate-array'
        code_a = "# Alice's Python solution\nprint('hello Alice')"
        status_save, _ = make_request("/api/user/draft", method="POST", data={
            "problem_id": "rotate-array",
            "language": "python",
            "code": code_a
        }, token=token_a)
        self.assertEqual(status_save, 200)

        # Student A retrieves draft -> sees code_a
        status_get_a, draft_a = make_request("/api/user/draft/rotate-array/python", method="GET", token=token_a)
        self.assertEqual(status_get_a, 200)
        self.assertEqual(draft_a["code"], code_a)

        # Student B retrieves draft -> None (isolation verified!)
        status_get_b, draft_b = make_request("/api/user/draft/rotate-array/python", method="GET", token=token_b)
        self.assertEqual(status_get_b, 200)
        self.assertIsNone(draft_b["code"])

    def test_05_dashboard_and_bookmarks(self):
        suffix = os.urandom(4).hex()
        _, res = make_request("/api/auth/register", method="POST", data={
            "full_name": "Dashboard Tester",
            "username": f"dash_{suffix}",
            "email": f"dash_{suffix}@test.com",
            "password": "Pass123!",
            "confirm_password": "Pass123!"
        })
        token = res["token"]

        # Toggle bookmark
        status_bm, body_bm = make_request("/api/user/bookmark", method="POST", data={"problem_id": "rotate-array"}, token=token)
        self.assertEqual(status_bm, 200)
        self.assertTrue(body_bm["is_bookmarked"])

        # Get dashboard
        status_dash, dash = make_request("/api/user/dashboard", method="GET", token=token)
        self.assertEqual(status_dash, 200)
        self.assertEqual(dash["total_solved"], 0)
        self.assertEqual(len(dash["bookmarked_problems"]), 1)
        self.assertEqual(dash["bookmarked_problems"][0]["id"], "rotate-array")

    def test_06_password_reset_flow(self):
        suffix = os.urandom(4).hex()
        email = f"reset_{suffix}@test.com"
        old_pwd = "OldPass123!"
        new_pwd = "NewPass789!"

        make_request("/api/auth/register", method="POST", data={
            "full_name": "Reset Student",
            "username": f"reset_{suffix}",
            "email": email,
            "password": old_pwd,
            "confirm_password": old_pwd
        })

        # Request reset
        status_f, body_f = make_request("/api/auth/forgot-password", method="POST", data={"email": email})
        self.assertEqual(status_f, 200)
        token = body_f["reset_token_dev"]

        # Submit new password
        status_r, body_r = make_request("/api/auth/reset-password", method="POST", data={
            "token": token,
            "new_password": new_pwd
        })
        self.assertEqual(status_r, 200)

        # Login with old fails
        status_old, _ = make_request("/api/auth/login", method="POST", data={"email": email, "password": old_pwd})
        self.assertEqual(status_old, 401)

        # Login with new succeeds
        status_new, _ = make_request("/api/auth/login", method="POST", data={"email": email, "password": new_pwd})
        self.assertEqual(status_new, 200)

if __name__ == "__main__":
    unittest.main()
