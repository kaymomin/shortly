-- CreateTable
CREATE TABLE "ShortenedURL" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortUrlCode" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ShortenedURL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "creatorEthAddress" TEXT NOT NULL,
    "participants" TEXT[],
    "budgetInEth" DOUBLE PRECISION NOT NULL,
    "paidOut" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortenedURL_shortUrlCode_key" ON "ShortenedURL"("shortUrlCode");
