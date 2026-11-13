/**
 * Page group G3: page-specific action handlers (may import helpers from ./agno.actions).
 */
import { type Page } from 'playwright';
import { type ActionContext, type PageActionHandler } from '../core/types';
import { runStandardAction, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { sleep } from '../core/overlays/cursor';
import { checkpoint, mark, probeText } from '../core/timeline';
import { SELECTORS } from '../config/selectors.config';
import { glideClick, glideTo } from './glide-click';
import { runHitlAction, runMcpAppsWithFinding, runRouteErrorWithFinding } from './agno.actions';

/** A run error shown by CopilotKit in the chat (e.g. "Frontend tool resume requires a database"). */
const RUN_ERROR = /Frontend tool resume requires a database|Agent error|fetch failed/i;

async function failOnRunError(page: Page, ctx: ActionContext): Promise<void> {
  const err = page.getByText(RUN_ERROR).first();
  if (await err.isVisible().catch(() => false)) {
    mark('error', ((await err.innerText().catch(() => '')) || '').slice(0, 160));
    await glideTo(page, err, 2500);
    ctx.fail(`Run error in the chat: ${(await err.innerText().catch(() => '')).slice(0, 160)}`);
  }
}

async function settle(page: Page, msgCount: number, ctx: ActionContext): Promise<void> {
  try {
    await waitForAgentResponseCompletion(page, 2500, msgCount);
  } catch (e) {
    ctx.warn(`Reply did not complete cleanly: ${String(e).slice(0, 160)}`);
  }
}

/** HITL: the time picker appears, a slot is picked, the agent resumes with no run error. */
const runG3HitlAction: PageActionHandler = async (page, config, root, ctx) => {
  await runHitlAction(page, config, root, ctx);
  await failOnRunError(page, ctx);
};

/** Open Generative UI: the reply must mount the sandboxed iframe, with no run error. */
const runOpenGenUiAction: PageActionHandler = async (page, config, root, ctx) => {
  await runStandardAction(page, config, root, ctx);
  const frame = page.locator(`${SELECTORS.assistantMessage} iframe, iframe`).last();
  const ok = await frame.waitFor({ state: 'visible', timeout: 60000 }).then(() => true).catch(() => false);
  void checkpoint('render', 'sandboxed UI iframe rendered', () => (ok ? 'iframe' : null));
  if (ok) await glideTo(page, frame, 4000);
  else ctx.fail('No sandboxed UI rendered.');
  await failOnRunError(page, ctx);
};

/** Governed actions (useHumanInTheLoop pattern): approval card, Approve and run, agent continues. */
const runGovernedAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  const card = page.getByText('User approval required', { exact: false }).first();
  const shown = await card.waitFor({ state: 'visible', timeout: 90000 }).then(() => true).catch(() => false);
  void checkpoint('render', 'approval card shown', () => (shown ? 'User approval required' : null));
  if (!shown) {
    mark('error', 'no approval card');
    ctx.fail('No approval card appeared; the agent replied in text.');
    return;
  }
  await glideTo(page, card, 3000);
  const approve = page.getByRole('button', { name: 'Approve and run' }).first();
  await glideClick(page, approve);
  mark('click', 'Approve and run');
  await sleep(1500);
  await settle(page, msgCount, ctx);
  await sleep(2500);
  const last = page.locator(SELECTORS.assistantMessage).last();
  void checkpoint('reply', 'agent continued after approval', () => probeText(last));
  await failOnRunError(page, ctx);
};

/**
 * Level-2 pages (team doc ❌, ours fails the same way): the clip is doc -> IDE -> demo and ends there
 * (no evidence, no Notepad). The take still fails, so the failure terminal follows.
 */
const runRouteErrorShort: PageActionHandler = async (page, config, _root, ctx) => {
  const input = page.locator(SELECTORS.chatInput).first();
  const dialog = page.locator('nextjs-portal [data-nextjs-dialog], nextjs-portal [role=dialog]').first();
  const which = await Promise.race([
    input.waitFor({ state: 'visible', timeout: 20000 }).then(() => 'chat' as const),
    dialog.waitFor({ state: 'visible', timeout: 20000 }).then(() => 'error' as const),
  ]).catch(() => 'none' as const);
  const body = ((await page.locator('body').innerText().catch(() => '')) || '').replace(/\s+/g, ' ');
  const err = /Module not found[^.]*|[A-Za-z]+ is not defined/.exec(body)?.[0] ?? '';
  if (which === 'chat' && !err) {
    ctx.fail('Expected the page to fail (doc fragments), but the chat rendered.');
    return;
  }
  mark('error', err || 'route rendered no chat');
  void checkpoint('chat', 'page rendered without error', () => null);
  await glideTo(page, which === 'error' ? dialog : page.locator('body'), 6000);
  await sleep(2500);
  ctx.fail(`Page never worked: ${err || 'no chat input, no error overlay'}`);
};

/** Render agent state (level 2): canvas renders, but the agent neither sees nor changes it. */
const runRenderingInAppShort: PageActionHandler = async (page, config, _root, ctx) => {
  const prototype = page.locator('main.canvas li', { hasText: 'Build a prototype' }).first();
  await prototype.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  await glideTo(page, page.locator('main.canvas').first(), 2500);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  await sleep(3000);
  const done = (await prototype.getAttribute('data-done').catch(() => null)) === 'true';
  void checkpoint('state', 'agent marked "Build a prototype" done in agent.state', () => (done ? 'data-done=true' : null));
  await glideTo(page, page.locator(SELECTORS.assistantMessage).last(), 3000);
  await glideTo(page, prototype, 2500);
  if (!done) {
    mark('error', 'canvas unchanged');
    ctx.fail('The agent never read or changed the canvas state ("Build a prototype" still not done).');
  }
};

/** Page id -> handler, merged into ACTION_MAP (actions/index.ts). Pages not listed use runStandardAction. */
export const ACTIONS_G3: Record<string, PageActionHandler> = {
  'gen-ui-mcp-apps': runMcpAppsWithFinding,
  'gen-ui-open-gen-ui': runOpenGenUiAction,
  'shared-state': runRouteErrorShort,
  'shared-state-rendering-in-app': runRenderingInAppShort,
  'shared-state-agent-readonly': runRouteErrorShort,
  hitl: runG3HitlAction,
  'governed-actions': runGovernedAction,
  subagents: runRouteErrorWithFinding,
};
