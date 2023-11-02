import React, { createContext, useState, useEffect } from "react";
import "../styles/main.scss";
// import "../styles/ConnectWalletButton.css";
import toast, { Toaster } from "react-hot-toast";

export const AuthContext = createContext();

function ConnectWalletButton(props) {
  const [currentAccount, setCurrentAccount] = useState(null);
  const { tronLink, localStorage, tronWeb } = window;
  const [isHovered, setIsHovered] = useState(false);

  const updateCurrentAccount = async () => {
    if (tronWeb.defaultAddress.base58 !== currentAccount) {
      const account = tronWeb.defaultAddress.base58;
      setCurrentAccount(account);
      localStorage.setItem("currentAccount", account);
    }
  };

  const connectWallet = async () => {
    if (!window.tronWeb) {
      toast.error(
        "TronLink is not installed. Please install and log in to your TronLink wallet."
      );
      return;
    }

    console.log("haa bhai aa raha hai");
    if (window.tronLink) {
      console.log("wallet found");
    } else {
      toast.error("Wallet not found. Redirecting to tronlink website...");
      console.log("wallet not found");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.open("https://www.tronlink.org/", "_blank");
      return;
    }
    try {
      const response = await tronLink.request({
        method: "tron_requestAccounts",
      });

      if (response.code === 200) {
        window.tronWeb = tronLink.tronWeb;
        const account = window.tronWeb.defaultAddress.base58;
        await updateCurrentAccount();
        setCurrentAccount(account);
        localStorage.setItem("currentAccount", account);

        props.setAddress(account);

        props.togglePopup();
      } else if (response.code === 4000) {
        alert("Already connection Initiated");
      } else if (response.code === 4001) {
        toast.error("You rejected the request in your wallet.");
      } else if (response.code == null) {
        toast.error("Please log in to your TronLink wallet.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount(null);
    localStorage.removeItem("currentAccount");
  };

  const copyAddressToClipboard = () => {
    if (currentAccount) {
      navigator.clipboard.writeText(currentAccount);
      toast.success("Address copied to clipboard!");
    }
  };

  useEffect(() => {
    if (window.tronWeb) {
      if (tronLink.ready && localStorage.getItem("currentAccount")) {
        setCurrentAccount(localStorage.getItem("currentAccount"));
      }

      // Listen for account changes
      tronWeb.on("addressChanged", updateCurrentAccount);

      // Clean up the event listener when the component unmounts
      return () => {
        tronWeb.off("addressChanged", updateCurrentAccount);
      };
    }
  }, []);

  return (
    <div className="connect-wallet-main">
      {currentAccount && (
        <div
          className={`connected-wallet${isHovered ? " active" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button className="connect-wallet">
            {currentAccount.slice(0, 6) + "....." + currentAccount.slice(-4)}
          </button>

          {isHovered && currentAccount && (
            <div className={`cnctd-btn-options`}>
              <button className="cnctd-btn-op" onClick={copyAddressToClipboard}>
                Copy address
              </button>
              <button className="cnctd-btn-op" onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
      {!currentAccount && (
        <button onClick={connectWallet} className="connect-wallet">
          Connect Wallet
        </button>
      )}
      <Toaster />
    </div>
  );
}

export default ConnectWalletButton;
