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

  return Math.min(Math.max(score, 0), 100);
}
