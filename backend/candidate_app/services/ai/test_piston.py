from candidate_app.services.ai.piston_service import execute_test_cases


code = """
def count_vowels(s):
    vowels = "aeiou"
    count = 0

    for char in s.lower():
        if char in vowels:
            count += 1

    return count
"""


test_cases = [
    {
        "input": '"Hello World"',
        "expected_output": "3",
    },
    {
        "input": '"PYTHON"',
        "expected_output": "1",
    },
]


result = execute_test_cases(
    code=code,
    test_cases=test_cases,
    language="python",
    version="3.12.0",
)

print(result)