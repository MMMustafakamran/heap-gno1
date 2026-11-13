# HARNESS: the Fixed Schema page's agent file builds `agent` but never serves it; the page's route.ts calls
# ${AGENT_URL}/a2ui-fixed-schema/agui. Served here with AgentOS + AGUI (as the Agno quickstart does) on 8075
# (QA-RULES §4: never 8000), with the prefix the route expects.
from agno.os import AgentOS
from agno.os.interfaces.agui import AGUI

from g2_a2ui_fixed_agent import agent

agent_os = AgentOS(agents=[agent], interfaces=[AGUI(agent=agent, prefix="/a2ui-fixed-schema")])
app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(app="g2_serve_a2ui_fixed:app", port=8075)
