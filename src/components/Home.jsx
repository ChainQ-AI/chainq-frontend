import Navbar from "./Navbar";
import hero from "../assets/hero.png";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import { toast } from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import PlansPopup from "./PlansPopup";
import abi from "../artifacts/chainq_abi.json";
import { CHAINQ_SHASTA_TESTNET } from "../config";
import "../styles/Home.scss";
import HomeInstructions from "./HomeInstructions";
import { FaAnglesRight } from "react-icons/fa6";
import { useAccount, useConnect } from "wagmi";

function Home() {
  const navigate = useNavigate();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const [showPopup, setShowPopup] = useState(false);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [isSigned, setIsSigned] = useState(null);

  console.log(isConnected);
  console.log(address);

  useEffect(() => {
    // Check if the user has signed a message using cookies
    const signatureFromCookie = Cookies.get(address); // Use the address as the key
    if (signatureFromCookie) {
      setIsSigned(true);
    } else {
      setIsSigned(false); // Address changed, reset the sign status
    }
  }, [address]); // Make sure to include address as a dependency

  const getStarted = async () => {
    if (isConnected) {
      console.log(isSigned);
      if (isSigned == true) {
        const connectedContract = await tronWeb.contract(
          abi,
          CHAINQ_SHASTA_TESTNET
        );

        let txget = await connectedContract
          .getSubscriptionStatus(address)
          .call();
        console.log(txget.hasSubscription);
        // console.log(txget);
        if (txget.hasSubscription) {
          navigate("./chat-dashboard");
        } else {
          setShowPlanPopup(!showPlanPopup);
        }
      } else {
        // User has not signed, show the popup
        setShowPopup(!showPopup);
      }
    } else {
      toast.error("Please connect to the wallet first!");
    }
  };

  // Create a ref for the HomeInstructions component
  const instructionsRef = useRef(null);

  // Function to scroll to the HomeInstructions component
  const scrollToInstructions = () => {
    console.log("clicked");
    if (instructionsRef.current) {
      instructionsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const togglePlanPopup = () => {
    setShowPlanPopup(!showPlanPopup);
  };
  return (
    <div className="main-div-landing">
      <div className="home-landing-sub">
        <Navbar togglePopup={togglePopup} />

        <div className="landing-flex">
          <div className="home-left-section">
            <h1 className="home-title">
              The AI-Powered Blockchain Data Querying System
            </h1>

            <p className="home-desc">
              Unleashing the Power of NLP and AI to Seamlessly Access and
              Analyze Blockchain Data
            </p>
            <div className="try-and-instructions-btn">
              <button className="try-btn" onClick={() => getStarted()}>
                Try ChainQ!
                <span className="rightA-icon-container">
                  <FaAnglesRight className="rightA-icon" />
                </span>
              </button>
              <div className="instructions-text-main-class">
                <span
                  className="instructions-text-class"
                  onClick={() => scrollToInstructions()}
                >
                  Go to instructions
                </span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-right-inside">
              <img
                className="hero-right-bg1 animated-bg"
                src={hero}
                alt="backgroundimage"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="home-instructions" ref={instructionsRef}>
        <HomeInstructions id="instructions" />
      </div>
      {isConnected ? (
        <>
          <div> not connected</div>
          {/* <Widget address={address} chain="Shasta" /> */}
        </>
      ) : null}
      <footer>
        <div className="footer-flex">
          <div style={{ color: "white", fontSize: "15px" }}>
            © 2023 ChainQ. All Rights Reserved.
          </div>
        </div>
      </footer>
      {showPopup && (
        <Popup
          onClose={togglePopup}
          address={address}
          setShowPlanPopup={setShowPlanPopup}
        />
      )}
      {showPlanPopup && <PlansPopup setShowSPopup={togglePlanPopup} />}
    </div>
  );
}

export default Home;
