"use client";
// Doc: agno/generative-ui/a2ui. The page's frontend says "The A2UI renderer activates automatically — no extra
// configuration needed on the frontend" and shows only the optional theme snippet, so this is the plain provider.
import { CopilotKit } from "@copilotkit/react-core/v2";
import { CopilotChat } from "@copilotkit/react-core/v2"; // HARNESS: the page shows no chat; "rendered in the chat interface"

export default function Page() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-a2ui">{/* HARNESS: runtimeUrl -> the page's route at its own path */}
      <CopilotChat />
    </CopilotKit>
  );
}
