// import * as cheerio from "cheerio";

// const url = "https:nike.com";

// const response = await fetch(url);
// const html = await response.text();
// const $ = cheerio.load(html);

// const ogImage = $("meta[property='og:image']").attr("content");

// console.log("OG Image:", ogImage);

import { getPreviewImage } from "../services/previewImage.js";

const result = await getPreviewImage("https://nike.com");
console.log(result);
