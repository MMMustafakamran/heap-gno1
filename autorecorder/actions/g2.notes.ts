/**
 * Page group G2: finding notes and doc evidence (no imports from agno.actions: avoids an import cycle).
 * Notes: hurried casual text (AUTORECORDER.md section 2), passed through humanizeNote by showFinding.
 * Evidence: every `text` verified in the rendered doc page HTML (2026-11-13).
 */
import { type DocEvidence } from './doc-evidence';

export const NOTES_G2: Record<string, string> = {
  a2ui: [
    'page says pass a2ui {} to the runtime and any a2ui output from ur agent shows up in the chat',
    'but agents default myAgent is never defined and theres no agno agent code at all',
    'used the quickstart agno agent as myAgent',
    'agent just says it cant render a card here and writes a text box,no a2ui surface ever shows',
    'page never says how an agno agent is supposed to send a2ui',
  ].join('\n'),
  'a2ui-dynamic-schema': [
    'code on the page imports a Chat from ./chat and the renderers import card badge button from ../_components',
    'none of those files are shown anywhere on the page',
    'so the route doesnt even build,module not found cant resolve ./chat',
    'and the agno agent imports agents._header_forwarding and a tools module that arent shown either',
    'plus the opt out step is langgraph code,ag_ui_langgraph and langchain_openai on the agno page',
  ].join('\n'),
};

export const EVIDENCE_G2: Record<string, DocEvidence[]> = {
  a2ui: [
    { text: 'agents: { default: myAgent },', caption: 'myAgent is never defined; no Agno agent code on the page' },
    { text: 'any A2UI output returned from your agent will automatically be rendered', caption: 'The Agno agent produces no A2UI; nothing renders' },
  ],
  'a2ui-dynamic-schema': [
    { text: 'import { Chat } from "./chat";', caption: './chat is never shown: Module not found' },
    { text: 'from ag_ui_langgraph import get_a2ui_tools', caption: 'LangGraph code on the Agno page' },
  ],
};
