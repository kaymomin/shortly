import { NextApiHandler } from "next";
import { prisma } from "~/server/db";

const handler: NextApiHandler = async (req, res) => {
  const { creator } = req.query as { creator: string };

  const campaigns = await prisma.campaign.findMany({
    where: {
      creator,
    },
  });

  res.status(200).json({
    data: campaigns,
  });
};

export default handler;
