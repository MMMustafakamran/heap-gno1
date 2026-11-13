/**
 * One entry per tested doc page of https://docs.copilotkit.ai/google-adk, in the order
 * the clips are numbered. docUrl, demoUrl and the filename are derived from project.config.ts.
 *
 * Every demo route is served from the root of the app (demoSuffix is ''), because this harness
 * puts each doc page on its own route rather than a `/demo-chat` sub-page.
 * Not registered: intelligence/*, backend/*, deploy pages (QA-RULES §9).
 */
import { definePages } from '../core/types';

/** Registered but not recorded, with the reason printed on every run. */
export const SKIP_RECORDING: Record<string, string> = {
  // G4: rendered pages show "Not available for Agno yet" + "Not supported on Agno" (checked 2026-11-13): N/A row, no test, no clip.
  'gen-ui-json-render': 'Not available for Agno (page banner "Not supported on Agno"): N/A row, not tested or filmed',
  'gen-ui-hashbrown': 'Not available for Agno (page banner "Not supported on Agno"): N/A row, not tested or filmed',
  // G5: rendered pages show "Not supported on Agno / Agno doesn't support Shared State: Streaming" in place of every snippet (checked 2026-11-13).
  'gen-ui-state-rendering': 'Not available for Agno (page banner "Not supported on Agno"): N/A row, not tested or filmed',
  'shared-state-streaming': 'Not available for Agno (page banner "Not supported on Agno"): N/A row, not tested or filmed',
};

/**
 * Pages are grouped: G0 (quickstart + chat basics), G1, G2, G3 (see each group's comment).
 * Each group appends its own entries in its block; keep the order = clip numbering (NN in the file name
 * is the page's position in this list, see videoNumber below if set).
 */
export const PAGES = definePages([
  {
    id: 'quickstart',
    name: 'Quickstart (use an existing agent)',
    videoName: 'Quickstart',
    docPath: 'quickstart',
    route: 'quickstart',
    ideFile: 'frontend/VERSIONS.md',
    startLine: 6,
    endLine: 20,
    extraTabs: [
      { filePath: 'frontend/package.json', startLine: 11, endLine: 22 },
      { filePath: 'backend/main.py', startLine: 1, endLine: 17 },
      { filePath: 'frontend/app/api/copilotkit/[[...slug]]/route.ts', startLine: 1, endLine: 30 },
      { filePath: 'frontend/app/providers.tsx', startLine: 1, endLine: 11 },
      { filePath: 'frontend/app/quickstart/page.tsx', startLine: 1, endLine: 12 },
    ],
    prompt: 'Can you tell me a joke?',
    waitAfterPromptMs: 3000,
  },
  // ── G0 (begin)
  // ── G0 (end)
  // ── G1 (begin)
  { id: 'prebuilt-components', videoFile: '02-PrebuiltComponents', name: 'Prebuilt Components', videoName: 'PrebuiltComponents', docPath: 'prebuilt-components', route: 'prebuilt-components/chat', ideFile: 'frontend/app/prebuilt-components/chat/page.tsx', startLine: 1, endLine: 25, prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 }, // index page with no code: demo = CopilotChat
  { id: 'copilot-chat', videoFile: '03-CopilotChat', name: 'CopilotChat', videoName: 'CopilotChat', docPath: 'prebuilt-components/chat', route: 'prebuilt-components/chat', ideFile: 'frontend/app/prebuilt-components/chat/page.tsx', startLine: 1, endLine: 25, prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 },
  { id: 'copilot-sidebar', videoFile: '04-CopilotSidebar', name: 'CopilotSidebar', videoName: 'CopilotSidebar', docPath: 'prebuilt-components/sidebar', route: 'prebuilt-components/sidebar', ideFile: 'frontend/app/prebuilt-components/sidebar/page.tsx', startLine: 1, endLine: 26, prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 },
  { id: 'copilot-popup', videoFile: '05-CopilotPopup', name: 'CopilotPopup', videoName: 'CopilotPopup', docPath: 'prebuilt-components/popup', route: 'prebuilt-components/popup', ideFile: 'frontend/app/prebuilt-components/popup/page.tsx', startLine: 1, endLine: 32, prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 },
  { id: 'css-customization', videoFile: '06-CssCustomization', name: 'CSS Customization', videoName: 'CssCustomization', docPath: 'custom-look-and-feel/css', route: 'custom-look-and-feel/css', ideFile: 'frontend/app/custom-look-and-feel/css/theme.css', startLine: 1, endLine: 60, extraTabs: [{ filePath: 'frontend/app/custom-look-and-feel/css/page.tsx', startLine: 1, endLine: 25 }], prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 },
  { id: 'markdown-rendering', videoFile: '07-MarkdownRendering', name: 'Markdown Rendering', videoName: 'MarkdownRendering', docPath: 'custom-look-and-feel/markdown', route: 'custom-look-and-feel/markdown', ideFile: 'frontend/app/custom-look-and-feel/markdown/page.tsx', startLine: 1, endLine: 40, prompt: 'Reply with a markdown h2 heading and a link to example.com.', waitAfterPromptMs: 3000 },
  { id: 'slots', videoFile: '08-Slots', name: 'Slots', videoName: 'Slots', docPath: 'custom-look-and-feel/slots', route: 'custom-look-and-feel/slots', ideFile: 'frontend/app/custom-look-and-feel/slots/page.tsx', startLine: 1, endLine: 45, prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 },
  { id: 'headless-ui', videoFile: '09-HeadlessUi', name: 'Headless UI', videoName: 'HeadlessUi', docPath: 'custom-look-and-feel/headless-ui', route: 'custom-look-and-feel/headless-ui', ideFile: 'frontend/app/custom-look-and-feel/headless-ui/custom-chat.tsx', startLine: 1, endLine: 75, prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 },
  { id: 'programmatic-control', videoFile: '10-ProgrammaticControl', name: 'Programmatic Control', videoName: 'ProgrammaticControl', docPath: 'programmatic-control', route: 'programmatic-control', ideFile: 'frontend/app/programmatic-control/page.tsx', startLine: 1, endLine: 30, extraTabs: [{ filePath: 'frontend/app/programmatic-control/page.tsx', startLine: 70, endLine: 120 }], prompt: '', waitAfterPromptMs: 3000 },
  { id: 'threads-drawer', videoFile: '11-ThreadsDrawer', name: 'Threads Drawer', videoName: 'ThreadsDrawer', docPath: 'prebuilt-components/copilot-threads-drawer', route: 'prebuilt-components/copilot-threads-drawer', ideFile: 'frontend/app/prebuilt-components/copilot-threads-drawer/page.tsx', startLine: 1, endLine: 24, prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 },
  { id: 'headless-threads', videoFile: '12-HeadlessThreads', name: 'Headless Threads', videoName: 'HeadlessThreads', docPath: 'headless-threads', route: 'headless-threads', ideFile: 'frontend/app/headless-threads/page.tsx', startLine: 1, endLine: 60, prompt: 'Say hello in one short sentence.', waitAfterPromptMs: 3000 },
  { id: 'frontend-tools', videoFile: '13-FrontendTools', name: 'Frontend Tools', videoName: 'FrontendTools', docPath: 'frontend-tools', route: 'frontend-tools', ideFile: 'frontend/app/frontend-tools/page.tsx', startLine: 1, endLine: 36, extraTabs: [{ filePath: 'backend/g1_frontend_tools/tools/frontend.py', startLine: 1, endLine: 11 }, { filePath: 'backend/g1_frontend_tools/agent.py', startLine: 1, endLine: 25 }], prompt: 'Say hello to Alex.', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-tool-based', videoFile: '14-GenUiToolBased', name: 'Components as Tools', videoName: 'GenUiToolBased', docPath: 'generative-ui/tool-based', route: 'generative-ui/tool-based', ideFile: 'frontend/app/generative-ui/tool-based/page.tsx', startLine: 1, endLine: 35, extraTabs: [{ filePath: 'backend/g1_chart_agent_fix.py', startLine: 1, endLine: 35 }], prompt: 'Show me a bar chart of quarterly revenue: Q1 120, Q2 150, Q3 170, Q4 210.', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-tool-rendering', videoFile: '15-GenUiToolRendering', name: 'Tool Call Rendering', videoName: 'GenUiToolRendering', docPath: 'generative-ui/tool-rendering', route: 'generative-ui/tool-rendering', ideFile: 'frontend/app/generative-ui/tool-rendering/page.tsx', startLine: 1, endLine: 48, extraTabs: [{ filePath: 'backend/g1_weather_agent.py', startLine: 1, endLine: 24 }], prompt: 'What is the weather in Tokyo?', waitAfterPromptMs: 3000 },
  { id: 'reasoning', videoFile: '37-Reasoning', name: 'Reasoning', videoName: 'Reasoning', docPath: 'generative-ui/reasoning', route: 'generative-ui/reasoning', ideFile: 'frontend/app/generative-ui/reasoning/page.tsx', startLine: 1, endLine: 32, extraTabs: [{ filePath: 'frontend/app/generative-ui/reasoning/reasoning-block.tsx', startLine: 1, endLine: 44 }], prompt: 'Think step by step: what is 17 times 23?', waitAfterPromptMs: 3000 },
  // ── G1 (end)
  // ── G2 (begin)
  { id: 'gen-ui-components', videoFile: '16-GenUiComponents', name: 'Components and surfaces', videoName: 'GenUiComponents', docPath: 'generative-ui/components', route: 'gen-ui-components', ideFile: 'frontend/app/gen-ui-components/providers.tsx', startLine: 1, endLine: 14, extraTabs: [{ filePath: 'frontend/app/gen-ui-components/page.tsx', startLine: 1, endLine: 6 }], prompt: 'Compare the Starter, Team, and Enterprise plans in a table', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-surfaces', videoFile: '17-GenUiSurfaces', name: 'Surfaces', videoName: 'GenUiSurfaces', docPath: 'generative-ui/components/surfaces', route: 'gen-ui-surfaces', ideFile: 'frontend/app/gen-ui-surfaces/featured.tsx', startLine: 1, endLine: 45, prompt: 'Show me cheap running shoes in the featured products row', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-catalogs', videoFile: '18-GenUiCatalogs', name: 'Catalogs', videoName: 'GenUiCatalogs', docPath: 'generative-ui/components/catalogs', route: 'gen-ui-catalogs', ideFile: 'frontend/app/gen-ui-catalogs/catalog.tsx', startLine: 1, endLine: 45, prompt: 'Show me two running shoes as product cards in a grid', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-standard-catalog', videoFile: '19-GenUiStandardCatalog', name: 'Standard catalog', videoName: 'GenUiStandardCatalog', docPath: 'generative-ui/components/standard-catalog', route: 'gen-ui-standard-catalog', ideFile: 'frontend/app/gen-ui-standard-catalog/catalog.tsx', startLine: 1, endLine: 45, prompt: 'Show a card with a short welcome text', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-state-actions', videoFile: '20-GenUiStateActions', name: 'State and actions', videoName: 'GenUiStateActions', docPath: 'generative-ui/components/state-and-actions', route: 'gen-ui-state-actions', ideFile: 'frontend/app/gen-ui-state-actions/catalog.tsx', startLine: 1, endLine: 45, prompt: 'Show a product card for product p1 named Trail Runner', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-theming', videoFile: '21-GenUiTheming', name: 'Theming', videoName: 'GenUiTheming', docPath: 'generative-ui/components/theming', route: 'gen-ui-theming', ideFile: 'frontend/app/gen-ui-theming/layout.tsx', startLine: 1, endLine: 45, prompt: 'Show a card with a title and a button', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-transports', videoFile: '22-GenUiTransports', name: 'Transports', videoName: 'GenUiTransports', docPath: 'generative-ui/components/transports', route: 'gen-ui-transports', ideFile: 'frontend/app/gen-ui-transports/layout.tsx', startLine: 1, endLine: 45, prompt: 'Compare the Starter, Team, and Enterprise plans in a table', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-markdown-mode', videoFile: '23-GenUiMarkdownMode', name: 'Markdown mode', videoName: 'GenUiMarkdownMode', docPath: 'generative-ui/components/markdown-mode', route: 'gen-ui-markdown-mode', ideFile: 'frontend/app/gen-ui-markdown-mode/layout.tsx', startLine: 1, endLine: 45, prompt: 'Compare the Starter, Team, and Enterprise plans in a table', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-from-a2ui', videoFile: '24-GenUiFromA2ui', name: 'Adopt from A2UI', videoName: 'GenUiFromA2ui', docPath: 'generative-ui/components/from-a2ui', route: 'gen-ui-from-a2ui', ideFile: 'frontend/app/gen-ui-from-a2ui/catalog.tsx', startLine: 1, endLine: 45, prompt: 'Show the flight from SFO San Francisco to JFK New York with airports and an arrow', waitAfterPromptMs: 3000 },
  { id: 'a2ui', videoFile: '25-A2ui', name: 'A2UI', videoName: 'A2ui', docPath: 'generative-ui/a2ui', route: 'a2ui', ideFile: 'frontend/app/api/copilotkit-a2ui/route.ts', startLine: 1, endLine: 24, extraTabs: [{ filePath: 'frontend/app/a2ui/page.tsx', startLine: 1, endLine: 14 }], prompt: 'Show me a card with a title and a badge.', waitAfterPromptMs: 3000 },
  { id: 'a2ui-dynamic-schema', videoFile: '26-A2uiDynamicSchema', demoMayError: true, name: 'Dynamic Schema A2UI', videoName: 'A2uiDynamicSchema', docPath: 'generative-ui/a2ui/dynamic-schema', route: 'http://localhost:3073/a2ui-dynamic-schema', ideFile: 'frontend/app/a2ui-dynamic-schema/page.broken-dynamic.tsx', startLine: 1, endLine: 45, extraTabs: [{ filePath: 'backend/g2_a2ui_dynamic_agent.py', startLine: 1, endLine: 35 }], prompt: 'Show me a sales dashboard with two metrics and a status badge.', waitAfterPromptMs: 3000 },
  { id: 'a2ui-fixed-schema', videoFile: '27-A2uiFixedSchema', name: 'Fixed Schema A2UI', videoName: 'A2uiFixedSchema', docPath: 'generative-ui/a2ui/fixed-schema', route: 'a2ui-fixed-schema', ideFile: 'frontend/app/a2ui-fixed-schema/page.tsx', startLine: 1, endLine: 40, extraTabs: [{ filePath: 'backend/g2_a2ui_fixed_agent.py', startLine: 1, endLine: 95 }], prompt: 'Show me a flight from SFO to JFK on United for $289.', waitAfterPromptMs: 3000 },
  // ── G2 (end)
  // ── G3 (begin)
  { id: 'gen-ui-mcp-apps', videoFile: '28-GenUiMcpApps', name: 'MCP Apps', videoName: 'GenUiMcpApps', docPath: 'generative-ui/mcp-apps', route: 'gen-ui-mcp-apps', ideFile: 'frontend/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts', startLine: 1, endLine: 45, extraTabs: [{ filePath: 'frontend/app/gen-ui-mcp-apps/page.tsx', startLine: 1, endLine: 20 }], prompt: 'Use the get-time tool to show me the current time.', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-open-gen-ui', videoFile: '29-GenUiOpenGenUi', name: 'Open Generative UI', videoName: 'GenUiOpenGenUi', docPath: 'generative-ui/open-generative-ui', route: 'gen-ui-open-gen-ui', ideFile: 'frontend/app/api/copilotkit-ogui/route.ts', startLine: 14, endLine: 55, extraTabs: [{ filePath: 'frontend/app/gen-ui-open-gen-ui/page.tsx', startLine: 20, endLine: 47 }, { filePath: 'backend/g3_agents.py', startLine: 1, endLine: 32 }], prompt: 'Build me a simple greeting card.', waitAfterPromptMs: 3000 },
  { id: 'shared-state', videoFile: '30-SharedState', demoMayError: true, name: 'Shared State', videoName: 'SharedState', docPath: 'shared-state', route: 'shared-state', ideFile: 'frontend/app/shared-state/page.tsx', startLine: 1, endLine: 45, extraTabs: [{ filePath: 'frontend/app/shared-state/notes-card.tsx', startLine: 1, endLine: 40 }], prompt: 'Hi, I love hiking and I live in Denver. Please note that down.', waitAfterPromptMs: 3000 },
  { id: 'shared-state-rendering-in-app', videoFile: '31-SharedStateRenderingInApp', name: 'Render agent state in your app', videoName: 'SharedStateRenderingInApp', docPath: 'shared-state/rendering-in-app', route: 'shared-state-rendering-in-app', ideFile: 'frontend/app/shared-state-rendering-in-app/components/Canvas.tsx', startLine: 1, endLine: 53, extraTabs: [{ filePath: 'frontend/app/shared-state-rendering-in-app/page.tsx', startLine: 1, endLine: 16 }], prompt: 'What items are on my canvas? Mark the prototype item as done.', waitAfterPromptMs: 3000 },
  { id: 'shared-state-agent-readonly', videoFile: '32-SharedStateAgentReadonly', demoMayError: true, name: 'Agent Read-Only Context', videoName: 'SharedStateAgentReadonly', docPath: 'shared-state/agent-readonly', route: 'http://localhost:3072/shared-state-agent-readonly', ideFile: 'frontend/app/shared-state-agent-readonly/page.broken-readonly.tsx', startLine: 1, endLine: 69, prompt: 'What is my name and timezone?', waitAfterPromptMs: 3000 },
  { id: 'hitl', videoFile: '33-Hitl', name: 'HITL Overview', videoName: 'Hitl', docPath: 'human-in-the-loop/index', route: 'hitl', ideFile: 'frontend/app/hitl/page.tsx', startLine: 1, endLine: 72, extraTabs: [{ filePath: 'frontend/app/hitl/time-picker-card.tsx', startLine: 1, endLine: 40 }, { filePath: 'backend/g3_agents.py', startLine: 1, endLine: 32 }], prompt: 'Please book an intro call with the sales team to discuss pricing.', waitAfterPromptMs: 3000 },
  { id: 'governed-actions', videoFile: '34-GovernedActions', name: 'Governed Action Approval UI', videoName: 'GovernedActions', docPath: 'human-in-the-loop/governed-actions', route: 'governed-actions', ideFile: 'frontend/app/governed-actions/governed.tsx', startLine: 100, endLine: 157, extraTabs: [{ filePath: 'frontend/app/governed-actions/page.tsx', startLine: 1, endLine: 7 }], prompt: 'Send an email to bob@example.com saying hi.', waitAfterPromptMs: 3000 },
  { id: 'webmcp', videoFile: '35-Webmcp', name: 'WebMCP', videoName: 'Webmcp', docPath: 'webmcp', route: 'webmcp', ideFile: 'frontend/app/webmcp/OrderSearch.tsx', startLine: 1, endLine: 34, prompt: 'Search my open orders.', waitAfterPromptMs: 3000 },
  { id: 'subagents', videoFile: '36-Subagents', demoMayError: true, name: 'Sub-Agents', videoName: 'Subagents', docPath: 'multi-agent/subagents', route: 'http://localhost:3071/subagents', ideFile: 'frontend/app/subagents/page.broken-subagents.tsx', startLine: 1, endLine: 30, extraTabs: [{ filePath: 'backend/g3_subagents.py', startLine: 1, endLine: 60 }, { filePath: 'frontend/app/subagents/delegation-log.tsx', startLine: 1, endLine: 40 }], prompt: 'Write a short paragraph about solar power: research it, draft it, then critique it.', waitAfterPromptMs: 3000 },
  // ── G4 (in SKIP_RECORDING: Not available for Agno)
  { id: 'gen-ui-json-render', videoFile: '39-GenUiJsonRender', name: 'JSON Render', videoName: 'GenUiJsonRender', docPath: 'generative-ui/json-render', route: 'gen-ui-json-render', ideFile: 'frontend/app/page.tsx', startLine: 1, endLine: 20, prompt: 'Show me a revenue dashboard.', waitAfterPromptMs: 3000 },
  { id: 'gen-ui-hashbrown', videoFile: '40-GenUiHashbrown', name: 'Hashbrown', videoName: 'GenUiHashbrown', docPath: 'generative-ui/hashbrown', route: 'gen-ui-hashbrown', ideFile: 'frontend/app/page.tsx', startLine: 1, endLine: 20, prompt: 'Show me a Q4 sales dashboard.', waitAfterPromptMs: 3000 },
  // ── G5 (in SKIP_RECORDING: Not available for Agno)
  { id: 'gen-ui-state-rendering', videoFile: '38-GenUiStateRendering', name: 'State Rendering', videoName: 'GenUiStateRendering', docPath: 'generative-ui/state-rendering', route: 'gen-ui-state-rendering', ideFile: 'frontend/app/page.tsx', startLine: 1, endLine: 20, prompt: 'Write a short document about solar power.', waitAfterPromptMs: 3000 },
  { id: 'shared-state-streaming', videoFile: '41-SharedStateStreaming', name: 'State Streaming', videoName: 'SharedStateStreaming', docPath: 'shared-state/streaming', route: 'shared-state-streaming', ideFile: 'frontend/app/page.tsx', startLine: 1, endLine: 20, prompt: 'Write a short document about solar power.', waitAfterPromptMs: 3000 },
  // ── G3 (end)
]);
