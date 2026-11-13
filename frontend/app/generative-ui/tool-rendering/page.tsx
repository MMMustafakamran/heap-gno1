"use client"; // HARNESS: hooks need a client component; not on the doc.

// --- Doc: https://docs.copilotkit.ai/agno/generative-ui/tool-rendering (app/page.tsx snippets, verbatim) ---
import { useRenderTool } from "@copilotkit/react-core/v2";
import { useDefaultRenderTool } from "@copilotkit/react-core/v2";
// ...

const YourMainContent = () => {
  // ...
  useRenderTool({
    name: "get_weather",
    render: ({status, args}) => {
      return (
        <p className="text-gray-500 mt-2">
          {status !== "complete" && "Calling weather API..."}
          {status === "complete" && `Called the weather API for ${args.location}.`}
        </p>
      );
    },
  });
  // "Default Tool Rendering" (verbatim)
  useDefaultRenderTool({
    render: ({ name, args, status, result }) => {
      return (
        <div style={{ color: "black" }}>
          <span>
            {status === "complete" ? "✓" : "⏳"}
            {name}
          </span>
          {status === "complete" && result && (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      );
    },
  });
  // ...
  // HARNESS: the `// ...` part: a chat to ask the agent (the page shows none).
  return <CopilotChat />;
}
// --- doc ends ---

// HARNESS: provider; agent id points at the page's agent.py on 8073.
import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2";

export default function ToolRenderingPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="g1-tool-rendering" useSingleEndpoint={false}>
      <div style={{ height: "100vh" }}>
        <YourMainContent />
      </div>
    </CopilotKit>
  );
}
