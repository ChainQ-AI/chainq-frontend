import React from "react";
import "../styles/HomeInstructions.scss";

function HomeInstructions() {
  const steps = [
    {
      number: 1,
      title: "Connect Your TRON Wallet",
      description:
        "To commence, please connect your TRON wallet. This crucial step ensures a secure and seamless experience on the ChainQ platform.",
    },
    {
      number: 2,
      title: `Sign the Message "Login to ChainQ"`,
      description: `Next, you will be prompted to sign the message "Login to ChainQ" to complete the authentication process. This action is essential for verifying your identity within the system. No contract calls or fund deductions will occur during this step.`,
    },
    {
      number: 3,
      title: "Purchase the 500 TRX Plan to Begin",
      description:
        "Now, you can initiate your journey on ChainQ by acquiring the 500 TRX plan. This purchase will grant you access to the platform's features, enabling you to start your investment journey.",
    },
    // Add more steps as needed
  ];

  return (
    <div className="instructions-container">
      <div className="instructions-title">
        <h2>How to Use Our Website ?</h2>
      </div>
      <div className="instructions-content">
        {steps.map((step) => (
          <div className="step" key={step.number}>
            {/* <div className="step-number">{step.number}</div> */}
            <div className="step-content">
              <h3>{`Step ${step.number}: ${step.title}`}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="instructions-note">
        <p>
          Please keep in mind that ChainQ is currently in its beta stage, and we
          are committed to ongoing improvements to enhance your experience. Your
          feedback and support are invaluable as we work to refine and evolve
          the platform.
        </p>
        <p>
          Thank you for choosing ChainQ, and please do not hesitate to reach out
          to our dedicated support team if you have any questions or require
          further assistance. We are here to assist you in achieving your goals.
        </p>
      </div>
    </div>
  );
}

export default HomeInstructions;
