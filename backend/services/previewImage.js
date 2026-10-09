import * as cheerio from "cheerio";

export async function getPreviewImage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const images = [];

    $("meta[property='og:image']").each((i, el) => {
      const imageUrl = $(el).attr("content");
      images.push(imageUrl);
    });

    return images.length > 0 ? images : null;
  } catch (error) {
    return null;
  }
}
