import { NextApiHandler } from "next";
import { prisma } from "~/server/db";

const handler: NextApiHandler = async (req, res) => {
  const { campaignId } = req.query as { campaignId: string };

  const affiliateLinks = await prisma.affiliateLink.findMany({
    where: {
      campaignId: parseInt(campaignId),
    },
    include: {
      campaign: true,
    },
  });

  const eligibleAssignees: string[] = [];

  affiliateLinks.map((affiliateLink) => {
    if (affiliateLink.clicks >= affiliateLink.campaign.clickTarget) {
      eligibleAssignees.push(affiliateLink.assignee);
    }
  });

  res.status(200).json({ eligibleAssignees });
};

export default handler;
