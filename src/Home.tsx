import { Link } from 'react-router-dom';
import TokenObject from './TokenObject';
import GroupPhoto from './components/GroupPhoto';
import InternetIdentityLoginHandler from './components/InternetIdentityLoginHandler';
import PlugLoginHandler from './components/PlugLoginHandler';

interface HomeProps {
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

const Home: React.FC<HomeProps> = ({
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
  const handleKeepClick = () => {
    console.log(
      "window.location.href='https://dodkw-jyaaa-aaaag-qbryq-cai.raw.icp0.io/245'"
    );
  };
  return (
    <div>
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

      <div className="egg-section">
        <h2>use karma points</h2>
        <p>
          Travlers have sent <span id="eggsSent">0</span> dragon karma to this
          world.
        </p>
        <Link to="/keep">
          <button onClick={handleKeepClick}>Enter the Keep</button>
        </Link>

        <Link to="/lair">
          <button>Enter the Lair</button>
        </Link>

        <Link to="/game">
          <button>Enter the Luminescent Grove</button>
        </Link>
      </div>
      <GroupPhoto />
    </div>
  );
};

export default Home;
