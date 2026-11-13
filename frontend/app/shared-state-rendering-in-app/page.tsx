// Doc: rendering-in-app app/page.tsx (verbatim; import path ../components/Canvas resolves from app/<route>/ via the HARNESS import below)
import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
import { Canvas } from "./components/Canvas" /* HARNESS: doc imports ../components/Canvas from app/page.tsx; here Canvas sits inside this route folder */;

export default function Page() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="app-shell">
        {/* Your app UI, driven by agent.state */}
        <Canvas />
        {/* Chat is just another consumer of the same agent */}
        <CopilotSidebar />
      </div>
    </CopilotKit>
  );
}
