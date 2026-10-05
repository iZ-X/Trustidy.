import {
  calculateDateClustering,
  calculateGenericScore,
} from "./reviewDetails.js";
import { URGENCY_PHRASES } from "./redFlags.js";

const API_KEY = process.env.ETSY_API_KEY;
const SHARED_SECRET = process.env.ETSY_SHARED_SECRET;

function getHeaders() {
  return { "x-api-key": `${API_KEY}:${SHARED_SECRET}` };
}

export function getEtsyListingId(url) {
  const match = url.match(/\/listing\/(\d+)/);
  return match ? match[1] : null;
}

async function getListingDetails(listingId) {
  const response = await fetch(
    `https://openapi.etsy.com/v3/application/listings/${listingId}?includes=Images`,
    { headers: getHeaders() },
  );
  return await response.json();
}

async function getShopReviews(shopId, listingId) {
  const response = await fetch(
    `https://openapi.etsy.com/v3/application/shops/${shopId}/reviews`,
    { headers: getHeaders() },
  );
  const data = await response.json();

  return data.results
    .filter((r) => r.listing_id === parseInt(listingId))
    .map((r) => ({
      date: new Date(r.create_timestamp * 1000).toISOString(),
      text: r.review,
      rating: r.rating,
    }));
}

export async function getEtsyListingData(listingId) {
  try {
    const listing = await getListingDetails(listingId);

    const listingText = `${listing.title} ${listing.description}`.toLowerCase();
    const hasUrgencyLanguage = URGENCY_PHRASES.some((phrase) =>
      listingText.includes(phrase),
    );

    const currentPrice = listing.price
      ? listing.price.amount / listing.price.divisor
      : null;
    const productImage =
      listing.images?.find((img) => img.rank === 1)?.url_570xN ?? null;
    const hasReturnPolicy = !!listing.return_policy_id;

    const reviews = await getShopReviews(listing.shop_id, listingId);

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

    return {
      currentPrice,
      productImage,
      hasReturnPolicy,
      hasUrgencyLanguage,
      reviewCount: reviews.length,
      averageRating,
      reviewDateClustering: calculateDateClustering(reviews),
      genericReviewScore: calculateGenericScore(reviews),
    };
  } catch (error) {
    return {
      currentPrice: null,
      productImage: null,
      hasReturnPolicy: null,
      reviewCount: null,
      reviewDateClustering: null,
      genericReviewScore: null,
    };
  }
}
