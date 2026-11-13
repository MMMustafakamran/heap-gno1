/**
 * Page group G1: page-specific action handlers (may import helpers from ./agno.actions).
 */
import { type PageActionHandler } from '../core/types';
import { runStandardAction, sendPrompt } from '../core/actions';
import { sleep } from '../core/overlays/cursor';
import { checkpoint, mark, probeText } from '../core/timeline';
import { glideClick } from './glide-click';
import {
  runThreadsDrawerAction,
  runHeadlessThreadsWithFinding,
  writeFinding,
} from './agno.actions';

/** headless-ui: the doc's own form (input "Type a message..." + Send); the reply shows as a gray bubble. */
const runHeadlessUiAction: PageActionHandler = async (page, config, _root, ctx) => {
  mark('demo', 'custom headless chat');
  await sendPrompt(page, config.prompt, { inputSelector: 'input[placeholder="Type a message..."]', submitSelector: 'button[type="submit"]' });
  const bubbles = page.locator('div.bg-gray-100');
  const ok = await bubbles.first().waitFor({ state: 'visible', timeout: 60000 }).then(() => true).catch(() => false);
  await page.getByText('Thinking...').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
  void checkpoint('reply', 'the agent reply shows in the custom message list', () => (ok ? probeText(bubbles.last()) : null));
  if (!ok) ctx.fail('The headless chat never showed an agent reply.');
  await sleep(config.waitAfterPromptMs ?? 3000);
};

/** programmatic-control: click the doc's "Run Agent" button; the dashboard shows the run (Running, then 2 messages + reply). */
const runProgrammaticControlAction: PageActionHandler = async (page, config, _root, ctx) => {
  mark('click', 'Run Agent');
  await glideClick(page, page.getByRole('button', { name: 'Run Agent' }));
  const agentRow = page.locator('div.font-semibold', { hasText: /^Agent$/ });
  const ok = await agentRow.first().waitFor({ state: 'visible', timeout: 60000 }).then(() => true).catch(() => false);
  await page.getByText('Idle', { exact: true }).waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  void checkpoint('reply', 'the dashboard conversation shows the agent reply', () => (ok ? probeText(page.locator('text=Messages:').first()) : null));
  if (!ok) ctx.fail('copilotkit.runAgent() produced no agent message in the dashboard.');
  await sleep(config.waitAfterPromptMs ?? 3000);
  await writeFinding(page, config.id, config);
};

/** reasoning: the reply must come with the custom reasoning block (data-testid="reasoning-block"); then the finding. */
const runReasoningWithFinding: PageActionHandler = async (page, config, root, ctx) => {
  try {
    await runStandardAction(page, config, root, ctx);
    const block = page.locator('[data-testid="reasoning-block"]');
    const ok = (await block.count()) > 0;
    void checkpoint('render', 'reasoning block in the chat', () => (ok ? probeText(block.first()) : null));
    if (!ok) ctx.fail('No reasoning block rendered: the reply is plain text only.');
  } finally {
    await writeFinding(page, config.id, config);
  }
};

/** gen-ui-tool-based (QA-RULES 7 by analogy): the chart renders on the FIX agent, then the model line + short note. */
const runToolBasedAction: PageActionHandler = async (page, config, root, ctx) => {
  await runStandardAction(page, config, root, ctx);
  const chart = page.locator('.recharts-wrapper, svg.recharts-surface');
  const ok = await chart.first().waitFor({ state: 'visible', timeout: 30000 }).then(() => true).catch(() => false);
  void checkpoint('render', 'bar chart rendered in the chat', async () => ok);
  if (!ok) ctx.fail('The agent called render_bar_chart but no chart rendered.');
  await sleep(2000);
  await writeFinding(page, config.id, config);
};

/** Page id -> handler, merged into ACTION_MAP (actions/index.ts). Pages not listed use runStandardAction. */
export const ACTIONS_G1: Record<string, PageActionHandler> = {
  'headless-ui': runHeadlessUiAction,
  'programmatic-control': runProgrammaticControlAction,
  'threads-drawer': runThreadsDrawerAction,
  'headless-threads': runHeadlessThreadsWithFinding,
  reasoning: runReasoningWithFinding,
  'gen-ui-tool-based': runToolBasedAction,
};
