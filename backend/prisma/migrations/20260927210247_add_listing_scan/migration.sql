-- CreateTable
CREATE TABLE "ListingScan" (
    "id" TEXT NOT NULL,
    "listingUrl" TEXT NOT NULL,
    "siteScanId" TEXT,
    "currentPrice" DOUBLE PRECISION,
    "priceHistoryLow" DOUBLE PRECISION,
    "priceHistoryHigh" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "averageRating" DOUBLE PRECISION,
    "reviewDateClustering" BOOLEAN,
    "genericReviewScore" DOUBLE PRECISION,
    "hasUrgencyLanguage" BOOLEAN,
    "hasReturnPolicy" BOOLEAN,
    "trustScore" INTEGER,
    "scanStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingScan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListingScan" ADD CONSTRAINT "ListingScan_siteScanId_fkey" FOREIGN KEY ("siteScanId") REFERENCES "SiteScan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
