import { chromium } from "playwright";

const url =
  "https://www.gymshark.com/products/gymshark-everyday-holdall-small-bags-black-aw26";

const browser = await chromium.launch();
const page = await browser.newPage();

const requests = [];

page.on("request", (request) => {
  if (
    request.url().toLowerCase().includes("review") ||
    request.url().toLowerCase().includes("loox")
  ) {
    requests.push(request.url());
  }
});

await page.goto(url);

try {
  await page.waitForLoadState("networkidle", { timeout: 10000 });
} catch (e) {
  console.log("Network never went fully idle, continuing anyway.");
}

await browser.close();

console.log("Review-related requests found:");
requests.forEach((r) => console.log(r));
