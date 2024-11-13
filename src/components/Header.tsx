import { RefObject } from "react";
import TokenObject from "../utils/TokenObject";
import InternetIdentityLoginHandler from "./InternetIdentityLoginHandler";
import PlugLoginHandler from "./PlugLoginHandler";

interface HeaderProps {
  inputTokenObject: TokenObject;
  outputTokenObject: TokenObject;
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  connectionType: string;
  setConnectionType: (value: string) => void;
  loggedInPrincipal: string;
  setLoggedInPrincipal: (value: string) => void;
}
const Header: React.FC<HeaderProps> = ({
  inputTokenObject,
  outputTokenObject,
  loading,
  setLoading,
  isConnected,
  setIsConnected,
  connectionType,
  setConnectionType,
  loggedInPrincipal,
  setLoggedInPrincipal,
}) => {
  return (
    <div style={{ marginBottom: "16px", width: "100%" }}>
      <header>
        <div className="navbar">
          <a href="#introduction">Introduction</a>
          <a href="#why-bitcoin">Why Bitcoin</a>
          <a href="#how-bitcoin-works">How Bitcoin Works</a>
          <a href="#internet-computer">Internet Computer</a>
          <a href="#chain-key-tech">Chain Key Technology</a>
        </div>
        <h1>Bitcoin, Corntoshis Vision</h1>
        <button className="cta-button">Learn More</button>
      </header>
      <PlugLoginHandler
        tokens={[inputTokenObject, outputTokenObject]}
        loading={loading}
        setLoading={setLoading}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
        connectionType={connectionType}
        setConnectionType={setConnectionType}
        loggedInPrincipal={loggedInPrincipal}
        setLoggedInPrincipal={setLoggedInPrincipal}
      />
      <InternetIdentityLoginHandler
        tokens={[inputTokenObject, outputTokenObject]}
        loading={loading}
        setLoading={setLoading}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
        connectionType={connectionType}
        setConnectionType={setConnectionType}
        loggedInPrincipal={loggedInPrincipal}
        setLoggedInPrincipal={setLoggedInPrincipal}
      />
    </div>
  );
};

export default Header;
