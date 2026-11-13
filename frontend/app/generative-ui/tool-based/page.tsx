"use client"; // HARNESS: hooks need a client component; not on the doc.

// --- Doc: https://docs.copilotkit.ai/agno/generative-ui/tool-based (verbatim) ---
import { useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";
// --- doc ends ---
import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2"; // HARNESS: provider/chat never shown on the page
import { BarChart, barChartPropsSchema } from "./bar-chart"; // HARNESS: never shown on the page

function Chat() { // HARNESS: the snippet is a fragment with no component around it
  // --- Doc: src/app/demos/gen-ui-tool-based/page.tsx (verbatim) ---
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
  });
  // --- doc ends ---
  return <CopilotChat agentId="gen-ui-tool-based" />;
}

void z; // HARNESS: the doc's zod import is unused in the shown fragment

// HARNESS: page + provider; agent "gen-ui-tool-based" = the page's chart_agent.py on 8072.
export default function ToolBasedPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="gen-ui-tool-based" useSingleEndpoint={false}>
      <div style={{ height: "100vh" }}>
        <Chat />
      </div>
    </CopilotKit>
  );
}
