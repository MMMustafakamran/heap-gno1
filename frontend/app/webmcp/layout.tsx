"use client";
// HARNESS (G3): route-scoped provider (doc shows none for this snippet); runtime /api/copilotkit.
import { CopilotKit } from "@copilotkit/react-core/v2";
export default function L({ children }: { children: React.ReactNode }) {
  return <CopilotKit runtimeUrl="/api/copilotkit" agent="g3_agent" useSingleEndpoint={false}>{children}</CopilotKit>;
}
