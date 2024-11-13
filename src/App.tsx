import { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import ic from "ic0";
import { Stats } from "./declarations/backend/backend.did.d";

import bigintToFloatString from "./utils/bigIntToFloatString";
import TokenObject from "./utils/TokenObject";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Swap from "./Swap";

function App() {
  const [loading, setLoading] = useState(false);
  // const [icpBalance, setIcpBalance] = useState<bigint>(0n);

  const [share, setShare] = useState<bigint>(0n);
  const [stats, setStats] = useState<Stats | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionType, setConnectionType] = useState<string>("");

  const [totalInputTokenHeld, setTotalInputTokenHeld] = useState<string>("");

  const [loggedInPrincipal, setLoggedInPrincipal] = useState("");

  const inputTokenDetails = {
    fee: 10n,
    ticker: "ckBTC",
    decimals: 8,
    canisterId:
      process.env.DFX_NETWORK === "local"
        ? "bd3sg-teaaa-aaaaa-qaaba-cai"
        : "mxzaz-hqaaa-aaaar-qaada-cai",
  };

  const outputTokenDetails = {
    fee: 10n,
    ticker: "SATS",
    decimals: 8,
    canisterId:
      process.env.DFX_NETWORK === "local" ? "bkyz2-fmaaa-aaaaa-qaaaq-cai" : "", // tbd
  };

  const [inputTokenObject, setInputTokenObject] = useState<TokenObject>(
    new TokenObject({
      ...inputTokenDetails,
      actor: null,
      ledgerBalance: 0n,
      setToken: null,
      loggedInPrincipal: "",
    })
  );

  const [outputTokenObject, setOutputTokenObject] = useState<TokenObject>(
    new TokenObject({
      ...outputTokenDetails,
      actor: null,
      ledgerBalance: 0n,
      setToken: null,
      loggedInPrincipal: "",
    })
  );

  const fetchTotalTokens = async () => {
    // const totalBobHeldResponse = await bobLedgerActor.icrc1_balance_of({
    //   owner: Principal.fromText(reBobCanisterID),
    //   subaccount: [],
    // }); // Can't use plug actors as anonymous.
    // We will use the internet identity anonymous calls in the next update. ic0 will work for now.
    if (process.env.DFX_NETWORK === "local") return;
    const inputIcActor = await ic(inputTokenObject.canisterId); // hard coding this because it will work in local still.
    const totalInputTokenResponse = await inputIcActor.call(
      "icrc1_balance_of",
      {
        owner: Principal.fromText(outputTokenObject.canisterId), // hard coding this because it won't work with local of reBobCanisterID
        subaccount: [],
      }
    );
    setTotalInputTokenHeld(
      bigintToFloatString(totalInputTokenResponse, inputTokenObject.decimals)
    );
  };

  useEffect(() => {
    fetchTotalTokens();

    setInputTokenObject(
      new TokenObject({
        ...inputTokenDetails,
        actor: null,
        ledgerBalance: 0n,
        setToken: setInputTokenObject,
        loggedInPrincipal: "",
      })
    );

    setOutputTokenObject(
      new TokenObject({
        ...outputTokenDetails,
        actor: null,
        ledgerBalance: 0n,
        setToken: setOutputTokenObject,
        loggedInPrincipal: "",
      })
    );
  }, []); // Dependency array remains empty if you only want this effect to run once on component mount

  const fetchStats = async () => {
    if (outputTokenObject.actor !== null) {
      const stats = await outputTokenObject.actor.stats();
      console.log({ stats });
      setStats(stats);
    }
  };

  const fetchBalances = async () => {
    fetchTotalTokens();

    if (!isConnected) return;
    inputTokenObject.getLedgerBalance();
    outputTokenObject.getLedgerBalance();
  };

  return (
    <div
      className="App"
      style={{
        display: "flex", // Enable flexbox
        flexDirection: "column", // Optional: stack children vertically
        justifyContent: "center", // Center content vertically
        alignItems: "center", // Center content horizontally
        minHeight: "100vh", // Make sure it covers the full viewport height
        textAlign: "center", // Center text if needed
        width: "100%",
        margin: "0",
        padding: "0",
        boxSizing: "border-box",
      }}
    >
      <Header
        inputTokenObject={inputTokenObject}
        outputTokenObject={outputTokenObject}
        loading={loading}
        setLoading={setLoading}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
        connectionType={connectionType}
        setConnectionType={setConnectionType}
        loggedInPrincipal={loggedInPrincipal}
        setLoggedInPrincipal={setLoggedInPrincipal}
      />
      <Routes>
        <Route
          path="/"
          element={<Home totalInputTokenHeld={totalInputTokenHeld} />}
        />

        <Route
          path="/swap"
          element={
            <Swap
              loading={loading}
              setLoading={setLoading}
              isConnected={isConnected}
              inputTokenObject={inputTokenObject}
              outputTokenObject={outputTokenObject}
              tokens={[inputTokenObject, outputTokenObject]}
              setIsConnected={setIsConnected}
              connectionType={connectionType}
              setConnectionType={setConnectionType}
              loggedInPrincipal={loggedInPrincipal}
              setLoggedInPrincipal={setLoggedInPrincipal}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer
        loading={loading}
        setLoading={setLoading}
        tokens={[inputTokenObject, outputTokenObject]}
        loggedInPrincipal={loggedInPrincipal}
        fetchBalances={fetchBalances}
        isConnected={isConnected}
      />
    </div>
  );
}

export default App;
