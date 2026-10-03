const apiUrl =
  "https://reviews.api.gymshark.com/data/reviews.json?apiversion=5.4&passkey=cadZPRrSaTS85OiC8aEtgjJaPxgY056aawytGksQcFrlI&Locale=en_US&Include=Products&Stats=Reviews&Filter=ProductId:I3A1V-BB2J&Filter=ContentLocale:en*&Limit=10&Offset=0&Sort=Rating:desc";

const response = await fetch(apiUrl);
const data = await response.json();

console.log(JSON.stringify(data, null, 2).slice(0, 2000));
