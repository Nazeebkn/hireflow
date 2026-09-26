import ast
import requests

PISTON_URL = "http://host.docker.internal:2000/api/v2/execute"


def execute_code(code, language="python", version="3.12.0"):
    response = requests.post(
        PISTON_URL,
        json={
            "language": language,
            "version": version,
            "files": [
                {
                    "name": "main.py",
                    "content": code,
                }
            ],
        },
        timeout=10,
    )

    response.raise_for_status()
    return response.json()


def _prepare_python_code(code, input_data):
    """
    Candidate code is expected to contain a function.

    Example:

        def count_vowels(s):
            ...
            return count

    Test input:

        "Hello World"

    This function creates a small execution wrapper:

        print(count_vowels("Hello World"))

    so Piston can execute the candidate's function.
    """

    try:
        tree = ast.parse(code)
    except SyntaxError:
        return code

    function_nodes = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
    ]

    if not function_nodes:
        return code

    function_name = function_nodes[0].name

    try:
        parsed_input = ast.literal_eval(input_data)
    except (ValueError, SyntaxError):
        parsed_input = input_data

    argument_repr = repr(parsed_input)

    wrapper = f"\n\nprint({function_name}({argument_repr}))\n"

    return f"{code.rstrip()}{wrapper}"


def execute_test_cases(
    code,
    test_cases,
    language="python",
    version="3.12.0",
):
    results = []

    for test_case in test_cases:
        input_data = test_case.get("input", "")
        expected_output = test_case.get(
            "expected_output",
            "",
        )

        execution_code = code

        if language.lower() == "python":
            execution_code = _prepare_python_code(
                code=code,
                input_data=input_data,
            )

        response = requests.post(
            PISTON_URL,
            json={
                "language": language,
                "version": version,
                "files": [
                    {
                        "name": "main.py",
                        "content": execution_code,
                    }
                ],
            },
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()
        run = data.get("run", {})

        actual_output = run.get(
            "stdout",
            "",
        ).strip()

        expected_output = str(
            expected_output
        ).strip()

        error = run.get(
            "stderr",
            "",
        ).strip()

        results.append(
            {
                "input": input_data,
                "expected_output": expected_output,
                "actual_output": actual_output,
                "passed": actual_output == expected_output,
                "error": error,
            }
        )

    return results