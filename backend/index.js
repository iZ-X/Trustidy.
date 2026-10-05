import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDomainInfo } from "./services/rdap.js";
import { getSSLIssuer } from "./services/ssl.js";
import { getSocialInfo } from "./services/social.js";
import { checkSafeBrowsing } from "./services/safebrowsing.js";
import { calculateTrustScore } from "./services/trustScore.js";
import { calculateScanStatus } from "./services/scanStatus.js";
import redisClient from "./services/redisClient.js";
import { checkRedFlags } from "./services/redFlags.js";
import { getCurrentPrice } from "./services/price.js";
import { getReviewInfo } from "./services/reviews.js";
import { calculateListingTrustScore } from "./services/listingTrustScore.js";
import { calculateListingScanStatus } from "./services/listingScanStatus.js";
import { getReviewDetails } from "./services/reviewDetails.js";
import { getPreviewImage } from "./services/previewImage.js";
import { getEtsyListingData, getEtsyListingId } from "./services/etsy.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Trustidy backend is running");
});

app.post("/api/site-scan", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  try {
    const cached = await redisClient.get(url);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const domain = new URL(url).hostname.replace("www.", "");

    const { domainAge, registrarName } = await getDomainInfo(domain);
    const sslIssuer = await getSSLIssuer(domain);
    const { hasInstagram, socialProfileCount } = await getSocialInfo(url);
    const { isFlaggedUnsafe, threatType } = await checkSafeBrowsing(url);
    const previewImage = await getPreviewImage(url);

    const scanStatus = calculateScanStatus({
      domainAge,
      sslIssuer,
      isFlaggedUnsafe,
    });

    const trustScore = calculateTrustScore({
      domainAge,
      sslIssuer,
      hasInstagram,
      socialProfileCount,
      isFlaggedUnsafe,
    });

    const siteScan = await prisma.siteScan.create({
      data: {
        url,
        domainAge,
        registrarName,
        sslIssuer,
        hasInstagram,
        socialProfileCount,
        isFlaggedUnsafe,
        threatType,
        trustScore,
        scanStatus,
        previewImage,
      },
    });

    await redisClient.set(url, JSON.stringify(siteScan), { EX: 3600 });

    res.json(siteScan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/listing-scan", async (req, res) => {
  const { listingUrl } = req.body;

  if (!listingUrl) {
    return res.status(400).json({ error: "listingUrl is required" });
  }

  try {
    if (listingUrl.includes("etsy.com")) {
      const listingId = getEtsyListingId(listingUrl);
      const etsyData = await getEtsyListingData(listingId);

      const scanStatus = calculateListingScanStatus({
        currentPrice: etsyData.currentPrice,
        reviewCount: etsyData.reviewCount,
      });

      const trustScore = calculateListingTrustScore({
        averageRating: etsyData.averageRating,
        hasUrgencyLanguage: etsyData.hasUrgencyLanguage,
        hasReturnPolicy: etsyData.hasReturnPolicy,
        reviewCount: etsyData.reviewCount,
      });

      const listingScan = await prisma.listingScan.create({
        data: {
          listingUrl,
          currentPrice: etsyData.currentPrice,
          priceHistoryLow: etsyData.currentPrice,
          priceHistoryHigh: etsyData.currentPrice,
          reviewCount: etsyData.reviewCount,
          reviewDateClustering: etsyData.reviewDateClustering,
          genericReviewScore: etsyData.genericReviewScore,
          hasReturnPolicy: etsyData.hasReturnPolicy,
          productImage: etsyData.productImage,
          hasUrgencyLanguage: etsyData.hasUrgencyLanguage,
          trustScore,
          scanStatus,
          averageRating: etsyData.averageRating,
        },
      });

      return res.json(listingScan);
    }

    const domain = new URL(listingUrl).hostname.replace("www.", "");

    const existingSiteScan = await prisma.siteScan.findFirst({
      where: { url: { contains: domain } },
    });

    const currentPrice = await getCurrentPrice(listingUrl);

    const pastScans = await prisma.listingScan.findMany({
      where: { listingUrl },
      select: { currentPrice: true },
    });

    const allPrices = [
      ...pastScans.map((scan) => scan.currentPrice),
      currentPrice,
    ].filter((price) => price !== null);

    const priceHistoryLow =
      allPrices.length > 0 ? Math.min(...allPrices) : null;
    const priceHistoryHigh =
      allPrices.length > 0 ? Math.max(...allPrices) : null;

    const { hasUrgencyLanguage, hasReturnPolicy } =
      await checkRedFlags(listingUrl);
    const { reviewCount, averageRating } = await getReviewInfo(listingUrl);
    const { reviewDateClustering, genericReviewScore } =
      await getReviewDetails(listingUrl);
    const productImage = await getPreviewImage(listingUrl);

    const scanStatus = calculateListingScanStatus({
      currentPrice,
      reviewCount,
    });

    const trustScore = calculateListingTrustScore({
      averageRating,
      hasUrgencyLanguage,
      hasReturnPolicy,
      reviewCount,
    });

    const listingScan = await prisma.listingScan.create({
      data: {
        listingUrl,
        siteScanId: existingSiteScan?.id,
        hasUrgencyLanguage,
        hasReturnPolicy,
        currentPrice,
        priceHistoryLow,
        priceHistoryHigh,
        reviewCount,
        averageRating,
        trustScore,
        scanStatus,
        reviewDateClustering,
        genericReviewScore,
        productImage,
      },
    });

    res.json(listingScan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
