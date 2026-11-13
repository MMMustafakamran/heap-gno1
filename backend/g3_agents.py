# HARNESS (G3): page agents for the G3 doc pages, port 8077.
# None of these pages (Open Generative UI, HITL, Governed Actions, WebMCP, Shared State, Render agent state,
# Agent Read-Only Context) shows a runnable Agno agent for its demo: their prose setup blocks say
# "setup skipped: ... is not bundled for agno". So each page's agent id is served by the quickstart agent
# (backend/main.py, verbatim from the quickstart page), mounted with AgentOS + AGUI as the quickstart does.
#   /agui                 -> hitl-in-chat, g3_agent (governed actions, webmcp), shared-state pages
#   /open-gen-ui/agui     -> open-gen-ui (the Open Generative UI page's route.ts points at `${AGENT_URL}/open-gen-ui/agui`;
#                            agent_server.py on the Sub-Agents page's Code tab mounts a no-tools agent there the same way)
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.os import AgentOS
from agno.os.interfaces.agui import AGUI
from agno.db.sqlite import SqliteDb

agent = Agent(
    model=OpenAIChat(reasoning_effort="none", id="gpt-6-luna"),
    description="A helpful assistant that can answer questions and provide information.",
    instructions="Be helpful and friendly. Format your responses using markdown where appropriate.",
    # HARNESS: the quickstart agent has no db, and every frontend-tool round trip then ends with
    # "Frontend tool resume requires a database". db as the Frontend Tools page's "Configure session storage"
    # callout shows it (also in the HITL page's Code tab, src/agents/main.py).
    db=SqliteDb(db_file="tmp/g3_agno.db"),
)

agent_os = AgentOS(
    agents=[agent],
    interfaces=[AGUI(agent=agent), AGUI(agent=agent, prefix="/open-gen-ui")],
)
app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(app="g3_agents:app", port=8077, reload=False)  # HARNESS: G3 page-agent port
