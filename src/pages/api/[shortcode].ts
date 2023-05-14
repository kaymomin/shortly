import { NextApiHandler } from "next";
import { prisma } from "~/server/db";

const handler: NextApiHandler = async (req, res) => {
  const { shortcode } = req.query;

  // lookup shortcode in database
  // if shortcode is found, redirect to original URL
  // if shortcode is not found, redirect to 404 page

  const affiliateLink = await prisma.affiliateLink.findUnique({
    where: {
      shortcode: shortcode as string,
    },
  });

  if (!affiliateLink) {
    return res.status(404).json({ message: "Not Found" });
  }

  // increment click count
  await prisma.affiliateLink.update({
    where: {
      shortcode: shortcode as string,
    },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });

  res.redirect(affiliateLink.originalURL);
};

export default handler;
