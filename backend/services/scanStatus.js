export function calculateScanStatus(signals) {
  let failedCount = 0;

  if (signals.domainAge === null) {
    failedCount++;
  }

  if (signals.sslIssuer === null) {
    failedCount++;
  }

  if (signals.isFlaggedUnsafe === null) {
    failedCount++;
  }

  if (failedCount === 0) {
    return "complete";
  } else if (failedCount === 3) {
    return "failed";
  } else {
    return "partial";
  }
}
