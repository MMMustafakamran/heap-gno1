/**
 * Page group G0: finding notes and doc evidence (no imports from agno.actions: avoids an import cycle).
 * Notes: hurried casual text (AUTORECORDER.md section 2), passed through humanizeNote by showFinding.
 * Evidence: every `text` verified visible on the rendered doc page.
 */
import { type DocEvidence } from './doc-evidence';

export const NOTES_G0: Record<string, string> = {};

export const EVIDENCE_G0: Record<string, DocEvidence[]> = {};
