/**
 * Page group G1: finding notes and doc evidence (no imports from agno.actions: avoids an import cycle).
 * Notes: hurried casual text (AUTORECORDER.md section 2), passed through humanizeNote by showFinding.
 * Evidence: every `text` verified visible on the rendered doc page (Playwright, 2026-11-13).
 */
import { type DocEvidence } from './doc-evidence';

export const NOTES_G1: Record<string, string> = {
  'programmatic-control': [
    'programmatic control page, agent trigger does agent.addMessage then copilotkit.runAgent',
    'clicked run agent and nothing happens,dashboard stays idle and messages 0',
    'console shows hydration failed,server rendered text didnt match the client',
    'so the run agent button never does anything and no agent message ever shows',
    'page gives no hint why or how to fix it',
  ].join('\n'),
  // QA-RULES 7 by analogy (temperature-only -> reasoning_effort-only): working clip on the FIX copy + short note.
  'gen-ui-tool-based': [
    'reasoning effort issue',
    'agent on the page has no reasoning_effort none so gpt-6-luna rejects the tool call,400',
    'added it back like the other agno pages and the chart renders',
  ].join('\n'),
  'headless-threads': [
    'page builds the thread list with useThreads agentId my-agent',
    'but CopilotChat has no agentId so it runs on default',
    'chat replies fine, threads get saved under default',
    'so the list asks the wrong agent and stays empty,nothing to click',
    'ThreadSidebar also never calls onSelectThread so u cant open a thread anyway',
  ].join('\n'),
  reasoning: [
    'page says if ur model emits reasoning tokens the card shows up on its own',
    'but theres no agno agent on the page and reasoning-custom is never registered',
    'the quickstart agent has reasoning effort none,so used that',
    'agent answers in plain text and no reasoning card ever shows',
    'page never says how to make an agno agent send reasoning events',
  ].join('\n'),
};

export const EVIDENCE_G1: Record<string, DocEvidence[]> = {
  'programmatic-control': [
    { text: 'agent.addMessage({', caption: 'the trigger adds a user message, but Messages stays 0' },
    { text: 'await copilotkit.runAgent({ agent });', caption: 'Run Agent never runs the agent (hydration error)' },
  ],
  'gen-ui-tool-based': [
    { text: 'model=OpenAIChat(id="gpt-6-luna"),', caption: 'No reasoning_effort="none": 400 Function tools with reasoning_effort are not supported' },
  ],
  'headless-threads': [
    { text: 'useThreads({ agentId: "my-agent" })', caption: 'Thread list asks my-agent; chat runs on default, list stays empty' },
    { text: '<CopilotChat threadId={activeThreadId} />', caption: 'ThreadSidebar never calls onSelectThread; no thread can be opened' },
  ],
  reasoning: [
    { text: 'if your model emits reasoning tokens, the card', caption: 'No Agno agent / reasoning setup on the page; no reasoning card' },
    { text: 'const AGENT_ID = "reasoning-custom";', caption: 'reasoning-custom never registered or shown' },
  ],
};
