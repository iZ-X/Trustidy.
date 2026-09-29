export async function getInstagramInfo(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const match = html.match(
      /https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?/,
    );
    const instagramUrl = match ? match[0] : null;

    return { hasInstagram: !instagramUrl, instagramUrl };
  } catch (error) {
    return { hasInstagram: false, instagramUrl: null };
  }
}
