import { NextApiHandler } from "next";
import { prisma } from "~/server/db";

const handler: NextApiHandler = async (req, res) => {
  const { campaignId } = req.query as { campaignId: string };

  await prisma.campaign.update({
    where: { id: +campaignId },
    data: {
      paidOut: true,
    },
  });

  res.status(200).json({ success: true });
};

export default handler;
