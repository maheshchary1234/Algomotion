import unittest
from app.services.sandbox import (
    run_python_code,
    run_java_code,
    evaluate_solution
)
from app.schemas.arena import TestCaseModel

class TestBackendSandbox(unittest.TestCase):
    def test_python_execution_success(self):
        code = "import sys\nprint('Hello ' + sys.stdin.read().strip())"
        success, stdout, stderr, time_ms, timed_out = run_python_code(code, "World")
        self.assertTrue(success)
        self.assertEqual(stdout, "Hello World")
        self.assertEqual(stderr, "")
        self.assertFalse(timed_out)
        self.assertGreater(time_ms, 0)

    def test_python_timeout(self):
        code = "import time\ntime.sleep(5)"
        success, stdout, stderr, time_ms, timed_out = run_python_code(code, "")
        self.assertFalse(success)
        self.assertTrue(timed_out)
        self.assertIn("Time Limit Exceeded", stderr)

    def test_java_compilation_and_execution(self):
        code = """
import java.util.Scanner;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}
"""
        success, stdout, stderr, time_ms, timed_out, is_compile_err = run_java_code(code, "15 25")
        self.assertFalse(is_compile_err)
        self.assertTrue(success)
        self.assertEqual(stdout, "40")

    def test_java_compilation_error(self):
        bad_code = "public class Solution { invalid syntax }"
        success, stdout, stderr, time_ms, timed_out, is_compile_err = run_java_code(bad_code, "")
        self.assertTrue(is_compile_err)
        self.assertFalse(success)
        self.assertGreater(len(stderr), 0)

    def test_evaluation_verdict_accepted(self):
        code = "import sys\nprint(int(sys.stdin.read().strip()) * 2)"
        test_cases = [
            TestCaseModel(id="tc-1", input="5", expected_output="10", is_hidden=False),
            TestCaseModel(id="tc-2", input="12", expected_output="24", is_hidden=True),
        ]
        resp = evaluate_solution("python", code, test_cases)
        self.assertEqual(resp.status, "Accepted")
        self.assertEqual(resp.passed_test_cases, 2)
        self.assertEqual(resp.total_test_cases, 2)

    def test_evaluation_verdict_wrong_answer(self):
        code = "import sys\nprint(int(sys.stdin.read().strip()) + 1)"
        test_cases = [
            TestCaseModel(id="tc-1", input="5", expected_output="10", is_hidden=False),
        ]
        resp = evaluate_solution("python", code, test_cases)
        self.assertEqual(resp.status, "Wrong Answer")
        self.assertEqual(resp.passed_test_cases, 0)

if __name__ == "__main__":
    unittest.main()
