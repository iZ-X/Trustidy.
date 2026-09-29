const KNOWN_PLATFORMS = [
  "instagram.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "youtube.com",
  "tiktok.com",
  "pinterest.com",
  "bsky.app",
];

export async function getSocialInfo(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const match = html.match(
      /https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?/,
    );
    const instagramUrl = match ? match[0] : null;

    const foundPlatforms = KNOWN_PLATFORMS.filter((platform) =>
      html.includes(platform),
    );

    return {
      hasInstagram: !!instagramUrl,
      socialProfileCount: foundPlatforms.length,
    };
  } catch (error) {
    return { hasInstagram: false, socialProfileCount: 0 };
  }
}

// export async function getInstagramInfo(url) {
//   try {
//     const response = await fetch(url);
//     const html = await response.text();

//     const match = html.match(
//       /https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?/,
//     );
//     const instagramUrl = match ? match[0] : null;

//     return { hasInstagram: !instagramUrl, instagramUrl };
//   } catch (error) {
//     return { hasInstagram: false, instagramUrl: null };
//   }
// }
