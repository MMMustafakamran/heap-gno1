# --- Doc: https://docs.copilotkit.ai/agno/frontend-tools (agent.py, verbatim) ---
from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.models.openai import OpenAIChat
from agno.os import AgentOS
from agno.os.interfaces.agui import AGUI

from tools.frontend import sayHello

db = SqliteDb(db_file="tmp/agno.db")

agent = Agent(
    model=OpenAIChat(reasoning_effort="none", id="gpt-6-luna"),
    tools=[sayHello],
    db=db,
    description="A helpful assistant that can answer questions and provide information.",
    instructions="Be helpful and friendly. Format your responses using markdown where appropriate.",
)

agent_os = AgentOS(agents=[agent], interfaces=[AGUI(agent=agent)])
app = agent_os.get_app()
# --- doc ends ---

if __name__ == "__main__":  # HARNESS: the page's agent.py has no run line; served like the quickstart's main.py, port 8071 (G1)
    agent_os.serve(app="agent:app", port=8071)
