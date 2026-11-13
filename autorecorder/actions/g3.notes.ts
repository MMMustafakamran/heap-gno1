/**
 * Page group G3: finding notes and doc evidence (no imports from agno.actions: avoids an import cycle).
 * Notes: hurried casual text (AUTORECORDER.md section 2), passed through humanizeNote by showFinding.
 * Evidence: every `text` verified visible on the rendered doc page (2026-11-13, Playwright, no tab clicks).
 */
import { type DocEvidence } from './doc-evidence';

export const NOTES_G3: Record<string, string> = {
  // Level 1 (team doc ✅, ours ❌): new big bug.
  subagents: [
    'sub agents page, the code tab page.tsx imports subagent-activity-card, demo-layout, active-subagent and suggestions',
    'none of those 4 files is shown anywhere on the page',
    'so next just fails, module not found cant resolve ./subagent-activity-card and the page never loads',
    'delegation log snippet also uses SUB_AGENT_STYLE and the props type which are never defined',
    'backend side the agent_server.py in the code tab imports a bunch of unshown modules too, so u cant run it as written',
  ].join('\n'),
  // Level 2 (team doc ❌, same failure): KNOWN_ISSUE, the clip ends after the demo; kept for reference.
  'shared-state': [
    'shared state page only gives fragments of page.tsx and the notes card',
    'Card, CardHeader, Button, NotesCardProps, RWAgentState never defined or imported',
    'page crashes with card is not defined',
    'and theres no agno agent at all, the set_notes tool the ui waits for is never shown',
  ].join('\n'),
  'shared-state-rendering-in-app': [
    'render agent state page, canvas shows the ui owned items fine',
    'but the agent never sees that state, asked it about the canvas and it said it cant access it',
    'and it never marks an item done, the page shows no agno side for state at all',
    'canvas.tsx also needs use client, it crashes without it',
  ].join('\n'),
  'shared-state-agent-readonly': [
    'agent read only context page, page.tsx imports ./demo-layout and ./suggestions',
    'neither file is shown on the page',
    'next fails with module not found cant resolve ./demo-layout so the demo never loads',
  ].join('\n'),
};

export const EVIDENCE_G3: Record<string, DocEvidence[]> = {
  subagents: [
    { text: 'SUB_AGENT_STYLE[subAgent]', caption: 'DelegationLog uses SUB_AGENT_STYLE (and SubAgentName, DelegationLogProps), never defined' },
    { text: 'render one card per entry', caption: 'the only frontend guidance; the Code-tab page.tsx imports 4 files no tab shows' },
  ],
  'shared-state': [
    { text: '<Card data-testid', caption: 'NotesCard uses Card/CardHeader/Button and NotesCardProps, never imported or defined' },
    { text: 'notes, // preserve what the agent has written', caption: 'page.tsx is fragments only: notes, RWAgentState, Preferences never defined' },
  ],
  'shared-state-rendering-in-app': [
    { text: 'Every time the agent mutates its state', caption: 'the agent never sees or writes the canvas state on Agno' },
  ],
  'shared-state-agent-readonly': [
    { text: 'import { ACTIVITIES, DemoLayout } from "./demo-layout";', caption: './demo-layout and ./suggestions are never shown' },
  ],
};
