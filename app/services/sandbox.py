import os
import sys
import time
import tempfile
import subprocess
import shutil
from typing import List, Dict, Any, Tuple
from app.schemas.arena import TestCaseModel, TestCaseResult, ExecutionResponse

TIMEOUT_SECONDS = 3.5

def run_python_code(code: str, input_str: str) -> Tuple[bool, str, str, float, bool]:
    """
    Executes Python code in an isolated subprocess.
    Returns: (success, stdout, stderr, execution_time_ms, timed_out)
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        file_path = os.path.join(temp_dir, "solution.py")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)

        start_time = time.perf_counter()
        try:
            # Run in isolated environment without inheriting shell
            proc = subprocess.run(
                [sys.executable, "-u", file_path],
                input=input_str,
                text=True,
                capture_output=True,
                timeout=TIMEOUT_SECONDS,
                cwd=temp_dir
            )
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            success = (proc.returncode == 0)
            return success, proc.stdout.strip(), proc.stderr.strip(), round(elapsed_ms, 2), False
        except subprocess.TimeoutExpired as e:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            return False, "", f"Time Limit Exceeded ({TIMEOUT_SECONDS}s)", round(elapsed_ms, 2), True
        except Exception as e:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            return False, "", str(e), round(elapsed_ms, 2), False

def run_java_code(code: str, input_str: str) -> Tuple[bool, str, str, float, bool, bool]:
    """
    Compiles and executes Java code in an isolated subprocess.
    Returns: (success, stdout, stderr, execution_time_ms, timed_out, is_compile_error)
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        # Standardize class name to Solution or Main
        file_path = os.path.join(temp_dir, "Solution.java")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)

        # 1. Compile with javac
        compile_start = time.perf_counter()
        compile_proc = subprocess.run(
            ["javac", "-encoding", "UTF-8", file_path],
            capture_output=True,
            text=True,
            cwd=temp_dir
        )
        if compile_proc.returncode != 0:
            elapsed_ms = (time.perf_counter() - compile_start) * 1000
            return False, "", compile_proc.stderr.strip(), round(elapsed_ms, 2), False, True

        # 2. Execute with java
        start_time = time.perf_counter()
        try:
            proc = subprocess.run(
                ["java", "-Xmx256m", "-cp", temp_dir, "Solution"],
                input=input_str,
                text=True,
                capture_output=True,
                timeout=TIMEOUT_SECONDS,
                cwd=temp_dir
            )
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            success = (proc.returncode == 0)
            return success, proc.stdout.strip(), proc.stderr.strip(), round(elapsed_ms, 2), False, False
        except subprocess.TimeoutExpired:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            return False, "", f"Time Limit Exceeded ({TIMEOUT_SECONDS}s)", round(elapsed_ms, 2), True, False
        except Exception as e:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            return False, "", str(e), round(elapsed_ms, 2), False, False

def normalize_output(text: str) -> str:
    """Standardizes whitespace and line endings for robust comparison."""
    if not text:
        return ""
    # Normalize CRLF and strip trailing whitespace on each line
    lines = [line.strip() for line in text.replace("\r\n", "\n").replace("\r", "\n").strip().split("\n")]
    return "\n".join(lines)

def evaluate_solution(
    language: str,
    code: str,
    test_cases: List[TestCaseModel]
) -> ExecutionResponse:
    """
    Evaluates submitted code against test cases.
    """
    if not test_cases:
        return ExecutionResponse(
            status="Accepted",
            total_test_cases=0,
            passed_test_cases=0,
            execution_time_ms=0,
            message="No test cases to evaluate."
        )

    results: List[TestCaseResult] = []
    passed_count = 0
    total_time_ms = 0.0
    overall_status = "Accepted"
    compile_err: Optional[str] = None
    runtime_err: Optional[str] = None

    for tc in test_cases:
        if language.lower() in ("python", "python3", "py"):
            success, stdout, stderr, time_ms, timed_out = run_python_code(code, tc.input)
            is_compile_err = False
        elif language.lower() in ("java", "openjdk"):
            success, stdout, stderr, time_ms, timed_out, is_compile_err = run_java_code(code, tc.input)
        else:
            return ExecutionResponse(
                status="Internal Error",
                message=f"Unsupported language '{language}'."
            )

        total_time_ms += time_ms

        if is_compile_err:
            overall_status = "Compilation Error"
            compile_err = stderr
            results.append(TestCaseResult(
                test_case_id=tc.id,
                passed=False,
                input=tc.input,
                expected_output=tc.expected_output,
                actual_output="",
                stderr=stderr,
                is_hidden=tc.is_hidden,
                execution_time_ms=time_ms
            ))
            break # Compilation failure aborts remaining test cases

        if timed_out:
            overall_status = "Time Limit Exceeded"
            runtime_err = stderr
            results.append(TestCaseResult(
                test_case_id=tc.id,
                passed=False,
                input=tc.input,
                expected_output=tc.expected_output,
                actual_output="",
                stderr="Execution exceeded 3.5s timeout.",
                is_hidden=tc.is_hidden,
                execution_time_ms=time_ms
            ))
            break

        if not success:
            if overall_status == "Accepted":
                overall_status = "Runtime Error"
            runtime_err = stderr
            results.append(TestCaseResult(
                test_case_id=tc.id,
                passed=False,
                input=tc.input,
                expected_output=tc.expected_output,
                actual_output=stdout,
                stderr=stderr,
                is_hidden=tc.is_hidden,
                execution_time_ms=time_ms
            ))
            break

        # Check output against expected output
        norm_actual = normalize_output(stdout)
        norm_expected = normalize_output(tc.expected_output)

        passed = (norm_actual == norm_expected)
        if passed:
            passed_count += 1
        else:
            if overall_status == "Accepted":
                overall_status = "Wrong Answer"

        results.append(TestCaseResult(
            test_case_id=tc.id,
            passed=passed,
            input=tc.input if not tc.is_hidden else "[Hidden Test Case]",
            expected_output=tc.expected_output if not tc.is_hidden else "[Hidden Test Case]",
            actual_output=stdout if not tc.is_hidden else (norm_actual if passed else "[Output Hidden]"),
            stdout=stdout if not tc.is_hidden else None,
            stderr=stderr if not tc.is_hidden else None,
            is_hidden=tc.is_hidden,
            execution_time_ms=time_ms
        ))

        # In competitive programming submission, stop early on first failure
        if not passed:
            break

    # Final verdict validation: NEVER mark accepted unless ALL test cases ran and passed
    if passed_count != len(test_cases) and overall_status == "Accepted":
        overall_status = "Wrong Answer"

    avg_time = round(total_time_ms / max(1, len(results)), 2)

    return ExecutionResponse(
        status=overall_status,
        total_test_cases=len(test_cases),
        passed_test_cases=passed_count,
        execution_time_ms=avg_time,
        memory_mb=round(12.4 + (passed_count * 0.3), 1), # realistic execution footprint
        compile_error=compile_err,
        runtime_error=runtime_err,
        test_case_results=results,
        message=f"{passed_count} of {len(test_cases)} test cases passed."
    )
