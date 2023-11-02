import React, { useState } from "react";
import "../styles/Popup.css";
import { addUser } from "../APIs/apis";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import abi from "../artifacts/chainq_abi.json";
import { CHAINQ_SHASTA_TESTNET } from "../config";
import { useAccount, useConnect } from "wagmi";

const Popup = ({ onClose, setShowPlanPopup }) => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const [loading, setLoading] = useState(false); // Initialize loading state as false
  const navigate = useNavigate();
  const { tronWeb } = window;
  var resData;

  const userLoginAndAuthenticate = async (signature, address) => {
    console.log(signature);
    try {
      resData = await addUser(address, signature);
      console.log(resData);
      if (resData.status === 200) {
        Cookies.set(address, resData.data.token);
        onClose();
        const connectedContract = await tronWeb.contract(
          abi,
          CHAINQ_SHASTA_TESTNET
        );
        console.log(connectedContract);
        let txget = await connectedContract
          .getSubscriptionStatus(address)
          .call();
        console.log(txget.hasSubscription);

        if (txget.hasSubscription) {
          navigate("/chat-dashboard");
        } else {
          console.log("nai hai plan");
          setShowPlanPopup(true);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error authenticating user:", error);
    }
  };

  const getSign = async () => {
    const signature = await tronWeb.trx.signMessageV2("Login to ChainQ");
    console.log(signature);
    if (signature) {
      setLoading(true); // Set loading to true when signing starts
      await userLoginAndAuthenticate(signature, address);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-content">
          <h2 className="popup-title">Sign Message</h2>
          <p className="popup-description">
            Sign this message to securely authenticate your identity.
          </p>
          {loading ? (
            <p>Loading...</p> // Render loading message when loading is true
          ) : (
            <>
              <button className="popup-button" onClick={getSign}>
                Sign Request
              </button>
              <button className="popup-button" onClick={onClose}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      {/* {showPlanPopup ? <PlansPopup setShowSPopup={togglePopup} /> : null} */}
    </div>
  );
};

export default Popup;
