import React, { useState } from "react";
import "../styles/Popup.css";
import { addUser } from "../APIs/apis";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import Cookies from "js-cookie";
import abi from "../contract/artifacts/chainq_abi.json";
import { CHAINQ_SHASTA_TESTNET } from "../config";

const PlanPopup = ({ onClose }) => {
  const { connected, address } = useWallet();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { tronWeb } = window;
  var resData;

  //   console.log(tronWeb.address.toHex("TXFwhfbRgVMWkWm7xn5s6QsNUp4RBmYy5t"));

  const userLoginAndAuthenticate = async (signature, address) => {
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
        let txget = await connectedContract.subscriptionPrice().call();
        console.log(parseInt(txget));
        // console.log(tronWeb.toSun(txget));
        if (txget) {
          let tx = await connectedContract.purchaseSubscription().send({
            callValue: tronWeb.toSun(txget),
          });
        }
        console.log(tx);

        navigate("/chat-dashboard");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error authenticating user:", error);
    }
  };

  const getSign = async () => {
    const signature = await tronWeb.trx.signMessageV2("Login to ChainQ");
    if (signature) {
      setLoading(true); // Set loading to true when signing starts
      await userLoginAndAuthenticate(signature, address);
    }
  };

  // var obj = setInterval(async () => {
  //   if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
  //     clearInterval(obj);
  //     var tronweb = window.tronWeb;
  //     var tx = await tronweb.transactionBuilder.sendTrx(
  //       "TN9RRaXkCFtTXRso2GdTZxSxxwufzxLQPP",
  //       10,
  //       "TTSFjEG3Lu9WkHdp4JrWYhbGP6K1REqnGQ"
  //     );
  //     var signedTx = await tronweb.trx.sign(tx);
  //     var broastTx = await tronweb.trx.sendRawTransaction(signedTx);
  //     console.log(broastTx);
  //   }
  // }, 10);

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-content">
          <h2 className="popup-title">Sign Hello bhaisaab Message</h2>
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
    </div>
  );
};

export default PlanPopup;
