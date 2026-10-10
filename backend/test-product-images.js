import * as cheerio from "cheerio";

const url =
  "https://www.nike.com/t/air-force-1-07-mens-shoes-XVPIszaq/IR1981-100";

const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);

$("script[type='application/ld+json']").each((i, el) => {
  try {
    const json = JSON.parse($(el).html());
    const items = Array.isArray(json) ? json : [json];

    for (const item of items) {
      if (item.image) {
        console.log(`Script ${i}, type ${item["@type"]}:`, item.image);
      }
      if (item.hasVariant?.[0]?.image) {
        console.log(`Script ${i}, variant image:`, item.hasVariant[0].image);
      }
    }
  } catch (e) {
    // skip
  }
});
