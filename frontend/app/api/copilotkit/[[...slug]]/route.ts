import {
  CopilotKitIntelligence,
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { AgnoAgent } from "@ag-ui/agno";

// HARNESS: every page agent is registered in this one runtime (ALL_AGENTS), but the browser opens one
// Intelligence socket per registered agent and with many the thread join times out. So each request gets
// a runtime holding only the agents its page uses (see handlerFor below). Doc options unchanged.
const ALL_AGENTS: Record<string, AgnoAgent> = {
    my_agent: new AgnoAgent({ url: "http://localhost:8070/agui" }), // HARNESS: port 8000 -> 8070 (QA-RULES §4)
    // HARNESS: page agents register here by name, one line each, with the port and why:
    // "<id>": new AgnoAgent({ url: "http://localhost:807N/agui" }), // HARNESS: <doc page> agent
    // ── G1 (begin)
    // HARNESS (G1): threads-drawer / headless-ui / programmatic-control use no agent id (= "default"); quickstart agent on 8070.
    default: new AgnoAgent({ url: "http://localhost:8070/agui" }),
    // HARNESS (G1): headless-threads useThreads({ agentId: "my-agent" }) id never registered by the doc; quickstart agent on 8070.
    "my-agent": new AgnoAgent({ url: "http://localhost:8070/agui" }),
    // HARNESS (G1): generative-ui/reasoning uses agent "reasoning-custom", never registered or shown on the page; quickstart agent on 8070.
    "reasoning-custom": new AgnoAgent({ url: "http://localhost:8070/agui" }),
    // HARNESS (G1): chat / sidebar / popup agent ids from the doc snippets, never registered by the page; quickstart agent on 8070.
    agentic_chat: new AgnoAgent({ url: "http://localhost:8070/agui" }),
    "prebuilt-sidebar": new AgnoAgent({ url: "http://localhost:8070/agui" }),
    "prebuilt-popup": new AgnoAgent({ url: "http://localhost:8070/agui" }),
    "g1-frontend-tools": new AgnoAgent({ url: "http://localhost:8071/agui" }), // HARNESS (G1): frontend-tools agent.py on 8071
    "gen-ui-tool-based": new AgnoAgent({ url: "http://localhost:8072/agui" }), // HARNESS (G1): tool-based chart_agent.py on 8072
    "g1-tool-rendering": new AgnoAgent({ url: "http://localhost:8073/agui" }), // HARNESS (G1): tool-rendering agent.py on 8073
    // ── G1 (end)
    // ── G2 (begin)
    // ── G2 (end)
    // ── G3 (begin)
    "hitl-in-chat": new AgnoAgent({ url: "http://localhost:8077/agui" }), // HARNESS: HITL Overview page agent id; no Agno agent mounted for it on the page
    "shared-state-read-write": new AgnoAgent({ url: "http://localhost:8077/agui" }), // HARNESS: Shared State page agent id; page shows no Agno agent
    "readonly-state-agent-context": new AgnoAgent({ url: "http://localhost:8077/agui" }), // HARNESS: Agent Read-Only Context page agent id
    "g3_agent": new AgnoAgent({ url: "http://localhost:8077/agui" }), // HARNESS: Governed Actions / WebMCP show no agent; quickstart agent + the Frontend Tools page's db
    "subagents": new AgnoAgent({ url: "http://localhost:8078/subagents/agui" }), // HARNESS: Sub-Agents page agent id; not served (agent_server.py imports unshown modules), the page fails at compile first
    // ── G3 (end)
};

const makeRuntime = (agents: Record<string, AgnoAgent>) => new CopilotRuntime({
  agents,
  intelligence: new CopilotKitIntelligence({
    apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
  }),
  // Threads are per-user. Without this, every visitor shares one history.
  identifyUser: (request) => ({
    id: request.headers.get("x-user-id") ?? "anonymous",
    name: request.headers.get("x-user-name") ?? "Anonymous",
  }),
});

// HARNESS (begin): per-page agent scoping. The page is read from the Referer; its agents are the
// registered ids that appear in its own source folder.
import fs from "node:fs";
import path from "node:path";
const APP_DIR = path.join(process.cwd(), "app");
const handlers = new Map<string, ReturnType<typeof createCopilotRuntimeHandler>>();
function agentsFor(pagePath: string): string[] {
  const dir = path.join(APP_DIR, ...pagePath.split("/").filter(Boolean));
  const found = new Set<string>();
  const walk = (d: string) => {
    let entries: fs.Dirent[] = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== "api") walk(f); continue; }
      if (!/\.(tsx?|jsx?)$/.test(e.name)) continue;
      const src = fs.readFileSync(f, "utf8");
      for (const id of Object.keys(ALL_AGENTS)) if (src.includes(`"${id}"`) || src.includes(`'${id}'`)) found.add(id);
    }
  };
  if (pagePath && pagePath !== "/") walk(dir);
  const extra = [...found].filter((id) => id !== "my_agent" && id !== "default").sort().slice(0, 2);
  const ids = ["my_agent", ...extra];
  if (ALL_AGENTS.default) ids.push("default");
  return ids.sort();
}
function handlerFor(request: Request) {
  let page = "/";
  try { page = new URL(request.headers.get("referer") ?? "").pathname; } catch {}
  const ids = agentsFor(page);
  const key = ids.join(",");
  let h = handlers.get(key);
  if (!h) {
    const agents = Object.fromEntries(ids.map((id) => [id, ALL_AGENTS[id]]));
    h = createCopilotRuntimeHandler({ runtime: makeRuntime(agents), basePath: "/api/copilotkit" });
    handlers.set(key, h);
  }
  return h;
}
const handler = (request: Request) => handlerFor(request)(request);
// HARNESS (end)

export const GET = handler;
export const POST = handler;
