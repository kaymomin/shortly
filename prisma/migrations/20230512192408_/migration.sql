/*
  Warnings:

  - You are about to drop the column `participants` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `assignee` to the `ShortenedURL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaignId` to the `ShortenedURL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "participants",
ADD COLUMN     "assignees" TEXT[],
ADD COLUMN     "shortenedUrlIds" TEXT[];

-- AlterTable
ALTER TABLE "ShortenedURL" ADD COLUMN     "assignee" TEXT NOT NULL,
ADD COLUMN     "campaignId" TEXT NOT NULL;
