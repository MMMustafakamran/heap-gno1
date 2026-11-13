/**
 * Which handler serves which page id. Pages not listed here use runStandardAction
 * (send the page's prompt, wait for the reply).
 */
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';
import { runStandardAction } from '../core/actions';
import { type Page } from 'playwright';

import { waitForPageReady } from './page-ready';
import {
  runFrontendToolsAction,
  runHeadlessInterruptAction,
  runHitlAction,
  runInspectorAction,
  runSharedStateAction,
  runStandardWithFinding,
  runStateRenderingAction,
  runSubagentsAction,
  runChatControlsAction,
  runUseInterruptAction,
  runThreadsDrawerAction,
  runHeadlessThreadsAction,
  runRouteErrorWithFinding,
  runSurfaceWithFinding,
  runHeadlessThreadsWithFinding,
  runHashbrownWithFinding,
  runFixedSchemaWithFinding,
  runGovernedWithFinding,
  runMcpAppsWithFinding,
  runDocumentStateAction,
  runAttachmentsAction,
  runJsonRenderAction,
} from './agno.actions';
import { ACTIONS_G0 } from './g0.actions';
import { ACTIONS_G1 } from './g1.actions';
import { ACTIONS_G2 } from './g2.actions';
import { ACTIONS_G3 } from './g3.actions';

/** Keys are page ids from `config/pages.config.ts`. Doctor flags any orphans. */
export const ACTION_MAP: Record<string, PageActionHandler> = {
  // Each page group registers its own handlers in actions/g<N>.actions.ts.
  ...ACTIONS_G0,
  ...ACTIONS_G1,
  ...ACTIONS_G2,
  ...ACTIONS_G3,
};

export async function executePageAction(
  page: Page,
  config: PageRecordConfig,
  rootPath: string,
  ctx: ActionContext,
): Promise<void> {
  // A dev server compiles client chunks lazily, so markup can be on screen before
  // anything is wired to it. Wait for the page to settle before any handler runs.
  await waitForPageReady(page, { label: config.id });

  const handler = ACTION_MAP[config.id] ?? runStandardAction;
  await handler(page, config, rootPath, ctx);
}
