import { useEffect } from 'react';
import TokenObject from '../TokenObject';

interface PlugLoginHandlerProps {
  tokens: TokenObject[];
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  connectionType: string;
  setConnectionType: (value: string) => void;
  loggedInPrincipal: string;
  setLoggedInPrincipal: (value: string) => void;
}

const PlugLoginHandler: React.FC<PlugLoginHandlerProps> = ({
  tokens,
  loading,
  setLoading,
  isConnected,
  setIsConnected,
  connectionType,
  setConnectionType,
  loggedInPrincipal,
  setLoggedInPrincipal,
}) => {
  const checkConnection = async () => {
    if (connectionType !== '') return false; // I think this needs to be reworked.
    try {
      const connection = !!(await window.ic.plug.isConnected());

      console.log({ connection });

      setIsConnected(connection);

      if (connection) {
        setConnectionType('plug');
        return true;
      } else {
        setConnectionType('');
        return false;
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!isConnected || connectionType !== 'plug') return;
    fetchPrincipal();
    setUpActors();
    console.log('isConnected', isConnected, connectionType);
  }, [isConnected]);

  const fetchPrincipal = async () => {
    if (!checkConnection) return;
    const principal = (await window.ic.plug.agent.getPrincipal()).toString();
    for (const token of tokens) {
      token.setLoggedInPrincipal(principal);
    }
    setLoggedInPrincipal(principal); // is this necessary anymore?
  };

  const setUpActors = async () => {
    for (const token of tokens) {
      token.setActor('plug', null);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    if (isConnected && connectionType === 'plug') {
      try {
        await window.ic.plug.disconnect();
        setIsConnected(false);
        setConnectionType('');
        for (const token of tokens) {
          token.logout();
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    handleLogout();
    setLoading(true);
    try {
      const connected = await checkConnection();
      if (!connected) {
        const pubkey = await window.ic.plug.requestConnect({
          // whitelist: [bobCanisterID, reBobCanisterID],
          whitelist: tokens.map((token) => token.canisterId),
          host:
            process.env.DFX_NETWORK === 'local'
              ? 'http://127.0.0.1:4943'
              : 'https://ic0.app',
          onConnectionUpdate: async () => {
            console.log('Plug connection updated');
            checkConnection();
          },
        });
        if (process.env.DFX_NETWORK === 'local') {
          await window.ic.plug.sessionManager.sessionData.agent.agent.fetchRootKey();
        }
        console.log('Connected with pubkey:', pubkey);
        setIsConnected(true);
        setConnectionType('plug');
      } else {
        if (process.env.DFX_NETWORK === 'local') {
          await window.ic.plug.sessionManager.sessionData.agent.agent.fetchRootKey();
        }
        setIsConnected(true);
        setConnectionType('plug');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsConnected(false);
      setConnectionType('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div>
      {!isConnected ? (
        <>
          <div className="card">
            <button
              className="bobButton"
              onClick={handleLogin}
              disabled={loading}
            >
              Login with Plug
            </button>
          </div>
        </>
      ) : connectionType === 'plug' ? (
        <>
          <p>
            Your plug principal is
            <br />
            {loggedInPrincipal}
          </p>
          <button
            className="bobButton"
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PlugLoginHandler;
