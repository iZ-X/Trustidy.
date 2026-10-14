import "dotenv/config";

const API_KEY = process.env.ETSY_API_KEY;
const SHARED_SECRET = process.env.ETSY_SHARED_SECRET;
const shopId = "6816455";

const response = await fetch(
  `https://openapi.etsy.com/v3/application/shops/${shopId}/reviews`,
  {
    headers: { "x-api-key": `${API_KEY}:${SHARED_SECRET}` },
  },
);

const data = await response.json();
console.log(JSON.stringify(data, null, 2).slice(0, 1500));
// const API_KEY = process.env.ETSY_API_KEY;
// const listingId = "PASTE_A_LISTING_ID_HERE";

// const response = await fetch(
//   "https://openapi.etsy.com/v3/application/openapi-ping",
//   {
//     headers: { "x-api-key": API_KEY },
//   },
// );
// const data = await response.json();
// console.log(response.status, data);

// const response = await fetch(
//   `https://openapi.etsy.com/v3/application/listings/${listingId}`,
//   {
//     headers: { "x-api-key": API_KEY },
//   },
// );

// const data = await response.json();
// console.log("Status:", response.status);
// console.log(JSON.stringify(data, null, 2));
