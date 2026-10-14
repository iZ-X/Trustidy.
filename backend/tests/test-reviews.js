import * as cheerio from "cheerio";

const url =
  "https://www.gymshark.com/products/gymshark-everyday-holdall-small-bags-black-aw26";

const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);

$("script[type='application/ld+json']").each((i, el) => {
  const content = $(el).html();
  try {
    const json = JSON.parse(content);
    const items = Array.isArray(json) ? json : [json];

    for (const item of items) {
      if (item.aggregateRating) {
        console.log(
          "Found aggregateRating:",
          JSON.stringify(item.aggregateRating, null, 2),
        );
      }
    }
  } catch (e) {
    // skip
  }
});
