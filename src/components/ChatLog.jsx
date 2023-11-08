import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import icon from "../assets/favicon.png";
import logo from "../assets/logo.png";
import user from "../assets/user.jpg";
import "../styles/ChatLog.scss";
import EmptyComponent from "./EmptyComponent";
import Cookies from "js-cookie";
import { PiCopySimpleLight } from "react-icons/pi";
import { BiCheck } from "react-icons/bi";
import { BounceLoader, ClipLoader } from "react-spinners";
import { getUserChatIds, getChatPromptsAndResponses } from "../APIs/apis";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { useAccount, useConnect } from "wagmi";

const ChatLog = ({
  messages,
  isLoading,
  currentChatId,
  setShowMessageHistory,
  showMessageHistory,
}) => {
  const [copiedMessage, setCopiedMessage] = useState(null);
  // const responseContainerRef = useRef(null);
  const [isSigned, setIsSigned] = useState(null);
  const [token, setToken] = useState(null);

  const { address, isConnecting, isDisconnected } = useAccount();
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, pendingConnector } = useConnect();

  const [activeId, setActiveId] = useState();
  const [chatData, setChatData] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (currentChatId) {
      setChatData((prevChatMessages) => [...prevChatMessages, messages]);
    }
  }, [messages]);

  console.log(messages);

  // useEffect(() => {
  //   if (currentChatId === null) {
  //     setChatData([messages]);
  //   }
  // }, [messages]);

  console.log(chatData);

  useEffect(() => {
    if (currentChatId === null) {
      return <EmptyComponent />;
    } else {
      setActiveId(currentChatId);
    }
  }, [currentChatId, activeId]);

  useEffect(() => {
    const signatureFromCookie = Cookies.get(address);
    if (signatureFromCookie) {
      setToken(signatureFromCookie);
      setIsSigned(true);
    } else {
      setIsSigned(false);
    }
  }, [address, isConnected, token]);

  const fetchChatPromptsAndResponses = async () => {
    try {
      if (token) {
        const response = await getChatPromptsAndResponses(activeId, token);
        // console.log(response);
        setChatData(response.data.promptsAndResponses);
        console.log(response.data.promptsAndResponses);
        setIsPageLoading(false);
      }
    } catch (error) {
      console.error("Error fetching chat prompts and responses:", error);
    }
  };

  useEffect(() => {
    fetchChatPromptsAndResponses();
  }, [activeId]);

  useEffect(() => {
    if (!isLoading) {
      // setTimeout(() => {
      fetchChatPromptsAndResponses();
      // }, 2000);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isPageLoading && isLoading) {
      // Scroll to the BounceLoader element when isLoading is true
      const bounceLoaderDiv = document.querySelector(".loader-bounce-main");
      if (bounceLoaderDiv) {
        bounceLoaderDiv.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    } else if (!isPageLoading) {
      // Scroll to the bottom of the chat log div when new messages are loaded
      const chatLogDiv = document.querySelector(".chat-log");
      chatLogDiv.scrollTo({
        top: chatLogDiv.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatData, isPageLoading, isLoading]);

  // const copyToClipboard = (text) => {
  //   const textArea = document.createElement("textarea");
  //   textArea.value = text;
  //   document.body.appendChild(textArea);
  //   textArea.select();
  //   document.execCommand("copy");
  //   document.body.removeChild(textArea);
  //   setCopiedMessage(text);

  //   setTimeout(() => {
  //     setCopiedMessage(null);
  //   }, 3000);
  // };

  const copyToClipboard = (text) => {
    try {
      const jsonData = JSON.parse(text);

      const formatJson = (data, depth = 0) => {
        let formattedText = "";

        for (const key in data) {
          const value = data[key];

          if (typeof value === "object" && value !== null) {
            formattedText += `${key}\n${formatJson(value, depth + 1)}`;
          } else {
            formattedText += `${"  ".repeat(depth)}${key}\n${"  ".repeat(
              depth
            )}${value}\n`;
          }
        }

        return formattedText;
      };

      const formattedText = formatJson(jsonData);

      const textArea = document.createElement("textarea");
      textArea.value = formattedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedMessage(text);

      setTimeout(() => {
        setCopiedMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  // Function to display JSON as a table
  const renderValue = (value) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        // Handle arrays
        return (
          <ul>
            {value.map((item, index) => (
              <li key={index}>{renderValue(item)}</li>
            ))}
          </ul>
        );
      } else {
        // Handle objects (display rows vertically)
        return (
          <div className="json-table">
            {Object.entries(value).map(([key, val]) => (
              <div key={key} className="json-row">
                <div className="json-key">{key}</div>
                <div className="json-value">{renderValue(val)}</div>
              </div>
            ))}
          </div>
        );
      }
    } else {
      return value;
    }
  };

  const renderJsonAsTable = (jsonString) => {
    try {
      const jsonData = JSON.parse(jsonString);

      if (typeof jsonData !== "object" || jsonData === null) {
        return <div>{jsonString}</div>;
      }

      return <div>{renderValue(jsonData)}</div>;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return <div>{jsonString}</div>;
    }
  };

  // Function to render a chat message
  const renderChatMessage = (chatItem, index) => {
    // console.log(index);
    // const isLastResponse =
    //   index === chatData.length - 1 && chatItem.responseText;
    return (
      <>
        <div key={index} className="chat-msg-user">
          {chatItem.promptText && (
            <div className="chat-msg-center">
              <div className="chat-avatar-user">
                <img
                  src={user}
                  alt="User Avatar"
                  style={{
                    width: "35px",
                    borderRadius: "50px",
                  }}
                />
              </div>
              <div className="chat-msg-user prompt-window-main">
                <div className="prompt-window-subClass">
                  {chatItem.promptText}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div key={index} className="chat-msg-response">
          {chatItem.responseText && chatItem.responseText.length > 0 && (
            <>
              <div className="chat-msg-center">
                <div className="chat-avatar-response">
                  <img
                    src={icon}
                    alt="Bot Avatar"
                    style={{
                      width: "35px",
                      height: "45px",
                    }}
                  />
                </div>
                <>
                  <div className="chat-msg-response response-window-main">
                    <div className="response-window-subClass">
                      {renderJsonAsTable(chatItem.responseText)}
                    </div>
                  </div>
                  <div
                    className="copy-main-div"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      position: "relative",
                      marginLeft: "2%",
                      left: "0%",
                    }}
                  >
                    <div
                      className="copy-button"
                      onClick={() => copyToClipboard(chatItem.responseText)}
                    >
                      {copiedMessage === chatItem.responseText ? (
                        <div>
                          <BiCheck className="bicheck" />
                        </div>
                      ) : (
                        <PiCopySimpleLight className="picopysimplelight" />
                      )}
                    </div>
                  </div>
                </>
              </div>
            </>
          )}
          {chatItem.responseText && chatItem.responseText.length === 0 && (
            <div className="chat-msg-center">
              <div className="chat-avatar-response">
                <img
                  src={icon}
                  alt="Bot Avatar"
                  style={{
                    width: "35px",
                    height: "45px",
                  }}
                />
              </div>
              <div className="chat-msg-response response-window-main">
                <div className="response-window-subClass">
                  I am just an AI Bot, I am in a Beta stage.
                </div>
              </div>
            </div>
          )}
        </div> */}

        <div key={index} className="chat-msg-response">
          {chatItem.responseText && (
            <>
              <div className="chat-msg-center">
                <div className="chat-avatar-response">
                  <img
                    src={icon}
                    alt="Bot Avatar"
                    style={{
                      width: "35px",
                      height: "45px",
                    }}
                  />
                </div>

                <>
                  <div className="chat-msg-response response-window-main">
                    <div className="response-window-subClass">
                      {chatItem.responseText &&
                      chatItem.responseText.trim() !== "[]" ? (
                        renderJsonAsTable(chatItem.responseText)
                      ) : (
                        <span>
                          I'm just an AI model still in beta stage, so I've got
                          some limitations and not a ton of data to work with.
                          Sorry about that! 🙇‍♂️ But I'm here to help however I
                          can, so feel free to ask me anything about tron
                          blockchain. ♦️😊
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="copy-main-div"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      position: "relative",
                      marginLeft: "2%",
                      left: "0%",
                    }}
                  >
                    <div
                      className="copy-button"
                      onClick={() => copyToClipboard(chatItem.responseText)}
                    >
                      {copiedMessage === chatItem.responseText ? (
                        <div>
                          <BiCheck className="bicheck" />
                        </div>
                      ) : (
                        <PiCopySimpleLight className="picopysimplelight" />
                      )}
                    </div>
                  </div>
                </>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div>
        <div className="open-close-tab-icons">
          <div
            className={showMessageHistory ? "close-tab-icon" : "open-tab-icon"}
            onClick={() => setShowMessageHistory(!showMessageHistory)}
          >
            {showMessageHistory ? (
              <TbLayoutSidebarLeftCollapseFilled
                className="SidebarLeftCollapseFilled"
                style={{ fontSize: "2rem" }}
              />
            ) : (
              <TbLayoutSidebarLeftExpandFilled
                className="SidebarLeftCollapseFilled"
                style={{ fontSize: "2rem" }}
              />
            )}
          </div>
        </div>
        {isPageLoading ? (
          <div className="chat-log-main">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                borderBottom: "0px solid #595959",
              }}
            >
              <Link to="/">
                <img
                  className="chat-log-title"
                  src={logo}
                  alt="Chat Log Title"
                />
              </Link>
            </div>
            <div className="chat-log">
              <div className="chatLog-loader-main-class">
                <ClipLoader color="#ffffff" />
              </div>
            </div>
          </div>
        ) : chatData.length === 0 ? (
          <EmptyComponent />
        ) : (
          <div className="chat-log-main">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link to="/">
                <img
                  className="chat-log-title"
                  src={logo}
                  alt="Chat Log Title"
                />
              </Link>
            </div>
            <div className="chat-log">
              {chatData.map((chatItem, index) =>
                renderChatMessage(chatItem, index)
              )}
              {isLoading && (
                <div
                  className={`loader-bounce-main chat-msg-response ${
                    isLoading ? "" : "hide"
                  }
            }`}
                >
                  <BounceLoader className="bounce-loader" color="#191919" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatLog;
