const url =
  "https://www.nike.com/t/air-jordan-1-high-og-royal-mens-shoes-KVpEM9a8/IQ5495-005";

const response = await fetch(url);
const html = await response.text();
const lowerHtml = html.toLowerCase();

const urgencyPhrases = [
  "only 1 left",
  "only a few left",
  "hurry",
  "limited time",
  "sale ends",
  "while supplies last",
];
const returnPhrases = [
  "return policy",
  "money back",
  "money-back",
  "free returns",
  "day return",
];

const hasUrgencyLanguage = urgencyPhrases.some((phrase) =>
  lowerHtml.includes(phrase),
);
const hasReturnPolicy = returnPhrases.some((phrase) =>
  lowerHtml.includes(phrase),
);

const index = lowerHtml.indexOf("return");
console.log(lowerHtml.slice(index - 100, index + 100));

console.log("hasUrgencyLanguage:", hasUrgencyLanguage);
console.log("hasReturnPolicy", hasReturnPolicy);
console.log("Contains 'return':", lowerHtml.includes("return"));
console.log("Contains 'refund':", lowerHtml.includes("refund"));
