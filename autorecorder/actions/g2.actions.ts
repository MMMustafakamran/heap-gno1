/**
 * Page group G2: page-specific action handlers (may import helpers from ./agno.actions).
 * Generative UI (components and surfaces, A2UI) pages.
 */
import { type Page } from 'playwright';
import { type PageActionHandler, type ActionContext } from '../core/types';
import { sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { sleep } from '../core/overlays/cursor';
import { checkpoint, mark, probeText } from '../core/timeline';
import { glideClick, glideTo } from './glide-click';
import { writeFinding, runRouteErrorWithFinding, runFixedSchemaWithFinding } from './agno.actions';

/**
 * Today's markup of a rendered surface: chat surfaces carry data-generative-ui-chat-surface, every
 * surface root data-generative-ui-root (the older data-generative-ui-surface is kept as a fallback).
 */
const SURFACE = '[data-generative-ui-root], [data-generative-ui-chat-surface], [data-generative-ui-surface], .a2ui-surface';
const ERROR_CARD = 'Unable to display';

async function settle(page: Page, msgCount: number, ctx: ActionContext): Promise<void> {
  try {
    await waitForAgentResponseCompletion(page, 2500, msgCount);
  } catch (e) {
    // A reply that is only a surface has no text: not a failure here, the surface check decides.
    ctx.warn(`Reply did not complete cleanly: ${String(e).slice(0, 160)}`);
  }
}

/**
 * Generative UI take: the reply must render a surface (in the chat, or in the page target
 * `within`), with no "Unable to display" card. Otherwise the take fails, then the finding (if any).
 */
function surfaceAction(opts: { within?: string; expectText?: RegExp; what: string; timeoutMs?: number }): PageActionHandler {
  return async (page, config, _root, ctx) => {
    try {
      const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
      const scope = opts.within ? page.locator(opts.within) : page.locator('body');
      const surface = scope.locator(SURFACE).last();
      const shown = await surface.waitFor({ state: 'visible', timeout: opts.timeoutMs ?? 120000 }).then(() => true).catch(() => false);
      await settle(page, msgCount, ctx);
      await sleep(1500);
      const errorCard = page.getByText(ERROR_CARD, { exact: false }).first();
      const broken = await errorCard.isVisible().catch(() => false);
      const text = shown ? ((await surface.innerText().catch(() => '')) || '') : '';
      const textOk = !opts.expectText || opts.expectText.test(text);
      void checkpoint('render', opts.what, () => (shown && !broken && textOk ? probeText(surface) : null));
      if (broken) {
        mark('error', 'Unable to display');
        await glideTo(page, errorCard, 2500);
        ctx.fail(`Surface error: ${(await errorCard.innerText().catch(() => '')).slice(0, 160)}`);
      } else if (!shown) {
        mark('error', 'no surface');
        ctx.fail(`No generative UI surface rendered (${opts.what}); the reply is text only.`);
      } else {
        await glideTo(page, surface, 3000);
        if (!textOk) ctx.fail(`${opts.what}: the surface rendered without the expected content (${text.replace(/\s+/g, ' ').slice(0, 120)}).`);
      }
      await sleep(2000);
    } finally {
      await writeFinding(page, config.id, config);
    }
  };
}

/**
 * State and actions: the ProductCard renders, its "Add to cart" button runs the app's addToCart
 * function (useGenerativeUIFunction) and the cart line changes.
 */
const stateActionsAction: PageActionHandler = async (page, config, root, ctx) => {
  try {
    await surfaceAction({ what: 'ProductCard in the chat', timeoutMs: 120000 })(page, { ...config, id: '__g2_no_finding__' }, root, ctx);
    const btn = page.locator(SURFACE).last().getByRole('button', { name: /add to cart/i }).first();
    if (!(await btn.isVisible().catch(() => false))) {
      ctx.fail('No "Add to cart" button in the surface.');
      return;
    }
    await glideClick(page, btn);
    mark('click', 'Add to cart');
    await sleep(3000);
    const cart = page.locator('[data-testid="cart"]');
    const cartText = ((await cart.innerText().catch(() => '')) || '').trim();
    const alert = page.locator(SURFACE).last().locator('[role="alert"]');
    const alertText = (await alert.isVisible().catch(() => false)) ? ((await alert.innerText().catch(() => '')) || '') : '';
    void checkpoint('cart', 'cart updated after Add to cart', () => (/x\d/.test(cartText) ? cartText : null));
    await glideTo(page, alertText ? alert : cart, 2500);
    if (!/x\d/.test(cartText)) ctx.fail(`Add to cart did nothing: ${cartText}${alertText ? ` / card error: ${alertText}` : ''}`);
    await sleep(2000);
  } finally {
    await writeFinding(page, config.id, config);
  }
};

/** Page id -> handler, merged into ACTION_MAP (actions/index.ts). Pages not listed use runStandardAction. */
export const ACTIONS_G2: Record<string, PageActionHandler> = {
  'gen-ui-components': surfaceAction({ what: 'standard-catalog surface in the chat' }),
  'gen-ui-surfaces': surfaceAction({ within: '[data-g2-featured]', what: 'surface in the Featured Products target', expectText: /\$\s*[1-9]/ }),
  'gen-ui-catalogs': surfaceAction({ what: 'ProductCard surface in the chat' }),
  'gen-ui-standard-catalog': surfaceAction({ what: 'standard-catalog card in the chat' }),
  'gen-ui-state-actions': stateActionsAction,
  'gen-ui-theming': surfaceAction({ what: 'themed card in the chat' }),
  'gen-ui-transports': surfaceAction({ what: 'surface in the chat' }),
  'gen-ui-markdown-mode': surfaceAction({ what: 'surface written in the markdown reply' }),
  'a2ui': surfaceAction({ what: 'A2UI surface in the chat' }),
  'a2ui-dynamic-schema': runRouteErrorWithFinding,
  'a2ui-fixed-schema': runFixedSchemaWithFinding,
  'gen-ui-from-a2ui': surfaceAction({ what: 'Airport / Arrow flight surface', expectText: /SFO[\s\S]*JFK|JFK[\s\S]*SFO/ }),
};
