// Doc: agno/generative-ui/a2ui, "Backend" snippet app/api/copilotkit/route.ts (verbatim except the HARNESS lines).
// HARNESS: served at its own path (/api/copilotkit-a2ui) so the quickstart's /api/copilotkit stays as it is.
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { AgnoAgent } from "@ag-ui/agno"; // HARNESS: `myAgent` is never defined on the page; the quickstart's Agno agent stands in

const myAgent = new AgnoAgent({ url: "http://localhost:8070/agui" }); // HARNESS: see above (quickstart agent, port 8070)

const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {},
});

// Single-route: only POST needed, no catch-all [...path] required
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-a2ui", // HARNESS: /api/copilotkit -> /api/copilotkit-a2ui (own path)
  mode: "single-route",
});

export { handler as POST };
