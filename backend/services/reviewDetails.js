import * as cheerio from "cheerio";

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
