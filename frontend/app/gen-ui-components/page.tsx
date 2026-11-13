"use client";
import { CopilotChat } from "@copilotkit/react-core/v2";

export default function Page() {
  return <CopilotChat agentId="my_agent" />; // HARNESS: agentId -> the quickstart Agno agent (doc's step 2 builds a TanStack/OpenAI "default" agent instead)
}
