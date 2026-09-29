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
    const domain = new URL(url).hostname.replace("www.", "");

    const { domainAge, registrarName } = await getDomainInfo(domain);
    const sslIssuer = await getSSLIssuer(domain);
    const { hasInstagram, socialProfileCount } = await getSocialInfo(url);
    const { isFlaggedUnsafe, threatType } = await checkSafeBrowsing(url);

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
      },
    });

    res.json(siteScan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
