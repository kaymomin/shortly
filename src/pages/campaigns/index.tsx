import { Campaign } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { address } = useAccount();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res = await fetch(`/api/get-campaigns?creator=${address}`);
      const { data: campaigns } = await res.json();
      setCampaigns(campaigns);
    };
    fetchCampaigns();
  }, [address]);

  return (
    <>
      <h1>Your campaigns</h1>
      <div className="grid grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div className="card bg-base-100 shadow-xl" key={campaign.id}>
            <div className="card-body">
              <h2 className="card-title">{campaign.name}</h2>

              <div className="card-actions">
                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="btn-primary btn border-none bg-our-green text-black hover:bg-our-green-dark"
                >
                  Go to campaign dashboard
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CampaignsPage;
