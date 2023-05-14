import type { AffiliateLink, Campaign } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { prisma } from "~/server/db";
import Link from "next/link";
import { intervalToDuration } from "date-fns";
import abiFile from "~/abi.json";
import { useContractWrite } from "wagmi";
import { parseEther } from "viem";
import { EnsText } from "~/components/EnsText";
import { toast, Toaster } from "react-hot-toast";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const campaignId = context.query.id as string;

  const campaign = await prisma.campaign.findUnique({
    where: {
      id: +campaignId,
    },
    include: {
      affiliateLinks: true,
    },
  });

  const hasCampaignEnded = campaign ? campaign.endDate < new Date() : false;

  const totalClicks =
    campaign?.affiliateLinks.reduce(
      (acc, affiliateLink) => acc + affiliateLink.clicks,
      0
    ) || 0;

  return {
    props: {
      campaign: JSON.parse(
        JSON.stringify({
          ...campaign,
          hasEnded: hasCampaignEnded,
          totalClicks,
        })
      ),
    },
  };
};

const CampaignPage: NextPage<{
  campaign: Omit<Campaign, "startDate" | "endDate"> & {
    affiliateLinks: AffiliateLink[];
    hasEnded: boolean;
    startDate: string;
    endDate: string;
    totalClicks: number;
  };
}> = ({ campaign }) => {
  const CONTRACT_ADDRESS = "0xA376c192fA07b5eCE8E09a90c0a193fB04051f47";
  const abi = abiFile.abi;
  const { writeAsync } = useContractWrite({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "distributePrizes",
  });
  const [txHash, setTxHash] = useState("");

  const payOutCampaign = async () => {
    try {
      // get the addresses eligible for payout
      const eligibleAssignees: string[] = (
        await (
          await fetch(`/api/get-eligible-assignees?campaignId=${campaign.id}`)
        ).json()
      ).eligibleAssignees;

      if (!eligibleAssignees.length) {
        alert("No eligible assignees");
        return;
      }

      // pay out the campaign
      const { hash } = await writeAsync({
        args: [eligibleAssignees, parseEther(`${campaign.budget}`)],
        value: parseEther(`${campaign.budget}`),
      });

      setTxHash(hash);

      // mark the campaign as paid out
      await fetch(`/api/mark-paid?campaignId=${campaign.id}`)
        .then((r) => r.json())
        .then(console.log);
    } catch (error) {
      console.error(error);
      toast.error(
        "Error paying out campaign. See the console for more details."
      );
    } finally {
      toast.success("Campaign paid out!");
    }
  };

  return (
    <>
      <Toaster />
      <h4>Campaign dashboard</h4>
      <h1>{campaign.name}</h1>
      <p>
        Promoted URL:{" "}
        <Link href={campaign.originalURL} className="link">
          {campaign.originalURL}
        </Link>
      </p>
      <p>Target for assignees: {campaign.clickTarget} clicks</p>

      <div className="flex gap-4">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Clicks Generated</div>
            <div className="stat-value">{campaign.totalClicks}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Campaign Budget</div>
            <div className="stat-value">{campaign.budget} ETH</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Campaign Length</div>
            <div className="stat-value">
              {
                intervalToDuration({
                  start: new Date(campaign.startDate),
                  end: new Date(campaign.endDate),
                }).days
              }{" "}
              days
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex flex-col">
        <h3>Active Affiliate Links</h3>
        <table className="table">
          <thead>
            <tr>
              <th>URL</th>
              <th>Clicks</th>
              <th>Assignee</th>
            </tr>
          </thead>

          <tbody>
            {campaign.affiliateLinks.map((affiliateLink) => (
              <tr key={affiliateLink.id}>
                <td>
                  <Link
                    href={`/api/${affiliateLink.shortcode}`}
                    className="underline"
                  >
                    {affiliateLink.shortcode}
                  </Link>
                </td>
                <td>{affiliateLink.clicks}</td>
                <td>
                  <EnsText>{affiliateLink.assignee}</EnsText>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          disabled={!campaign.hasEnded || campaign.paidOut || !!txHash}
          onClick={payOutCampaign}
          className="btn-primary btn mx-auto w-fit border-none bg-our-green text-black hover:bg-our-green-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {campaign.paidOut
            ? "Campaign paid out"
            : campaign.hasEnded
            ? "Pay out campaign"
            : "Campaign still active"}
        </button>

        {txHash && (
          <div className="mt-4 text-center">
            <a
              href={`https://blockscout.scroll.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              View transaction on block explorer
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default CampaignPage;
