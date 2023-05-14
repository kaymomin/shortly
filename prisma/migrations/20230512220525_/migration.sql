/*
  Warnings:

  - The primary key for the `Campaign` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignees` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `budgetInEth` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `creatorEthAddress` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `shortenedUrlIds` on the `Campaign` table. All the data in the column will be lost.
  - The `id` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ShortenedURL` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `budget` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clickTarget` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalURL` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_pkey",
DROP COLUMN "assignees",
DROP COLUMN "budgetInEth",
DROP COLUMN "creatorEthAddress",
DROP COLUMN "shortenedUrlIds",
ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "clickTarget" INTEGER NOT NULL,
ADD COLUMN     "creator" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "originalURL" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ShortenedURL";

-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" SERIAL NOT NULL,
    "shortcode" TEXT NOT NULL,
    "originalURL" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "campaignId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignee" TEXT NOT NULL,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateLink_shortcode_key" ON "AffiliateLink"("shortcode");

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
