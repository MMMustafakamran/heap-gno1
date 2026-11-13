# --- Doc: https://docs.copilotkit.ai/agno/generative-ui/tool-based (src/agents/chart_agent.py, both snippets, verbatim) ---
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools import tool
# Step 2 snippet (HARNESS: placed before Agent(...) because step 1 uses `db` first)
from agno.db.sqlite import SqliteDb

db = SqliteDb(db_file="tmp/agno.db")

# HARNESS: SYSTEM_PROMPT is used by the doc but never defined or shown.
SYSTEM_PROMPT = "You are a helpful assistant. When the user asks for a chart, call render_bar_chart."

@tool(external_execution=True)
def render_bar_chart(title: str, data: list[dict]):
    """
    Render a bar chart in the chat.

    Call this whenever the user asks for a chart or a comparison.

    Args:
        title (str): A concise chart title.
        data (list[dict]): Items shaped `{label, value}`.
    """

agent = Agent(
    model=OpenAIChat(id="gpt-6-luna"),
    db=db,
    tools=[render_bar_chart],
    instructions=SYSTEM_PROMPT,
)
# --- doc ends ---

# HARNESS: the page never shows how this agent is served; AgentOS + AGUI as in the quickstart, port 8072 (G1).
from agno.os import AgentOS
from agno.os.interfaces.agui import AGUI

agent_os = AgentOS(agents=[agent], interfaces=[AGUI(agent=agent)])
app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(app="g1_chart_agent:app", port=8072)
