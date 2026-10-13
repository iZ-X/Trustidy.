// export function calculateListingTrustScore(signals) {
//   let score = 0;

//   if (signals.averageRating > 4) {
//     score += 15;
//   }

//   if (signals.reviewCount > 50) {
//     score += 20;
//   }

//   if (signals.hasUrgencyLanguage) {
//     score -= 10;
//   }

//   if (signals.hasReturnPolicy) {
//     score += 10;
//   }

//   return score;
// }

export function calculateListingTrustScore(signals) {
  let score = 100;

  if (signals.averageRating < 4) {
    score -= 15;
  }

  if (signals.reviewCount < 50) {
    score -= 20;
  }

  if (!signals.hasUrgencyLanguage) {
    score += 10;
  }

  if (!signals.hasReturnPolicy) {
    score -= 10;
  }

  return score;
}
