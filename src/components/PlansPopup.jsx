import React, { useEffect, useState } from "react";
import "../styles/PlansPopup.scss";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import abi from "../artifacts/chainq_abi.json";
import { CHAINQ_SCROLL } from "../config";
import EmptyComponent from "./EmptyComponent";
import { useAccount, useConnect } from "wagmi";

function PlansPopup({ setShowSPopup, onClose }) {
  console.log("hello me aa gaya");
  const currentPlanPoints = ["Limited to 10 chats"];
  const upgradePlanPoints = ["Unlimited chats"];

  const { address, isConnecting, isDisconnected } = useAccount();
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, pendingConnector } = useConnect();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { tronWeb } = window;
  const [isSigned, setIsSigned] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({
    hasSubscription: false,
    expirationTimestamp: 0,
  });
  useEffect(() => {
    // Check if the user has signed a message using cookies
    const signatureFromCookie = Cookies.get(address); // Use the address as the key
    if (signatureFromCookie) {
      setIsSigned(true);
      getPlanDetails();
    } else {
      setIsSigned(false); // Address changed, reset the sign status
    }
  }, [address]);

  const getPlanDetails = async () => {
    setLoading(true);
    const connectedContract = await tronWeb.contract(abi, CHAINQ_SCROLL);
    console.log(connectedContract);
    let txget = await connectedContract.getSubscriptionStatus(address).call();
    console.log(txget.hasSubscription);
    console.log(parseInt(txget.expirationTimestamp));
    setSubscriptionData({
      hasSubscription: txget.hasSubscription,
      expirationTimestamp: parseInt(txget.expirationTimestamp),
    });
    setLoading(false);
  };

  const buyPlan = async () => {
    if (isConnected && isSigned) {
      const connectedContract = await tronWeb.contract(abi, CHAINQ_SCROLL);
      console.log(connectedContract);
      let txget = await connectedContract.subscriptionPrice().call();
      console.log(parseInt(txget));
      // console.log(tronWeb.toSun(txget));
      if (txget) {
        let tx = await connectedContract.purchaseSubscription().send({
          callValue: tronWeb.toSun(txget),
        });
        GetHash(
          tx,
          "Shasta" // Mainnet, Shasta, Nile
        );

        console.log(tx);
        if (tx) {
          let txget = await connectedContract
            .getSubscriptionStatus(address)
            .call();
          console.log(txget.hasSubscription);
          if (txget.hasSubscription) {
            navigate("/chat-dashboard");
          }
        }
      }
    } else {
      // User has not signed, show the popup
      // setShowPopup(true);
    }
  };

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  return (
    <>
      <div className="plans-popup-overlay">
        <div className="plans-popup">
          <div className="plans-popup-content">
            <div className="plans-header">
              <div className="plans-popup-title">Upgrade your plan</div>
              <button
                className="plans-popup-close-button"
                onClick={() => setShowSPopup(false)}
              >
                &times;
              </button>
            </div>

            <div className="plans-horizontal-divider"></div>
            <div className="plans-section">
              <div className="plans-column">
                <h3 className="plans-subtitle">Your Current Plan</h3>
                {loading ? (
                  <>
                    <div>loading...</div>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        color: subscriptionData.hasSubscription
                          ? "green"
                          : "red",
                      }}
                    >
                      {subscriptionData.hasSubscription
                        ? "Plan Active"
                        : "No Active Plan"}
                    </span>
                  </>
                )}

                {subscriptionData.hasSubscription && (
                  <p>
                    Expires on:{" "}
                    {formatTimestamp(subscriptionData.expirationTimestamp)}
                  </p>
                )}
              </div>

              <div className="plans-divider"></div>
              <div className="plans-column">
                <h3 className="plans-subtitle">Upgrade Plan</h3>
                {upgradePlanPoints.map((point, index) => (
                  <div className="plans-point" key={index}>
                    {point}
                  </div>
                ))}
                <button
                  className="plans-popup-button"
                  onClick={() => buyPlan()}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlansPopup;
