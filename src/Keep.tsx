import { Link } from 'react-router-dom';
import TokenObject from './TokenObject';
import bigintToFloatString from './bigIntToFloatString';
import SwapFields from './components/SwapFields';
import { useEffect, useRef } from 'react';

interface KeepProps {
  gameCompleted: boolean;
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
  inputTokenObject: TokenObject;
  outputTokenObject: TokenObject;
  tokens: TokenObject[]; // Array of tokens
  setIsConnected: (value: boolean) => void;
  connectionType: string;
  setConnectionType: (value: string) => void;
  loggedInPrincipal: string;
  setLoggedInPrincipal: (value: string) => void;
}

const Keep: React.FC<KeepProps> = ({
  gameCompleted,
  loading,
  setLoading,
  isConnected,
  inputTokenObject,
  outputTokenObject,
  setIsConnected,
  connectionType,
  setConnectionType,
  loggedInPrincipal,
  setLoggedInPrincipal,
}) => {
  const targetSection = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Scroll to the referenced element
    if (targetSection.current) {
      targetSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <>
      <div className="dialogue-box" ref={targetSection}>
        <p>
          {!isConnected ? (
            <>
              {`Connect your wallet to see how much draggin karma you've sent
              into the world`}
            </>
          ) : (
            <>
              You've sent
              <span id="eggsSent">
                {` ${bigintToFloatString(
                  outputTokenObject.ledgerBalance * 800_000n,
                  outputTokenObject.decimals
                )} `}
              </span>
              {`dragon karma to this world to unlock your  ${bigintToFloatString(
                outputTokenObject.ledgerBalance,
                outputTokenObject.decimals
              )} Dragon Paladin Wizard`}
            </>
          )}
        </p>
        <div className="swap-fields">
          {gameCompleted ? (
            <>
              <SwapFields
                loading={loading}
                setLoading={setLoading}
                isConnected={isConnected}
                inputTokenObject={inputTokenObject}
                outputTokenObject={outputTokenObject}
              />
            </>
          ) : (
            <>
              <div className="egg-section">
                You must restore the energies of Luméira to use this feature.
                <div>
                  <Link to="/game">
                    <button style={{ marginTop: '16px' }}>
                      Enter the Luminescent Grove
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="banner">use your karma points</div>

      <footer>
        <Link to="/">
          <button>Back to Home</button>
        </Link>
      </footer>
      <div
        className="dialogue-box"
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          overflowX: 'auto',
          overflowY: 'hidden', // Prevents vertical scroll
          height: 'auto', // Let the height expand as needed
        }}
      >
        <p>
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⠛⠉⠀⠀⠀⠀⡜⠀⠀⠀⠀⠀⢀⣠⠶⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠚`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡴⠋⠁⠀⠀⠀⠀⠀⢀⡾⠁⠀⠀⠀⣠⡖⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠞⠉⠀⠀⠀⠀⠀⠀⠀⣠⠞⠀⠀⣠⡴⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠞⠁⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠟⠘⢦⠀⠀⠀⠀⠀⠀⠀⣴⠛⢛⣩⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠶⠋⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠃⢀⣀⠈⠙⠛⠓⠒⠦⠤⣞⣹⡶⠛⠁⠀⠀⠀⠀⢰⠇⠀⠀⠀⠀⢀⣴⠿⣅⣀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⠟⠒⠋⠉⠁⠀⠀⠀⢀⣤⠖⠋⠉⠁⠻⡄⠀⠀⠀⠀⠀⡏⠀⠀⠀⢀⣴⠋⠀⠀⠀⠉⠛⢦⣄⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠄⢀⣠⠖⠉⠀⠀⣀⣤⣶⠂⠀⠀⠀⣴⠋⠀⠀⠀⠀⠀⠀⠈⠲⣄⠀⠀⣰⠇⠀⠀⣰⠟⠁⠀⠀⠀⠀⠀⠀⠀⠈⠛⢦⡀⠀⣀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠟⣇⡴⠋⠀⠀⠀⣠⠞⠉⡾⠁⠀⢀⣠⠾⢶⡾⠂⠀⠀⠀⠀⠀⠀⠀⠈⠙⢾⣁⣠⡤⢼⣇⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠴⠖⠛⠉⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠃⠀⠋⠀⠀⠀⢠⡞⠁⠀⠀⠷⠖⠛⠉⠀⣰⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣏⣀⣀⣀⡤⠤⠖⠛⠋⠁⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠁⠀⠀⠀⠀⣠⠴⠋⠀⠀⠀⠀⠀⠀⠀⠀⢠⠏⠀⠀⠀⠀⠀⢠⠆⠀⠀⠀⠀⠀⠀⢀⣴⠞⠉⢩⠏⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣧⠞⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⢀⣰⠊⠀⠀⠀⠀⠀⢀⡎⢀⠀⠀⢲⡀⠔⠒⠋⠀⠀⠀⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡟⠁⠀⠀⣴⠃⠀⠀⠀⠀⠀⠀⢀⣀⣠⠴⢚⠁⠀⠀⠀⠀⠀⠀⠸⡟⠁⠀⠀⠀⠙⣦⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠴⠋⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⢠⡇⠀⠀⠀⠀⣠⢶⣻⣿⣿⢿⠁⡼⠀⠀⠀⠀⠀⠀⠀⠀⢷⡀⠀⠀⠀⠀⠘⣇⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⣀⣤⠖⠋⠁⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠀⠀⠀⢸⡃⠀⠀⠀⢠⣿⡟⠹⡄⡇⣼⡼⠁⠀⠀⠀⠀⠀⠀⠀⠀⣼⠇⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⢷⡀⠀⣀⣤⡖⠛⠉⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⣠⠟⠁⠀⠀⠀⠈⠁⠀⠀⣰⢿⢿⣷⣖⣯⠟⠁⠀⠀⠀⠀⢀⣀⣀⣀⣠⡾⠁⠀⠀⠀⠀⠀⢰⡇⠀⢀⠀⠀⠀⠀⠳⡏⠉⠀⠙⢦⡀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⣠⡄⠀⡼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⢠⠞⠁⠀⠀⠀⢀⣼⠛⠉⠹⡍⣩⠇⠀⠀⠀⠀⠀⠀⠀⣸⠒⠒⠉⢷⡀⠀⠀⣼⠏⠀⠀⠀⠀⠳⡄⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⡼⠃⣧⡞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡇⠀⠀⠀⠀⠀⣾⡋⢣⡀⠀⢳⠏⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⣀⡬⠟⠶⣟⡁⠀⠀⠀⠀⠀⠀⠘⢦⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⣠⢴⡇⠀⢈⡽⠁⠀⠀⠀⠀⠀⠀⠀⠀⣀⡄⠀⠀⣸⠀⠀⠀⠀⢀⣼⠃⠹⡀⢳⣠⡟⠀⠀⠀⠀⠀⠀⠀⠀⢰⡇⢠⠞⠁⠀⠀⠀⠀⠙⢦⡀⠀⠀⠀⠀⠀⠈⢣⡀⠀⠀⠀`}
          <br />
          {`  ⣼⠃⠀⠷⠔⠚⠁⠀⢀⠀⠀⠀⠀⢀⡴⠛⠁⠀⠀⠀⠀⠀⠀⣀⣠⡾⣅⡀⠀⢳⡀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⡞⠀⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀⠀⠀⠀⠀⠀⢳⡀⠀⠀`}
          <br />
          {`  ⡇⠀⠀⠀⠀⠀⢀⣴⠏⠀⠀⠀⢠⠞⢁⣤⣶⣶⢶⣲⠒⠒⠋⠉⠉⠉⠓⠻⣦⡀⣇⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣆⠀⠀⠀⠀⠀⠀⢳⡀⠀`}
          <br />
          {`  ⡇⠀⠀⠀⠀⠀⠸⠀⠀⠀⠀⠀⢀⣴⣿⢿⣄⣽⠺⡀⢀⣤⠤⠖⠒⠉⠉⠁⠀⠙⢾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣥⠤⠶⠖⠚⠋⠉⠙⠒⠶⢤⣽⡄⠀⠀⠀⠀⠀⠀⢳⡀`}
          <br />
          {`  ⠹⣦⣀⠀⠀⠀⠀⠀⠀⢀⣀⣴⠿⢿⠷⣼⡄⠉⣤⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢣`}
          <br />
          {`  ⠀⠀⠉⢻⢿⣿⣿⣿⠿⡟⠻⡿⡄⠈⣇⠀⢀⡼⠃⠀⠀⠀⠀⠀⠀⠀⠒⠛⠉⠛⣿⠀⠀⠀⠀⠀⠀⠀⣠⡾⠛⢤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈`}
          <br />
          {`  ⠀⠀⠀⠀⠳⠷⠿⠾⡷⢿⠢⠷⠙⠦⣸⡆⢸⡇⠀⠀⠀⠀⢠⡴⠒⠚⠉⠉⠁⠚⣿⠀⠀⠀⠀⠀⠀⣴⠋⠀⠀⠀⠉⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠈⢷⠀⠀⠀⠀⣿⢻⡀⠀⠀⠀⣀⢸⣿⠀⠀⠀⠀⢠⡞⠁⠀⠀⠀⠀⠀⠀⠈⠳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⠀⠀⢠⡿⢸⣷⠀⠀⠀⣿⡙⢻⠀⠀⠀⢰⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⡤⠾⠃⣀⡴⠋⠙⢧⣻⠀⠀⠀⣏⠛⡾⠀⠀⢀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡤⠶⠛⢋⣁⣀⡤⠖⠛⠁⠀⠀⠠⣼⣿⠀⠀⢼⠬⣷⡇⠀⠀⡾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⣠⡾⣫⡥⠖⠒⠋⠉⠉⣠⡏⠀⠀⠀⣦⣰⡶⢿⣿⠦⣄⣈⢣⡾⠀⠀⣸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⢸⡏⣾⠁⠀⠀⠀⣀⣴⣺⠏⠀⠀⠀⠀⠻⡍⢻⣾⣈⢦⡀⢉⡿⠁⠀⢠⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⠀⠻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠹⣷⡈⠉⠓⠒⠻⠷⢯⣵⠶⠃⠀⠀⠀⠀⢹⡾⠾⠿⠿⠿⠋⠁⠀⠀⡾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠀⠀⠀⠀⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠛⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠈⠙⠲⣄⣀⣀⣀⣀⣠⡴⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠁⠀⠀⠀⠀⠈⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
          {`  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠃⠀⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
          <br />
        </p>
      </div>
    </>
  );
};

export default Keep;
