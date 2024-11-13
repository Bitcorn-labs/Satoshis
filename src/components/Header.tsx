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
  gameCompleted: boolean;
  loginSection: RefObject<HTMLDivElement>;
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
  gameCompleted,
  loginSection,
}) => {
  return (
    <div style={{ marginBottom: "16px", width: "100%" }}>
      <header>
        <h1>DRAGGIN KARMA POINTS</h1>
        <h1>Paladin Wizard Society</h1>
        <h2>
          Use your karma points to unleash your inner Dragon Paladin Wizard
        </h2>
      </header>
      <div className="container">
        <div className="image-box">
          <img src="banner/Paladin.webp" alt="Paladin" />
          <p>Brave Paladin</p>
        </div>
        <div className="image-box">
          <img src="banner/Borovan.webp" alt="Dragon" />
          <p>Dragon king</p>
        </div>
        <div className="image-box">
          <img src="banner/Priests.webp" alt="Wizard" />
          <p>protect your eggs</p>
        </div>
        <div className="image-box">
          <img src="banner/Eggs.webp" alt="Egg" />
          <p>draggin karma eggs</p>
        </div>
      </div>
      <div ref={loginSection} className="banner">
        Dragon Paladin Wizards
      </div>
      <h2>{gameCompleted ? "Greetings Champion" : <></>}</h2>
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
