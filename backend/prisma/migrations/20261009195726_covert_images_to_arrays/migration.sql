/*
  Warnings:

  - The `productImage` column on the `ListingScan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `previewImage` column on the `SiteScan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ListingScan" DROP COLUMN "productImage",
ADD COLUMN     "productImage" TEXT[];

-- AlterTable
ALTER TABLE "SiteScan" DROP COLUMN "previewImage",
ADD COLUMN     "previewImage" TEXT[];
