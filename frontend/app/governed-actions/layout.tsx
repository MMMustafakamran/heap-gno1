"use client";
// HARNESS (G3): route-scoped provider (doc shows none for this snippet); runtime /api/copilotkit.
// The page shows no agent: the quickstart agent is used (g3_agent, with the db the Frontend Tools page adds).
import { CopilotKit } from "@copilotkit/react-core/v2";
export default function L({ children }: { children: React.ReactNode }) {
  return <CopilotKit runtimeUrl="/api/copilotkit" agent="g3_agent" useSingleEndpoint={false}>{children}</CopilotKit>;
}
