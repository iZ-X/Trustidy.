import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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

    const rdapResponse = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { "User-Agent": "Mozilla/5.0 (trustidy-app)" },
    });

    let domainAge = null;
    let registrarName = null;

    if (rdapResponse.ok) {
      const rdapData = await rdapResponse.json();
      console.log(
        "registration event:",
        rdapData.events?.find((e) => e.eventAction === "registration"),
      );

      const registrationEvent = rdapData.events?.find(
        (e) => e.eventAction === "registration",
      );

      if (registrationEvent) {
        const registeredDate = new Date(registrationEvent.eventDate);
        const ageMs = Date.now() - registeredDate.getTime();
        domainAge = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 365));
      }

      const registrarEntity = rdapData.entities?.find((e) =>
        e.roles.includes("registrar"),
      );
      registrarName =
        registrarEntity?.vcardArray?.[1]?.find(
          (field) => field[0] === "fn",
        )?.[3] ?? null;
    }

    const siteScan = await prisma.siteScan.create({
      data: { url, domainAge, registrarName },
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
