const puppeteer = require('puppeteer');
const path = require('path');

const screenshots = [
  { name: 'home', path: '/' },
  { name: 'jobs', path: '/jobs' },
  { name: 'profile', path: '/profile' },
];

async function generateScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to iPhone 12 Pro dimensions
  await page.setViewport({
    width: 1170,
    height: 2532,
    deviceScaleFactor: 2,
  });

  for (const screenshot of screenshots) {
    // Navigate to the page
    await page.goto(`http://localhost:3000${screenshot.path}`, {
      waitUntil: 'networkidle0',
    });

    // Take screenshot
    await page.screenshot({
      path: path.join(__dirname, `../public/screenshots/${screenshot.name}.png`),
      fullPage: true,
    });
  }

  await browser.close();
}

generateScreenshots().catch(console.error); 