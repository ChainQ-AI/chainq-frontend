import { publicClient } from "../walletConfig";
import { CHAINQ_SCROLL } from "../config";
import chainq_abi from "../artifacts/chainq_abi.json";

export async function getPlanStatus(address) {
  const result = await publicClient.readContract({
    address: CHAINQ_SCROLL,
    abi: chainq_abi.abi,
    functionName: "getSubscriptionStatus",
    args: [address],
  });

  return {
    isActive: result[0],
    expiry: result[1],
  };
}
