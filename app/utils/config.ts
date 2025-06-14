import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { getPublicClient } from "wagmi/actions";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = "3223be04625a623f7a2f0f4ea342493f";

export const WAGMIConfig = createConfig({
  chains: [sepolia, mainnet],
  connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http("https://eth.llamarpc.com"),
  },
});

export const WAGMIPublicClient = getPublicClient(WAGMIConfig);
