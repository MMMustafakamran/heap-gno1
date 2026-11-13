"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-mcp-apps" /* HARNESS: doc's runtimeUrl is /api/copilotkit; this page's route is mounted at /api/copilotkit-mcp-apps */ useSingleEndpoint={false}>
      {children}
    </CopilotKit>
  );
}
