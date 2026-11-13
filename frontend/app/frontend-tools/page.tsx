"use client"; // HARNESS: hooks need a client component in the App Router; not on the doc.

// --- Doc: https://docs.copilotkit.ai/agno/frontend-tools ("Create a frontend tool", verbatim) ---
import { z } from "zod";
import { useFrontendTool } from "@copilotkit/react-core/v2"

export function Page() {
  // ...
  useFrontendTool({
    name: "sayHello",
    description: "Say hello to the user",
    parameters: z.object({
      name: z.string().describe("The name of the user to say hello to"),
    }),
    handler: async ({ name }) => {
      alert(`Hello, ${name}!`);
      return `Said hello to ${name}!`;
    },
  });
  // ...
  // HARNESS: the `// ...` part: a chat so the agent can be asked (the page shows none).
  return <CopilotChat />;
}
// --- doc ends ---

// HARNESS: provider + chat (the page relies on the quickstart's). Agent id points at this page's agent.py on 8071.
import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2";

export default function FrontendToolsPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="g1-frontend-tools" useSingleEndpoint={false}>
      <div style={{ height: "100vh" }}>
        <Page />
      </div>
    </CopilotKit>
  );
}
