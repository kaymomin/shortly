import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const Navbar: FC = () => {
  const { isConnected } = useAccount();

  // https://github.com/wagmi-dev/wagmi/issues/542#issuecomment-1247123114
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          {connected && (
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <Link href="/campaigns">Campaigns</Link>
              </li>
              <li>
                <Link href="/new-campaign">New Campaign</Link>
              </li>
            </ul>
          )}
        </div>
        <Link href="/">
          <img src="/logo.jpg" alt="WAGMI" className="h-12" />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        {connected && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link className="active:bg-our-green-dark" href="/campaigns">
                Campaigns
              </Link>
            </li>
            <li>
              <Link className="active:bg-our-green-dark" href="/new-campaign">
                New Campaign
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="navbar-end">
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>
    </div>
  );
};
