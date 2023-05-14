// pages/api/campaigns.ts
import type { NextApiRequest, NextApiResponse } from "next";
import type { Campaign } from "@prisma/client";
import { prisma } from "~/server/db";
import { randomUUID } from "crypto";

export type CreateVideoInput = Pick<
  Campaign,
  | "name"
  | "startDate"
  | "endDate"
  | "originalURL"
  | "budget"
  | "clickTarget"
  | "creator"
> & {
  assignees: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const {
    name,
    startDate,
    endDate,
    originalURL,
    budget,
    clickTarget,
    creator,
    assignees,
  } = JSON.parse(req.body) as CreateVideoInput;

  try {
    const campaign = await prisma.campaign.create({
      data: {
        name,
        startDate,
        endDate,
        originalURL,
        budget: Number(budget),
        creator,
        clickTarget: Number(clickTarget),
      },
    });

    const affiliateLinks = await Promise.all(
      assignees.map(async (assignee) => {
        const shortenedURL = await prisma.affiliateLink.create({
          data: {
            originalURL,
            campaignId: campaign.id,
            shortcode: randomUUID(),
            assignee,
          },
        });
        return shortenedURL;
      })
    );

    // connect the affiliate links to the campaign
    await prisma.campaign.update({
      where: {
        id: campaign.id,
      },
      data: {
        affiliateLinks: {
          connect: affiliateLinks.map((link) => ({ id: link.id })),
        },
      },
    });

    return res.status(201).json(campaign);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
