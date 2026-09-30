const URGENCY_PHRASES = [
  "only 1 left",
  "only a few left",
  "hurry",
  "limited time",
  "sale ends",
  "while supplies last",
];
const RETURN_PHRASES = [
  "return policy",
  "money back",
  "money-back",
  "free returns",
  "day return",
];

export async function checkRedFlags(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const lowerHtml = html.toLowerCase();

    const hasUrgencyLanguage = URGENCY_PHRASES.some((phrase) =>
      lowerHtml.includes(phrase),
    );
    const hasReturnPolicy = RETURN_PHRASES.some((phrase) =>
      lowerHtml.includes(phrase),
    );

    return { hasUrgencyLanguage, hasReturnPolicy };
  } catch (error) {
    return { hasUrgencyLanguage: null, hasReturnPolicy: null };
  }
}
