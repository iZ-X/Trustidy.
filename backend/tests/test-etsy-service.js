import "dotenv/config";
import { getEtsyListingData } from "../services/etsy.js";

const result = await getEtsyListingData("531488015");
console.log(result);
