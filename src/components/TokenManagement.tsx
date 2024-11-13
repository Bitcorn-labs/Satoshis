import React, { useEffect, useState } from "react";
import TransactionBox from "./TransactionBox";
import TokenReceive from "./TokenReceive";
import TokenObject from "../utils/TokenObject";

interface TokenManagementProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  tokens: TokenObject[]; // Array of tokens
  loggedInPrincipal: string;
  fetchBalances: () => void;
  isConnected: boolean;
}

const TokenManagement: React.FC<TokenManagementProps> = ({
  loading,
  setLoading,
  tokens,
  loggedInPrincipal,
  fetchBalances,
  isConnected,
}) => {
  const [activeTab, setActiveTab] = useState(0); // Use index to track active tab
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Function to render the content based on the selected tab
  const renderContent = () => {
    const activeToken = tokens[activeTab];

    return (
      <div>
        <TokenReceive
          activeToken={activeToken}
          loggedInPrincipal={loggedInPrincipal}
        />
        <h2>Send {activeToken.ticker}s:</h2>
        <TransactionBox
          key={activeTab}
          loading={loading}
          setLoading={setLoading}
          token={activeToken}
        />
      </div>
    );
  };

  useEffect(() => {
    if (lastUpdate + 2000 < Date.now()) {
      // prevent a lot of unneccessary calls.
      fetchBalances();
      setLastUpdate(Date.now());
    }
  }, [activeTab]);

  if (isConnected) {
    return (
      <div style={{ maxWidth: "600px" }} className="transactionBox">
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #ddd" }}>
          {tokens.map((token, index) => (
            <button
              className="bobButton"
              key={index}
              onClick={() => setActiveTab(index)}
              style={{
                padding: "10px",
                cursor: "pointer",
                border: activeTab === index ? "2px solid #646cff" : "none",
                color: activeTab === index ? "" : "",
                borderBottom:
                  activeTab === index ? "2px solid #646cff" : "none",
                outline: "none",
                width: "50%",
              }}
            >
              {index === 0 ? `$${token.ticker}` : `$${token.ticker}`} {/*lol?*/}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: "20px" }}>{renderContent()}</div>
      </div>
    );
  }
};

export default TokenManagement;
