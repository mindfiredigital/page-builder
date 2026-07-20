import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('http://localhost:4327', { waitUntil: 'load' });
await page.waitForTimeout(2000);
await page.$eval('#canvas', el => el.scrollTop = el.scrollHeight);
await page.waitForTimeout(300);
await page.screenshot({ path: 'scrolled.png' });
await browser.close();
