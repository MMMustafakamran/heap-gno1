# --- Doc: https://docs.copilotkit.ai/agno/frontend-tools (tools/frontend.py, verbatim) ---
from agno.tools import tool

@tool(external_execution=True)
def sayHello(name: str):
    """
    Say hello to the user.

    Args:
        name: The name of the user to say hello to
    """
