import * as cheerio from "cheerio";

export async function getReviewInfo(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    let reviewCount = null;
    let averageRating = null;

    $("script[type='application/ld+json']").each((i, el) => {
      if (reviewCount !== null) return;

      const content = $(el).html();
      try {
        const json = JSON.parse(content);
        const items = Array.isArray(json) ? json : [json];

        for (const item of items) {
          if (item.aggregateRating) {
            reviewCount = item.aggregateRating.reviewCount ?? null;
            averageRating = item.aggregateRating.ratingValue ?? null;
          }
        }
      } catch (e) {
        // not valid JSON, skip
      }
    });

    return { reviewCount, averageRating };
  } catch (error) {
    return { reviewCount: null, averageRating: null };
  }
}
