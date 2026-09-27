-- AlterTable
ALTER TABLE "SiteScan" ADD COLUMN     "domainAge" INTEGER,
ADD COLUMN     "hasInstagram" BOOLEAN,
ADD COLUMN     "hasTrustpilot" BOOLEAN,
ADD COLUMN     "instagramFollowers" INTEGER,
ADD COLUMN     "previewImage" TEXT,
ADD COLUMN     "registrarCountry" TEXT,
ADD COLUMN     "scanStatus" TEXT,
ADD COLUMN     "sslIssuer" TEXT,
ADD COLUMN     "trustRating" DOUBLE PRECISION,
ADD COLUMN     "trustScore" INTEGER;
