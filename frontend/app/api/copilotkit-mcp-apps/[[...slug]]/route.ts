// Doc: MCP Apps "Configure your agent" app/api/copilotkit/[[...slug]]/route.ts (verbatim except the HARNESS basePath).
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { BuiltInAgent } from "@copilotkit/runtime/v2";

// 1. Create your agent
const agent = new BuiltInAgent({
  model: "openai/gpt-6-luna",
  prompt: "You are a helpful assistant.",
});

// 2. Create a service adapter, empty if not relevant

// 3. Create the runtime with mcpApps configured
const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
  mcpApps: {
    servers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server", // Recommended: stable identifier
      },
    ],
  },
  runner: new InMemoryAgentRunner(),
});

// 4. Create the API route
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp-apps", // HARNESS: doc mounts this at app/api/copilotkit; the harness already has that route, so this page gets its own path
});

export const GET = handler;
export const POST = handler;
