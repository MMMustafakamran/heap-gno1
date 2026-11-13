# --- Doc: https://docs.copilotkit.ai/agno/generative-ui/tool-rendering (agent.py, Python tab, verbatim) ---
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools import tool

# ...

@tool
def get_weather(location: str):
    """
    Get the weather for a given location.
    """
    return f"The weather for {location} is 70 degrees."

# ...

agent = Agent(
    model=OpenAIChat(reasoning_effort="none", id="gpt-6-luna"),
    tools=[get_weather],
    description="A helpful assistant that can answer questions and provide information.",
    instructions="Be helpful and friendly. Format your responses using markdown where appropriate.",
)
# --- doc ends ---

# HARNESS: the `# ...` parts are the quickstart's AgentOS + AGUI serving lines; port 8073 (G1).
from agno.os import AgentOS
from agno.os.interfaces.agui import AGUI

agent_os = AgentOS(agents=[agent], interfaces=[AGUI(agent=agent)])
app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(app="g1_weather_agent:app", port=8073)
