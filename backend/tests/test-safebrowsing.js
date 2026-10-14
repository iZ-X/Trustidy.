import "dotenv/config";

const API_KEY = process.env.SAFE_BROWSING_API_KEY;
const urlToCheck = "http://testsafebrowsing.appspot.com/s/malware.html";

const response = await fetch(
  `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client: {
        clientId: "trustidy-510121",
        clientVersion: "1.0.0",
      },
      threatInfo: {
        threatTypes: [
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
        ],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url: urlToCheck }],
      },
    }),
  },
);

const data = await response.json();
console.log("Status: ", response.status);
console.log(JSON.stringify(data, null, 2));
