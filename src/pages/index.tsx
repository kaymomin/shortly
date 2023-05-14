import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  return (
    <>
      <Head>
        <title>Shortly</title>
        <meta name="description" content="Web3 affiliate marketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {connected ? (
        <div className="mt-4 flex flex-col gap-4">
          <Link
            href="/new-campaign"
            className="btn-primary btn border-none bg-our-green text-black hover:bg-our-green-dark"
          >
            Create a new campaign
          </Link>

          <Link
            href="/campaigns"
            className="btn-primary btn border-none bg-our-green text-black hover:bg-our-green-dark"
          >
            View all campaigns
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <p>Please connect your wallet to get started!</p>
        </div>
      )}
    </>
  );
};

export default Home;
