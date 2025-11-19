import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const out = path.join(process.cwd(), 'smoke-test-results');
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Opening smoke test page...');
  await page.goto('http://localhost:8000/smoke-test.html', { waitUntil: 'networkidle' });

  console.log('Taking initial screenshot...');
  await page.screenshot({ path: `${out}/initial.png`, fullPage: true });

  console.log('Triggering toast...');
  await page.click('#btn-toast');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/toast.png`, fullPage: true });

  console.log('Triggering loader...');
  await page.click('#btn-loader');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/loader.png`, fullPage: true });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${out}/loader-after.png`, fullPage: true });

  console.log('Triggering cart event...');
  await page.click('#btn-cart-event');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/cart-event.png`, fullPage: true });

  await browser.close();
  console.log('Smoke test complete. Screenshots saved to', out);
})();
