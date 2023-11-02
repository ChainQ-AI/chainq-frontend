// walletUtils.js

import Cookies from "js-cookie";

export const signMessageAndStore = async (tronWeb) => {
  try {
    // Sign the message
    const signature = await tronWeb.trx.signMessageV2("Login to ChainQ");

    if (signature) {
      // Store the signature in cookies
      Cookies.set("signature", signature);
      return signature;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error signing the message:", error);
    return null;
  }
};
