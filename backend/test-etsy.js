import "dotenv/config";

const API_KEY = process.env.ETSY_API_KEY;
const listingId = "PASTE_A_LISTING_ID_HERE";

const response = await fetch(
  "https://openapi.etsy.com/v3/application/openapi-ping",
  {
    headers: { "x-api-key": API_KEY },
  },
);
const data = await response.json();
console.log(response.status, data);

// const response = await fetch(
//   `https://openapi.etsy.com/v3/application/listings/${listingId}`,
//   {
//     headers: { "x-api-key": API_KEY },
//   },
// );

// const data = await response.json();
// console.log("Status:", response.status);
// console.log(JSON.stringify(data, null, 2));
