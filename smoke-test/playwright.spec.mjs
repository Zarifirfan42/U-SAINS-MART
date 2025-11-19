import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

let serverProc = null;

async function waitForServer(url = 'http://127.0.0.1:8000/', attempts = 20, delay = 500) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res && (res.ok || res.status === 200)) return;
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error(`Server not reachable at ${url}`);
}

test.beforeAll(async () => {
  // Try to start a local http-server via npx if nothing is listening
  try {
    await fetch('http://127.0.0.1:8000/', { method: 'GET' });
    // server already running
    return;
  } catch (e) {
    // spawn http-server using npx directly which works better on Windows
    try {
      serverProc = spawn('npx', ['http-server', '-p', '8000'], {
        stdio: 'ignore',
        detached: true,
        shell: true
      });
      if (serverProc && serverProc.unref) serverProc.unref();
    } catch (spawnErr) {
      console.warn('Failed to spawn http-server via npx:', spawnErr);
    }

    // increase wait attempts in case npx downloads the binary
    await waitForServer('http://127.0.0.1:8000/', 30, 500);
  }
});

test.afterAll(async () => {
  if (serverProc && serverProc.pid) {
    try {
      process.kill(serverProc.pid);
    } catch (e) {
      // ignore
    }
  }
});

test.describe('Smoke tests', () => {
  test('initial load and UI elements', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/smoke-test.html', { waitUntil: 'networkidle' });
    await expect(page.locator('#test-area')).toBeVisible();
    await page.screenshot({ path: 'smoke-test-results/initial-playwright.png', fullPage: true });
  });

  test('toast and loader behavior', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/smoke-test.html');
    await page.click('#btn-toast');
    await expect(page.locator('.toast .toast-body')).toBeVisible({ timeout: 2000 });
    await page.screenshot({ path: 'smoke-test-results/toast-playwright.png', fullPage: true });

    await page.click('#btn-loader');
    await expect(page.locator('#global-loader')).toBeVisible({ timeout: 1500 });
    await expect(page.locator('#global-loader')).toBeHidden({ timeout: 4000 });
    await page.screenshot({ path: 'smoke-test-results/loader-playwright.png', fullPage: true });
  });

  test('cart events and add/remove', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/smoke-test.html');
    await page.click('#btn-cart-event');
    await expect(page.locator('.toast .toast-body')).toBeVisible({ timeout: 2000 });
    // cart-badge may be present but hidden when count is zero; ensure the element exists in the DOM
    await expect(page.locator('#cart-badge')).toHaveCount(1);

    // add to cart programmatically
    await page.click('#btn-add-to-cart');
    await page.waitForTimeout(300);
    const badgeAfterAdd = (await page.locator('#cart-badge').textContent()).trim();
    expect(Number(badgeAfterAdd)).toBeGreaterThan(0);

    // remove
    await page.click('#btn-remove-from-cart');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'smoke-test-results/cart-playwright.png', fullPage: true });
  });

  test('navigation to product details and products', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/smoke-test.html');
    await Promise.all([
      page.waitForNavigation({ timeout: 5000 }),
      page.click('#btn-open-details')
    ]);
    await expect(page).toHaveURL(/product-details.html\?id=/);
    await page.goBack();

    await Promise.all([
      page.waitForNavigation({ timeout: 5000 }),
      page.click('#btn-nav-products')
    ]);
    await expect(page).toHaveURL(/products.html$/);
  });
});
