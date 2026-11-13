# Agno-React (heap-gno1)

Docs QA harness for CopilotKit + Agno, React: https://docs.copilotkit.ai/agno. One route per doc page, doc code verbatim, one clip per page. The goal is to show doc defects; fixes that hide one are banned. Overview, layout and pipeline: [README.md](README.md).

## Rules

`.qa/` is the vendored copy of the shared tooling and rules (filled by the sync script; never edit it here).

@.qa/instructions/QA-RULES.md
@.qa/instructions/AUTORECORDER.md
@.qa/instructions/VOICE.md
@.qa/instructions/REVIEW.md
@.qa/instructions/REPORT.md

## This repo

- Ports: frontend **3070** (plus 3071-3073: one dev server per page whose doc imports unshown files, see `frontend/next.config.ts`) (Next.js, runtime at `/api/copilotkit/[[...slug]]`), Python Agno agents (FastAPI + uvicorn via `uv`): **8070** quickstart (`backend/main.py`), **8071-8079** page agents. Never 3000 / 8000.
- One route per doc page: `frontend/app/<route>/page.tsx`, each with its own `<CopilotKit>` provider (the quickstart's is `app/quickstart/layout.tsx`). All agents are registered by name in the one shared runtime, `frontend/app/api/copilotkit/[[...slug]]/route.ts`.
- Keys: `backend/.env` (`OPENAI_API_KEY`, the doc's name), `frontend/.env` (`CPK_INTELLIGENCE_API_KEY`, the doc's name). Never print or commit them. The doc says `export OPENAI_API_KEY`; `start-all.sh` loads `backend/.env` with `uv run --env-file .env` (HARNESS).
- Recorder: `autorecorder/` (`npm run record -- --pages=<id>`, `record:list`, `doctor`; probe: `npx tsx ../.qa/tools/probe.mts <id>`). `autorecorder/core/` is generated, see `autorecorder/CLAUDE.md`. Clips go to `autorecorder/videos/` (not committed).
- Report rows use REPORT.md's `team` style (`assignment.json` `report.style`).
