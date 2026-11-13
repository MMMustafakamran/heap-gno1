# Findings — Agno-React (heap-gno1)
Open doc defects only, for https://docs.copilotkit.ai/agno (React). Numbers are stable IDs (code cites `FINDINGS.md #N`); gaps are removed findings.
Stack: `@copilotkit/react-core`/`react-ui`/`runtime` 1.87.1 (declared ^1.87.1), `@ag-ui/agno` 0.0.6, `next` 16.4.6, `react` 19.3.0, `agno` 3.2.0, `fastapi` 0.162.5, `uvicorn` 0.54.0, `openai` 3.50.0, `python-multipart` 0.0.33 (HARNESS, #1), `sqlalchemy` 2.1.8. Node 26.7.0, npm 12.0.2, Python 3.13.15 (backend venv), Windows 11 Pro. Docs: https://docs.copilotkit.ai/agno (snapshot 2026-11-13)

## Dev blockers (seen with `npm run dev` and normal use of the page)

### [Headless Threads](https://docs.copilotkit.ai/agno/headless-threads)
**#4 The thread list and the chat use different agents, and no thread can be opened.**
- **Doc:** `useThreads({ agentId: "my-agent" })` for the list, `<CopilotChat threadId={activeThreadId} />` (no `agentId`, so the chat runs on `default`); `ThreadSidebar` never calls `onSelectThread`.
- **Result:** the chat replies, its threads are saved under `default`, the list asks `my-agent` and stays empty; nothing can be clicked to open a thread. (Team doc: ✅.)

### [Reasoning](https://docs.copilotkit.ai/agno/generative-ui/reasoning) (linked from the Generative UI overview)
**#5 No Agno agent or reasoning setup, and the page's agent is never registered.**
- **Doc:** "if your model emits reasoning tokens, the card shows up"; `const AGENT_ID = "reasoning-custom";`. No Agno code, no runtime registration for `reasoning-custom`.
- **Result:** on the quickstart Agno agent the reply is plain text and no reasoning card ever renders. **Confirmed by harness:** `reasoning-custom` registered to the quickstart agent (HARNESS).

### [A2UI](https://docs.copilotkit.ai/agno/generative-ui/a2ui)
**#7 `myAgent` is never defined and there is no Agno agent code for A2UI.**
- **Doc:** `agents: { default: myAgent },` and "any A2UI output returned from your agent will automatically be rendered".
- **Result:** with the quickstart Agno agent as `myAgent` (HARNESS) the agent says it can't render a card and writes a text box; no A2UI surface renders.

### [Dynamic Schema A2UI](https://docs.copilotkit.ai/agno/generative-ui/a2ui/dynamic-schema)
**#8 The code imports files the page never shows; the opt-out step is LangGraph code.**
- **Doc:** `import { Chat } from "./chat";`, renderers import `../_components/badge`, `button`, `card`; the Agno agent imports `agents._header_forwarding` and a tools module that are not shown; `from ag_ui_langgraph import get_a2ui_tools` on the Agno page.
- **Error:** `Module not found: Can't resolve '../_components/badge'` (and `./chat`); the route 500s. (Team doc: ✅.)

### [Fixed Schema A2UI](https://docs.copilotkit.ai/agno/generative-ui/a2ui/fixed-schema)
**#9 The flight card never shows the flight.**
- **Result:** the agent answers about the SFO → JFK flight, but the fixed-schema card never shows the airports, airline and price. (Team doc: ❌.)

### [Surfaces](https://docs.copilotkit.ai/agno/generative-ui/components/surfaces)
**#10 The featured products surface renders with empty items.**
- **Result:** "Featured Products / Affordable running shoes" renders, every item has no name, a broken image and `$0`. (Team doc: ❌.)

### [Shared State](https://docs.copilotkit.ai/agno/shared-state)
**#12 The page is fragments only and shows no Agno agent.**
- **Doc:** `<Card data-testid=...>` with `Card`, `CardHeader`, `Button`, `NotesCardProps`, `RWAgentState` never imported or defined; no Agno agent with the `set_notes` tool.
- **Error:** on screen a Next.js Blocking Route overlay (`Next.js encountered the unstable value require('node:crypto').randomUUID() in a Client Component`, at the page's CopilotKit provider, see #3); in the console `Card is not defined` from NotesCard. The page never works. (Team doc: ❌.)

### [Render agent state in your app](https://docs.copilotkit.ai/agno/shared-state/rendering-in-app)
**#13 The agent never sees or changes the app state.**
- **Doc:** "Every time the agent mutates its state ..."; no Agno side for state.
- **Result:** the canvas renders; asked about it, the agent says it can't access the canvas and never marks an item done. `Canvas.tsx` also needs `"use client"`. (Team doc: ❌.)

### [Agent Read-Only Context](https://docs.copilotkit.ai/agno/shared-state/agent-readonly)
**#14 page.tsx imports files the page never shows.**
- **Doc:** `import { ACTIVITIES, DemoLayout } from "./demo-layout";` and `./suggestions`.
- **Error:** `Module not found: Can't resolve './demo-layout'`; the page never loads. (Team doc: ❌.)

### [Sub-agents](https://docs.copilotkit.ai/agno/multi-agent/subagents)
**#15 The Code tab imports four files that no tab shows; the agent server imports unshown modules.**
- **Doc:** Code-tab `page.tsx` imports `./subagent-activity-card`, `./demo-layout`, `./active-subagent`, `./suggestions`; the delegation log uses `SUB_AGENT_STYLE[subAgent]` and a props type never defined; `agent_server.py` imports unshown modules.
- **Error:** `Module not found: Can't resolve './subagent-activity-card'` (also `./active-subagent`); the page never loads. (Team doc: ✅.)

## Minor notes
- **#1** [Quickstart](https://docs.copilotkit.ai/agno/quickstart): `uv add agno fastapi uvicorn openai ag-ui-protocol` omits `python-multipart`; AgentOS fails to start until `uv add python-multipart` (team doc has the same note).
- **#2** [Quickstart](https://docs.copilotkit.ai/agno/quickstart): `agent_os.serve(app="main:app", port=8000, reload=True)` and the runtime URL `http://localhost:8000/agui` are hardcoded; the page gives no way to pick another port.
- **#3** All pages: the quickstart's `create-next-app@latest` turns on `cacheComponents`; the CopilotKit provider then logs `Next.js encountered the unstable value Date.now()` / `randomUUID()` in a Client Component (console only).
- **#6** [Components as Tools](https://docs.copilotkit.ai/agno/generative-ui/tool-based): the page's agent has `OpenAIChat(id="gpt-6-luna")` without `reasoning_effort="none"`; the model rejects the tool call (400). Recorded with it added, like the quickstart agent.
- **#16** [Components and surfaces](https://docs.copilotkit.ai/agno/generative-ui/components): `maplibre-gl` is called optional, but importing `@copilotkit/react-core/v2/generative-ui` without it fails with `Module not found: Can't resolve 'maplibre-gl'`.
- **#17** [Generative UI](https://docs.copilotkit.ai/agno/generative-ui): the link to `/agno/generative-ui/your-components` is dead (404).
- **#18** Pages whose Code tab imports unshown files (#8, #14, #15): one such route makes the Next dev server answer 500 on every route of the app, not only its own.
