import { publicClient, walletClient } from "../walletConfig";
import { CHAINQ_SCROLL, PLAN_PRICE } from "../config";
import chainq_abi from "../artifacts/chainq_abi.json";
export async function simulateAndWriteContract(
  account,
  address,
  functionName,
  value
) {
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: chainq_abi.abi,
    functionName,
    value,
  });

  const tx = await walletClient.writeContract(request);
  return tx;
}

// Usage example
export async function purchaseSubscription() {
  try {
    const transactionHash = await simulateAndWriteContract(
      "0x97861976283e6901b407D1e217B72c4007D9F64D",
      CHAINQ_SCROLL,
      "purchaseSubscription",
      [PLAN_PRICE]
    );

    const transactionReceipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });
    console.log("Purchase successful!");
    return {
      success: true,
      hash: transactionHash,
      receipt: transactionReceipt,
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      success: false,
      error: error,
    };
  }
}
