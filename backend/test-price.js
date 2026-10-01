// import * as cheerio from "cheerio";

// const url =
//   "https://www.nike.com/t/air-force-1-07-mens-shoes-DZejrQoC/CW2288-111";

// const response = await fetch(url);
// const html = await response.text();
// const $ = cheerio.load(html);

// let currentPrice = null;

// $("script[type='application/ld+json']").each((i, el) => {
//   if (currentPrice) return;

//   const content = $(el).html();
//   try {
//     const json = JSON.parse(content);
//     const items = Array.isArray(json) ? json : [json];

//     // for (const item of items) {
//     //   if (item.offers?.price) {
//     //     currentPrice = item.offers.price;
//     //   } else if (item.hasVariant?.[0]?.offers?.price) {
//     //     currentPrice = item.hasVariant[0].offers.price;
//     //   }
//     // }

//     for (const item of items) {
//       if (item.aggregateRating) {
//         console.log(
//           `founrd it: ${JSON.stringify(item.aggregateRating, null, 2)}`,
//         );
//       }
//     }
//     // console.log(`Current Price: ${currentPrice}`);
//     // console.log(`--- Script ${i} ---`);
//     // console.log(JSON.stringify(json, null, 2).slice(0, 2000)); // Print first 2000 characters of JSON
//   } catch (error) {
//     console.log(`--- Script ${i} failed to parse ---`);
//   }
// });

import * as cheerio from "cheerio";

const url =
  "https://www.nike.com/t/air-force-1-07-mens-shoes-DZejrQoC/CW2288-111";

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

console.log("Done checking all scripts.");

console.log(
  "Contains 'bazaarvoice':",
  html.toLowerCase().includes("bazaarvoice"),
);
console.log(
  "Contains 'powerreviews':",
  html.toLowerCase().includes("powerreviews"),
);
console.log("Contains 'yotpo':", html.toLowerCase().includes("yotpo"));
console.log("Contains 'review':", html.toLowerCase().includes("review"));
console.log("Contains 'rating':", html.toLowerCase().includes("rating"));

const reviewIndex = html.toLowerCase().indexOf("review");
console.log("--- Context around 'review' ---");
console.log(html.slice(reviewIndex - 100, reviewIndex + 150));

const ratingIndex = html.toLowerCase().indexOf("rating");
console.log("--- Context around 'rating' ---");
console.log(html.slice(ratingIndex - 300, ratingIndex + 500));
