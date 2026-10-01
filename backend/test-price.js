import * as cheerio from "cheerio";

const url =
  "https://www.nike.com/t/air-force-1-07-mens-shoes-DZejrQoC/CW2288-111";

const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);

let currentPrice = null;

$("script[type='application/ld+json']").each((i, el) => {
  if (currentPrice) return;

  const content = $(el).html();
  try {
    const json = JSON.parse(content);
    const items = Array.isArray(json) ? json : [json];

    for (const item of items) {
      if (item.offers?.price) {
        currentPrice = item.offers.price;
      } else if (item.hasVariant?.[0]?.offers?.price) {
        currentPrice = item.hasVariant[0].offers.price;
      }
    }

    console.log(`Current Price: ${currentPrice}`);
    // console.log(`--- Script ${i} ---`);
    // console.log(JSON.stringify(json, null, 2).slice(0, 2000)); // Print first 2000 characters of JSON
  } catch (error) {
    console.log(`--- Script ${i} failed to parse ---`);
  }
});
