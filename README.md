# Agno-React (heap-gno1): CopilotKit docs QA (Agno, React)

QA harness for the CopilotKit docs at https://docs.copilotkit.ai/agno. Every doc page gets a route in a real Next.js app with the doc's snippets pasted **verbatim**, backed by the doc's Python Agno agents, and a screen-recorded clip shows what happens when a user follows the page. Where the docs break, the clip shows the break and the defect is listed in [FINDINGS.md](FINDINGS.md). The only allowed edits are marked `HARNESS` (rules: `.qa/instructions/QA-RULES.md`).

## Layout

```
backend/        Python Agno agents (AgentOS + AGUI, run with uv): 8070 quickstart, 8071-8079 page agents
frontend/       Next.js app (3070), one route per doc page; shared runtime at app/api/copilotkit/[[...slug]]/route.ts
doc-snapshot/   .md snapshot + sidebar of the docs
autorecorder/   clip recorder (config/*.config.ts, actions/*.ts); output videos/ (not committed)
assignment.json per-page status, findings, clips, Loom links
FINDINGS.md     open doc defects (stable #N ids)
.qa/            vendored shared tooling + rules (synced; don't edit here)
start-all.sh    starts every backend and the frontend, logs in logs/
```

Ports: frontend **3070** (plus 3071-3073: one dev server per page whose doc imports unshown files, see `frontend/next.config.ts`), agents **8070** (quickstart) and **8071-8079**. Never 3000 / 8000.

## Run

```sh
# keys: backend/.env (OPENAI_API_KEY) and frontend/.env (CPK_INTELLIGENCE_API_KEY), see .env.example
(cd backend && uv sync)
npm ci --prefix frontend && npm ci --prefix autorecorder
./start-all.sh
cd autorecorder
npx tsx ../.qa/tools/probe.mts quickstart
npm run record -- --pages=quickstart
```

## Daily CI

`.github/workflows/daily.yml` (manual dispatch). Secrets: `GEMINI_API_KEY` (written as `OPENAI_API_KEY` to `backend/.env`), `CPK_INTELLIGENCE_API_KEY`, `FISH_API_KEY`.
