import "../styles/main.scss";
import arrow from "../assets/Arrow.png";
import React, { useState } from "react";

function EmptyComponent({ sendMessage, setNewMessage, inputRef }) {
  const sentences = [
    "How many total transactions for block 54075718?",
    "And list all the transaction hashes?",
    "Can you give me more information about the same block?",
  ];

  const handleSentenceClick = (sentence) => {
    setNewMessage(sentence);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div style={{ width: "70%", margin: "50px auto" }}>
      <h1 className="dash-title">
        Let's Explore <span style={{ color: "#246aee" }}>ChainQ</span>
      </h1>
      <div className="common-que-flex">
        <div style={{ width: "50%", flexDirection: "column", display: "flex" }}>
          <div
            style={{
              fontFamily: "BeVietnamPro-SemiBold",
              fontSize: "20px",
              paddingBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Prompts example
          </div>
          {sentences.map((sentence, index) => (
            <p
              key={index}
              className="empty-que"
              onClick={() => handleSentenceClick(sentence)}
            >
              {sentence}
              <img
                className="arrowBtn"
                src={arrow}
                style={{ width: "25px", padding: "10px" }}
                alt="Arrow"
              />
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmptyComponent;
