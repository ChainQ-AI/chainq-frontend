import { createWalletClient, createPublicClient, custom, http } from "viem";
import { scrollSepolia } from "viem/chains";

// const transport = http("https://scroll-sepolia.public.blastapi.io/");
// export const walletClient = createPublicClient({
//   chain: scrollSepolia,
//   transport: transport,
// });

export const walletClient = createWalletClient({
  chain: scrollSepolia,
  transport: custom(window.ethereum),
});

export const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http("https://rpc.scroll.io"),
});
// JSON-RPC Account
// export const [account] = await walletClient.getAddresses();
