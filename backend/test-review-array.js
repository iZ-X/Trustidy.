import * as cheerio from "cheerio";

const url =
  "https://www.gymshark.com/products/gymshark-everyday-holdall-small-bags-black-aw26";

const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);

$("script[type='application/ld+json']").each((i, el) => {
  try {
    const json = JSON.parse($(el).html());
    const items = Array.isArray(json) ? json : [json];

    for (const item of items) {
      if (item.review) {
        console.log(
          "Found individual reviews:",
          JSON.stringify(item.review.slice(0, 2), null, 2),
        );
      }
    }
  } catch (e) {
    // skip
  }
});

console.log("done checking.");
