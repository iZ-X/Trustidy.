import * as cheerio from "cheerio";

export async function getCurrentPrice(url) {
  try {
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
      } catch (error) {
        console.log(`--- Script ${i} failed to parse ---`);
      }
    });

    return currentPrice;
  } catch (error) {
    return null;
  }
}
