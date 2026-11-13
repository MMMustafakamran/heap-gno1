#!/usr/bin/env bash
# HARNESS: starts every Agno-React server on its harness port (QA-RULES §4: never 3000/8000).
#   8070 quickstart Agno agent (backend/main.py, AgentOS + AGUI at /agui)
#   8071-8079 page agents (see the PAGE AGENTS block below)
#   3070 Next.js frontend (runtime at /api/copilotkit)
# The doc says `export OPENAI_API_KEY=...`; the harness keeps it in backend/.env and loads it via --env-file.
cd "$(dirname "$0")"
mkdir -p logs
(cd backend && uv run --env-file .env main.py > ../logs/backend-8070.log 2>&1) &

# ── PAGE AGENTS: one line per page backend, e.g.
# (cd backend && uv run --env-file .env <file>.py > ../logs/backend-807N.log 2>&1) &
# ── G1 (8071-8073)
(cd backend/g1_frontend_tools && uv run --project .. --env-file ../.env agent.py > ../../logs/backend-8071.log 2>&1) &  # frontend-tools agent.py
(cd backend && uv run --env-file .env g1_chart_agent_fix.py > ../logs/backend-8072.log 2>&1) &  # generative-ui/tool-based (FIX copy; verbatim g1_chart_agent.py fails 400 on reasoning_effort)
(cd backend && uv run --env-file .env g1_weather_agent.py > ../logs/backend-8073.log 2>&1) &  # generative-ui/tool-rendering
# ── G2 (8074-8076)
(cd backend && uv run --env-file .env g2_serve_a2ui_fixed.py > ../logs/backend-8075.log 2>&1) &  # G2: Fixed Schema A2UI agent (8074 = Dynamic Schema agent, not startable as published)
# ── G3 (8077-8079)
(cd backend && uv run --env-file .env g3_agents.py > ../logs/backend-8077.log 2>&1) &
# ── END PAGE AGENTS

(cd frontend && npm run dev > ../logs/frontend-3070.log 2>&1) &
# HARNESS: one dev server per page whose doc imports unshown files (page.broken-<name>.tsx, see next.config.ts):
# one such route makes a dev server answer 500 on every route.
(cd frontend && HARNESS_BROKEN=subagents npx next dev -p 3071 > ../logs/frontend-3071.log 2>&1) &
(cd frontend && HARNESS_BROKEN=readonly npx next dev -p 3072 > ../logs/frontend-3072.log 2>&1) &
(cd frontend && HARNESS_BROKEN=dynamic npx next dev -p 3073 > ../logs/frontend-3073.log 2>&1) &
wait
