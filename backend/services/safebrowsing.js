export async function checkSafeBrowsing(url) {
  const API_KEY = process.env.SAFE_BROWSING_API_KEY;

  try {
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            clientId: "trustidy",
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
            threatEntries: [{ url }],
          },
        }),
      },
    );

    const data = await response.json();
    const threatType = data.matches?.[0]?.threatType ?? null;

    return { isFlaggedUnsafe: !!data.matches, threatType };
  } catch (error) {
    return { isFlaggedUnsafe: null, threatType: null };
  }
}
