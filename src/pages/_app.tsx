import { type AppType } from "next/dist/shared/lib/utils";
import { Layout } from "~/components/Layout";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { scrollTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "~/styles/globals.css";

const { chains, publicClient } = configureChains(
  [scrollTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Shortly",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default MyApp;
