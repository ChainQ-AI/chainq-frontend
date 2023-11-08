import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import "../styles/MessageHistory.scss";
import { getUserChatIds, deleteChat, deleteUserData } from "../APIs/apis";
import Cookies from "js-cookie";
import PlansPopup from "./PlansPopup";
import { ClipLoader } from "react-spinners";
import abi from "../artifacts/chainq_abi.json";
import { CHAINQ_SCROLL } from "../config";
import { useAccount, useConnect } from "wagmi";

const MessageHistory = ({
  inputRef,
  sessions,
  showChatLog,
  setShowChatLog,
  setCurrentChatId,
  currentChatId,
  handleCreateNewChat,
  messages,
  showMessageHistory,
}) => {
  const [isSigned, setIsSigned] = useState(null);
  const [chatTitleList, setChatTitleList] = useState([]);
  const [apiResponse, setApiResponse] = useState([]);
  const [token, setToken] = useState(null);

  const { address, isConnecting, isDisconnected } = useAccount();
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, pendingConnector } = useConnect();

  const [showSPopup, setShowSPopup] = useState();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState({
    hasSubscription: false,
    expirationTimestamp: 0,
  });
  const [displayedChatSessions, setDisplayedChatSessions] = useState([]);

  console.log("messages", messages);

  useEffect(() => {
    if (currentChatId === null)
      setApiResponse((prevChats) => [...prevChats, messages]);
  }, [messages]);

  useEffect(() => {
    if (!isPageLoading) {
      setDisplayedChatSessions(apiResponse);
    }
  }, [isPageLoading, apiResponse]);

  useEffect(() => {
    const signatureFromCookie = Cookies.get(address); // Use the address as the key
    console.log("signatureFromCookie", signatureFromCookie);
    if (signatureFromCookie) {
      setToken(signatureFromCookie);
      setIsSigned(true);
      getPlanDetails();

      // Check if there is an authenticated user and get their chat IDs
      if (isConnected && isSigned) {
        // fetchUserChatIds();
        fetchUserChatIds(address, token);
      }
    } else {
      setIsSigned(false);
    }
  }, [address, isConnected, token]);

  const getPlanDetails = async () => {
    const connectedContract = await tronWeb.contract(abi, CHAINQ_SCROLL);
    console.log(connectedContract);
    let txget = await connectedContract.getSubscriptionStatus(address).call();
    console.log(txget.hasSubscription);
    console.log(parseInt(txget.expirationTimestamp));
    setSubscriptionData({
      hasSubscription: txget.hasSubscription,
      expirationTimestamp: parseInt(txget.expirationTimestamp),
    });
  };

  const fetchUserChatIds = async () => {
    try {
      if (token) {
        // Check if the token is defined
        const response = await getUserChatIds(address, token);
        console.log(response.data.chatData);
        setApiResponse(response.data.chatData);
        setIsPageLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user's chat IDs:", error);
      setIsPageLoading(false);
      setCurrentChatId(null);
    }
  };

  // Function to set the currentChatId based on the latest timestamp
  const setLatestChatId = () => {
    if (apiResponse.length > 0) {
      // Sort the chat sessions by timestamp in descending order
      const sortedSessions = apiResponse.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      // Set the currentChatId to the chat session with the latest timestamp
      setCurrentChatId(sortedSessions[0].chatId);
    }
  };

  useEffect(() => {
    // Call the function to set the currentChatId when apiResponse or isConnected changes
    setLatestChatId();
  }, [apiResponse, isConnected]);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  const handleSwitchSession = async (chatId) => {
    console.log("getting chatId", chatId);
    setCurrentChatId(chatId);

    console.log(currentChatId);
    if (inputRef.current) {
      inputRef.current.focus();
    } else {
      // Handle the case where the session is not available (optional)
      console.log(`Session with ID ${chatId} does not exist.`);
    }
  };

  const handleDeleteChat = async (event, chatID) => {
    event.stopPropagation();
    if (apiResponse.length === 1) {
      handleDeleteUserData();
    } else if (apiResponse.length >= 1) {
      const deleteChatConfirm = window.confirm("Click ok to continue.");
      if (deleteChatConfirm) {
        if (isConnected) {
          try {
            const response = await deleteChat(chatID, token);
            console.log(response);
            setApiResponse((prevChats) =>
              prevChats.filter((chat) => chat.chatId !== chatID)
            );

            // // Set the previous chatId (second to latest) after deleting a chat

            if (apiResponse.length >= 1) {
              setCurrentChatId(apiResponse[0].chatId);
            } else {
              // If there are no chats left, set currentChatId to null
              setCurrentChatId(null);
            }
          } catch (error) {
            console.error("Error deleting chat:", error);
          }
        }
      }
    }
  };

  const togglePlanPopup = () => {
    setShowSPopup(!showSPopup);
  };

  const handleDeleteUserData = async () => {
    if (isConnected) {
      const confirmDelete = window.confirm("It will delete all your chats.");
      if (confirmDelete) {
        try {
          const response = await deleteUserData(address, token);
          setDisplayedChatSessions([]);
          setCurrentChatId(null);
          window.location.reload();
          console.log(response);
        } catch (error) {
          console.error("Error deleting user data:", error);
        }
      }
    }
  };

  // console.log(apiResponse);
  // console.log(chatTitleList)
  return (
    <>
      {/* {showMessageHistory && ( */}
      <div className={`message-history ${showMessageHistory ? "active" : ""}`}>
        <div className="action-btns-mh">
          <div
            className="side-menu-newChat-button"
            onClick={() => {
              handleCreateNewChat();
            }}
          >
            <span className="newChatText">+ New Chat</span>
          </div>
          <div className="side-menu-button" onClick={handleDeleteUserData}>
            <span>
              <AiOutlineDelete />
            </span>
          </div>
        </div>
        <div className="chat-history-list">
          <div className="chat-history-msg-list">
            <div className="chatTitle-list">
              {isPageLoading ? (
                <div className="chatList-loader-main-class">
                  <ClipLoader color="#ffffff" />
                </div>
              ) : displayedChatSessions.length === 0 ? (
                <div className="no-messages-center" style={{ color: "white" }}>
                  No chats yet.
                </div>
              ) : (
                displayedChatSessions
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort in descending order
                  .map((chat) => (
                    // .map((chat) => (
                    <>
                      <div
                        key={chat.chatId}
                        className={`message chat-session
                          ${
                            chat.chatId === currentChatId
                              ? "active-session"
                              : ""
                          }`}
                        onClick={() => handleSwitchSession(chat.chatId)}
                        // data-chat-id={chat.chatId}
                      >
                        <div className="session-main-title">
                          {/* {chat.chatTitle} */}

                          {chat.chatTitle.length >= 20 || chat.titleOverflow
                            ? `${chat.chatTitle.substring(0, 20)}...`
                            : chat.chatTitle}
                        </div>

                        {chat.chatId === currentChatId && (
                          <div
                            className="delete-session"
                            onClick={(event) =>
                              handleDeleteChat(event, chat.chatId)
                            }
                          >
                            <RiDeleteBin6Line />
                          </div>
                        )}
                      </div>
                    </>
                  ))
              )}
            </div>
          </div>

          {!isPageLoading && (
            <div
              className="upgrade-btn-class"
              onClick={() => setShowSPopup(true)}
            >
              <p>
                <span
                  style={{
                    color: subscriptionData.hasSubscription ? "green" : "red",
                  }}
                >
                  {subscriptionData.hasSubscription
                    ? "Plan Active"
                    : "No Active Plan"}
                </span>
              </p>
              {subscriptionData.hasSubscription ? (
                <p>
                  Expires on:{" "}
                  {formatTimestamp(subscriptionData.expirationTimestamp)}
                </p>
              ) : (
                <>
                  <button className="upgrade-btn-sub-class">
                    Purchase Plan
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* )} */}

      {showSPopup && (
        <PlansPopup setShowSPopup={setShowSPopup} onClose={togglePlanPopup} />
      )}
    </>
  );
};

export default MessageHistory;
