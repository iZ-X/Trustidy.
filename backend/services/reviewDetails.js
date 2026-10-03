import * as cheerio from "cheerio";
import { chromium } from "playwright";

async function captureReviewApiUrl(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let apiUrl = null;

  page.on("request", (request) => {
    const reqUrl = request.url();
    if (
      !apiUrl &&
      reqUrl.includes("/data/reviews.json") &&
      reqUrl.includes("passkey=")
    ) {
      apiUrl = reqUrl;
    }
  });

  await page.goto(url);

  try {
    await page.waitForLoadState("networkidle", { timeout: 10000 });
  } catch (error) {
    // continue
  }

  await browser.close();

  return apiUrl;
}

async function fetchFromPowerReviews(apiUrl) {
  try {
    const biggerUrl = apiUrl.replace(/Limit=\d+/, "Limit=100");
    const response = await fetch(biggerUrl);
    const data = await response.json();

    return data.Results.map((r) => ({
      date: r.SubmissionTime,
      text: r.ReviewText,
    }));
  } catch (error) {
    return [];
  }
}

async function getIndividualReviews(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    let reviews = [];

    $("script[type='application/ld+json']").each((i, el) => {
      try {
        const json = JSON.parse($(el).html());
        const items = Array.isArray(json) ? json : [json];

        for (const item of items) {
          if (item.review) {
            reviews = item.review.map((r) => ({
              date: r.datePublished,
              text: r.description,
            }));
          }
        }
      } catch (e) {
        // skip
      }
    });

    if (reviews.length >= 10) {
      return reviews;
    }

    const apiUrl = await captureReviewApiUrl(url);
    if (apiUrl) {
      const powerReviewsResults = await fetchFromPowerReviews(apiUrl);
      if (powerReviewsResults.length > 0) {
        return powerReviewsResults;
      }
    }

    return reviews;
  } catch (error) {
    return [];
  }
}

function calculateDateClustering(reviews) {
  if (reviews.length < 10) return null;

  const dayCounts = {};

  for (const review of reviews) {
    if (!review.date) continue;
    const day = review.date.slice(0, 10);
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  }

  const counts = Object.values(dayCounts);
  if (counts.length === 0) return null;

  const maxDayCount = Math.max(...counts);
  const percentage = maxDayCount / reviews.length;

  return percentage > 0.4;
}

function calculateGenericScore(reviews) {
  if (reviews.length < 10) return null;

  const genericCount = reviews.filter((r) => {
    if (!r.text) return true;
    const wordCount = r.text.trim().split(/\s+/).length;
    return wordCount < 5;
  }).length;

  return Math.round((genericCount / reviews.length) * 100);
}

export async function getReviewDetails(url) {
  const reviews = await getIndividualReviews(url);
  console.log("Number of reviews found:", reviews.length);

  return {
    reviewDateClustering: calculateDateClustering(reviews),
    genericReviewScore: calculateGenericScore(reviews),
  };
}
