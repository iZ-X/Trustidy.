import * as cheerio from "cheerio";

export async function getPreviewImage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const ogImage = $("meta[property='og:image']").attr("content");

    return ogImage;
  } catch (error) {
    return null;
  }
}
