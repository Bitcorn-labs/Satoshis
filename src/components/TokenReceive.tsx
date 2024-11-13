import React, { useState } from "react";
import bigintToFloatString from "../utils/bigIntToFloatString";
import { _SERVICE as bobService } from "../declarations/nns-ledger/index.d";
import { _SERVICE as reBobService } from "../declarations/service_hack/service";
import TokenObject from "../utils/TokenObject";

// interface Token {
//   tokenActor: bobService | reBobService | null;
//   tokenFee: bigint;
//   tokenTicker: string;
//   tokenDecimals: number;
//   tokenLedgerBalance: bigint;
// }

const TokenReceive: React.FC<{
  activeToken: TokenObject;
  loggedInPrincipal: string;
}> = ({ activeToken, loggedInPrincipal }) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(loggedInPrincipal);
      setCopySuccess("Copied to clipboard!");
      setTimeout(() => setCopySuccess(null), 2000); // Reset notification after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(null), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div>
      <h2>Receive {activeToken.ticker}s:</h2>
      <div>{`You have: ${bigintToFloatString(
        activeToken.ledgerBalance,
        activeToken.decimals
      )} ${activeToken.ticker}s`}</div>
      <div>{`Send more ${activeToken.ticker}s to:`}</div>

      {/* Copyable loggedInPrincipal */}
      <div
        onClick={copyToClipboard}
        style={{
          cursor: "pointer",
          textDecoration: "underline",
        }}
        title="Click to copy"
      >
        {loggedInPrincipal}
        <div>
          <button className="bobButton">copy</button>
        </div>
      </div>

      {/* Notification area with fixed height */}
      <div style={{ height: "24px", marginTop: "10px" }}>
        {copySuccess && <span style={{ color: "green" }}>{copySuccess}</span>}
      </div>
    </div>
  );
};

export default TokenReceive;
