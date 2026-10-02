export function calculateListingScanStatus(signals) {
  let failedCount = 0;

  if (signals.currentPrice === null) {
    failedCount++;
  }

  if (signals.reviewCount === null) {
    failedCount++;
  }

  if (failedCount === 0) {
    return "complete";
  } else if (failedCount === 2) {
    return "failed";
  } else {
    return "partial";
  }
}
