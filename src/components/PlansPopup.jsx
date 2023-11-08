import React, { useEffect, useState } from "react";
import "../styles/PlansPopup.scss";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import abi from "../artifacts/chainq_abi.json";
import { useAccount, useConnect } from "wagmi";
import { getPlanStatus } from "../helper/planStatus";
import { publicClient, walletClient, account } from "../walletConfig";
import { CHAINQ_SCROLL, PLAN_PRICE } from "../config";
import chainq_abi from "../artifacts/chainq_abi.json";
import { purchaseSubscription } from "../helper/buyPlan";

function PlansPopup({ setShowSPopup, onClose }) {
  console.log("hello me aa gaya");
  const upgradePlanPoints = ["Unlimited chats"];

  const { address, isConnecting, isDisconnected } = useAccount();
  const { connector: activeConnector, isConnected } = useAccount();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isSigned, setIsSigned] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({
    hasSubscription: false,
    expirationTimestamp: 0,
  });
  useEffect(() => {
    // Define an asynchronous function to handle the logic
    const checkSignatureAndPlanStatus = async () => {
      const signatureFromCookie = Cookies.get(address);
      if (signatureFromCookie) {
        setIsSigned(true);

        const { isActive, expiry } = await getPlanStatus();
        console.log(isActive);
        console.log(expiry);
        setSubscriptionData({
          hasSubscription: isActive,
          expirationTimestamp: parseInt(expiry),
        });
      } else {
        setIsSigned(false); // Address changed, reset the sign status
      }
    };

    // Call the asynchronous function
    checkSignatureAndPlanStatus();
  }, [address]);

  const buyPlan = async () => {
    if (isConnected && isSigned && !subscriptionData.hasSubscription) {
      const result = await purchaseSubscription();

      console.log(result);
      const { isActive } = await getPlanStatus();

      if (result.success) {
        if (isActive) {
          navigate("/chat-dashboard");
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
