import { FC, useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "wagmi";

export const EnsText: FC<{ children: string }> = ({ children }) => {
  const [ensName, setEnsName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(),
      });
      const ensName = await publicClient.getEnsName({
        address: children as `0x${string}`,
      });
      setEnsName(ensName);
    })();
  }, [children]);

  return <>{ensName || children}</>;
};
