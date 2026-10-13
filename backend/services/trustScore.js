export function calculateTrustScore(signals) {
  let score = 100;

  if (signals.domainAge < 2) {
    score -= 20;
  }

  if (!signals.sslIssuer) {
    score -= 15;
  }

  if (!signals.hasInstagram) {
    score -= 10;
  }

  score += Math.min(signals.socialProfileCount * 5, 20);

  if (signals.isFlaggedUnsafe) {
    score = 0;
  }

  return score;
}
//fix this nike.com has a 120 trust score must be under 100.
