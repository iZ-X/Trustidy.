import * as cheerio from "cheerio";

const url = "https://nike.com";

const response = await fetch(url);
const html = await response.text();

console.log("Status:", response.status);
console.log("HTML length:", html.length);
console.log(html.slice(0, 500));
console.log("Contains 'instagram':", html.toLowerCase().includes("instagram"));

const index = html.toLowerCase().indexOf("instagram");
console.log(html.slice(index - 100, index + 200));

const $ = cheerio.load(html);

const match = html.match(
  /https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?/,
);
const instagramUrl = match ? match[0] : null;

$("a[href*='instagram.com']").each((i, el) => {
  if (!instagramUrl) {
    instagramUrl = $(el).attr("href");
  }
});

console.log("ig link found:", instagramUrl);
