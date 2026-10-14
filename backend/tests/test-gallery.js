import { chromium } from "playwright";

const url =
  "https://www.nike.com/t/air-force-1-07-mens-shoes-XVPIszaq/IR1981-100";

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(url);
await page.waitForLoadState("networkidle");

const html = await page.content();
await browser.close();

const matches = html.match(
  /https:\/\/static\.nike\.com[^"'\s)]+\.(png|jpg|jpeg)/g,
);
const uniqueImages = [...new Set(matches)];

console.log(`Found ${uniqueImages.length} unique images`);
uniqueImages.forEach((img) => console.log(img));
