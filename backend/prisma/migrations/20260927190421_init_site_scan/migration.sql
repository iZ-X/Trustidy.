-- CreateTable
CREATE TABLE "SiteScan" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteScan_pkey" PRIMARY KEY ("id")
);
