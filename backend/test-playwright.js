import { chromium } from "playwright";

const url =
  "https://www.nike.com/t/air-force-1-07-mens-shoes-DZejrQoC/CW2288-111";

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(url);
await page.waitForLoadState("networkidle");

const html = await page.content();
await browser.close();

const ratingMatch = html.match(/Average Rating ([\d.]+) of 5/);
const averageRating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

console.log("Average rating:", averageRating);

// Let's also look for review count nearby
const index = html.indexOf("reviews-title");
console.log(html.slice(index, index + 800));

const countMatch = html.match(/Reviews \((\d+)\)/);
const reviewCount = countMatch ? parseInt(countMatch[1]) : null;

console.log("Review count:", reviewCount);
