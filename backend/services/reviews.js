import * as cheerio from "cheerio";
import { chromium } from "playwright";

async function getReviewsFromJsonLd(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  let reviewCount = null;
  let averageRating = null;

  $("script[type='application/ld+json']").each((i, el) => {
    if (reviewCount !== null) return;

    try {
      const json = JSON.parse($(el).html());
      const items = Array.isArray(json) ? json : [json];

      for (const item of items) {
        if (item.aggregateRating) {
          reviewCount = item.aggregateRating.reviewCount ?? null;
          averageRating = item.aggregateRating.ratingValue ?? null;
        }
      }
    } catch (e) {
      // skip
    }
  });

  return { reviewCount, averageRating };
}

async function getReviewsFromPlaywright(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const html = await page.content();

    const ratingMatch = html.match(/Average Rating ([\d.]+) of 5/);
    const countMatch = html.match(/Reviews \((\d+)\)/);

    return {
      averageRating: ratingMatch ? parseFloat(ratingMatch[1]) : null,
      reviewCount: countMatch ? parseInt(countMatch[1]) : null,
    };
  } finally {
    await browser.close();
  }
}

export async function getReviewInfo(url) {
  try {
    const jsonLdResult = await getReviewsFromJsonLd(url);

    if (jsonLdResult.reviewCount !== null) {
      return jsonLdResult;
    }

    return await getReviewsFromPlaywright(url);
  } catch (error) {
    return { reviewCount: null, averageRating: null };
  }
}
