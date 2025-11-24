import { chromium } from 'playwright';

(async ()=>{
  const url = process.env.PAGE_URL || 'http://127.0.0.1:5179/';
  console.log('Opening page', url);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    if (!resp || !resp.ok()){
      console.error('Failed to load page, status:', resp && resp.status());
      process.exitCode = 2;
      await browser.close();
      return;
    }

    // wait for last-updated badge or timeout
    try {
      await page.waitForSelector('.last-updated', { timeout: 8000 });
    } catch(e){
      console.error('last-updated element not found on page');
      process.exitCode = 3;
      await browser.close();
      return;
    }

    const text = await page.locator('.last-updated__time').innerText().catch(()=>null);
    console.log('Found last-updated text:', text);
    if (!text) {
      console.error('Badge time text empty');
      process.exitCode = 4;
      await browser.close();
      return;
    }

    console.log('SUCCESS: badge contains text:', text);
    await browser.close();
    process.exitCode = 0;
  } catch (err) {
    console.error('Error during headless check:', err);
    process.exitCode = 1;
    try { await browser.close(); } catch(e){}
  }
})();
