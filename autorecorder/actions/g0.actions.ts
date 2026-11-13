/**
 * Page group G0: page-specific action handlers (may import helpers from ./agno.actions).
 */
import { type PageActionHandler } from '../core/types';

/** Page id -> handler, merged into ACTION_MAP (actions/index.ts). Pages not listed use runStandardAction. */
export const ACTIONS_G0: Record<string, PageActionHandler> = {};
