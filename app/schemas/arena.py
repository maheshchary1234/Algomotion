from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TestCaseModel(BaseModel):
    id: str
    input: str
    expected_output: str
    is_hidden: bool = False
    explanation: Optional[str] = None

class RunCodeRequest(BaseModel):
    problem_id: str
    language: str # 'python' or 'java'
    code: str
    custom_input: Optional[str] = None

class SubmitCodeRequest(BaseModel):
    problem_id: str
    language: str # 'python' or 'java'
    code: str

class TestCaseResult(BaseModel):
    test_case_id: str
    passed: bool
    input: str
    expected_output: str
    actual_output: Optional[str] = None
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    is_hidden: bool = False
    execution_time_ms: float = 0.0

class ExecutionResponse(BaseModel):
    status: str # 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Internal Error'
    total_test_cases: int = 0
    passed_test_cases: int = 0
    execution_time_ms: float = 0.0
    memory_mb: float = 0.0
    compile_error: Optional[str] = None
    runtime_error: Optional[str] = None
    test_case_results: List[TestCaseResult] = Field(default_factory=list)
    message: str = ""

class SubmissionRecord(BaseModel):
    id: str
    problem_id: str
    problem_title: str
    language: str
    status: str
    passed_test_cases: int
    total_test_cases: int
    execution_time_ms: float
    timestamp: str

class LeaderboardUser(BaseModel):
    rank: int
    username: str
    solved_count: int
    points: int
    streak_days: int
    badge: str
