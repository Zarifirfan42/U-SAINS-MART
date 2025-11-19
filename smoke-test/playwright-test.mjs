import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Wait for the local static server to be available before launching Playwright
async function waitForServer(url = 'http://127.0.0.1:8000/', attempts = 15, delay = 1000) {
  for (let i = 0; i < attempts; i++) {
    try {
      // Node 18+ has global fetch; try a simple GET
      const res = await fetch(url, { method: 'GET' });
      if (res && (res.ok || res.status === 200)) {
        console.log('Server reachable:', url);
        return;
      }
    } catch (e) {
      // ignore and retry
    }
    console.log(`Server not ready yet, retry ${i + 1}/${attempts}...`);
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error(`Server did not become reachable at ${url}`);
}

(async () => {
  const out = path.join(process.cwd(), 'smoke-test-results');
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

  const baseUrl = 'http://127.0.0.1:8000/smoke-test.html';
  try {
    await waitForServer('http://127.0.0.1:8000/');
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let failed = false;

  console.log('Opening smoke test page...');
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 10000 });

  // Basic DOM sanity checks
  try {
    await page.waitForSelector('#test-area', { timeout: 5000 });
    console.log('Found #test-area');
  } catch (e) {
    console.warn('Missing #test-area or the page did not render as expected');
  }

  console.log('Taking initial screenshot...');
  await page.screenshot({ path: `${out}/initial.png`, fullPage: true });

  // Toast assertion
  console.log('Triggering toast...');
  await page.click('#btn-toast');
  try {
    const toastEl = await page.waitForSelector('.toast .toast-body', { timeout: 2000 });
    const toastText = await toastEl.textContent();
    console.log('Toast shown, text:', (toastText || '').trim());
  } catch (e) {
    console.error('Toast did not appear as expected');
    failed = true;
  }
  await page.screenshot({ path: `${out}/toast.png`, fullPage: true });

  // Loader assertion
  console.log('Triggering loader...');
  await page.click('#btn-loader');
  try {
    await page.waitForSelector('#global-loader', { state: 'visible', timeout: 1500 });
    console.log('Loader visible');
    // wait until loader hides
    await page.waitForSelector('#global-loader', { state: 'hidden', timeout: 3000 });
    console.log('Loader hidden after timeout');
  } catch (e) {
    console.error('Loader did not behave as expected');
    failed = true;
  }
  await page.screenshot({ path: `${out}/loader.png`, fullPage: true });
  await page.screenshot({ path: `${out}/loader-after.png`, fullPage: true });

  // Cart event assertion (shows toast and cart-badge should exist)
  console.log('Triggering cart event...');
  await page.click('#btn-cart-event');
  try {
    const cartBadge = await page.waitForSelector('#cart-badge', { timeout: 1500 });
    const badgeText = await cartBadge.textContent();
    console.log('Cart badge exists with text:', (badgeText || '').trim());
  } catch (e) {
    console.warn('Cart badge not found in DOM');
    failed = true;
  }
  try {
    const toastEl2 = await page.waitForSelector('.toast .toast-body', { timeout: 2000 });
    const toastText2 = await toastEl2.textContent();
    console.log('Cart-event toast text:', (toastText2 || '').trim());
  } catch (e) {
    console.error('Cart-event toast did not appear');
    failed = true;
  }
  await page.screenshot({ path: `${out}/cart-event.png`, fullPage: true });

  // Additional smoke checks: add to cart + remove from cart + navigation
  console.log('Testing add/remove cart and navigation...');
  try {
    await page.click('#btn-add-to-cart');
    await page.waitForTimeout(300);
    const badgeAfterAdd = await page.$eval('#cart-badge', (el) => el.textContent.trim());
    console.log('Badge after add:', badgeAfterAdd);
    if (!badgeAfterAdd || badgeAfterAdd === '0') {
      throw new Error('Badge did not update after add');
    }
  } catch (e) {
    console.error('Add to cart check failed:', e.message || e);
    failed = true;
  }

  try {
    await page.click('#btn-remove-from-cart');
    await page.waitForTimeout(300);
    const badgeAfterRemove = await page.$eval('#cart-badge', (el) => el.textContent.trim());
    console.log('Badge after remove:', badgeAfterRemove);
  } catch (e) {
    console.error('Remove from cart check failed:', e.message || e);
    failed = true;
  }

  try {
    // Open product details (navigation)
    const [nav] = await Promise.all([
      page.waitForNavigation({ timeout: 5000 }),
      page.click('#btn-open-details')
    ]);
    console.log('Navigated to product details:', page.url());
    // go back
    await page.goBack();
  } catch (e) {
    console.error('Navigation to product details failed:', e.message || e);
    failed = true;
  }

  try {
    // navigate to products page
    const [navProducts] = await Promise.all([
      page.waitForNavigation({ timeout: 5000 }),
      page.click('#btn-nav-products')
    ]);
    console.log('Navigated to products page:', page.url());
    await page.goBack();
  } catch (e) {
    console.error('Navigation to products failed:', e.message || e);
    failed = true;
  }

  await browser.close();
  console.log('Smoke test complete. Screenshots saved to', out);
})();
