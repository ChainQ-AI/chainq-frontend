import { createWalletClient, custom } from "viem";
import { scrollSepolia } from "viem/chains";

export const walletClient = createWalletClient({
  chain: scrollSepolia,
  transport: custom(window.ethereum),
});

// JSON-RPC Account
export const [account] = await walletClient.getAddresses();
