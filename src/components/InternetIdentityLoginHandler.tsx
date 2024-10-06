import { useEffect, useRef, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import TokenObject from '../TokenObject';

interface InternetIdentityLoginHandlerProps {
  tokens: TokenObject[]; // Array of tokens
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  connectionType: string;
  setConnectionType: (value: string) => void;
  loggedInPrincipal: string;
  setLoggedInPrincipal: (value: string) => void;
}

const InternetIdentityLoginHandler: React.FC<
  InternetIdentityLoginHandlerProps
> = ({
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
  const authClientRef = useRef<AuthClient | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [buttonToggle, setButtonToggle] = useState(false);

  const [identityProvider, setIdentityProvider] = useState<URL | null>(null);

  const setupIdentityProvider = (option: number) => {
    //0 for ic0.app; 1 for internetcomputer.org
    if (process.env.DFX_NETWORK === 'local') {
      setIdentityProvider(
        new URL('http://br5f7-7uaaa-aaaaa-qaaca-cai.localhost:4943')
      );
      return;
    } else if (option === 0) {
      setIdentityProvider(new URL('https://identity.ic0.app/'));
    } else if (option === 1) {
      setIdentityProvider(new URL('https://identity.internetcomputer.org/'));
    }
  };

  const authClientLogin = async () => {
    if (!authClient || !identityProvider) return;

    return new Promise<void>((resolve, reject) => {
      authClient.login({
        identityProvider,
        onSuccess: () => {
          setIsConnected(true); // Set authentication state to true
          setConnectionType('ii');
          resolve(); // Resolve the promise on success
        },
        onError: (error) => {
          console.error('Login failed:', error);
          reject(error); // Reject the promise on error
        },
      });
    });
  };

  const login = async () => {
    setLoading(true);
    await authClientLogin();
    setupLoggedInVars();

    setLoading(false);
  };

  const setupLoggedInVars = async () => {
    if (!authClient) return;

    const identity = authClient.getIdentity();

    const myPrincipal = identity.getPrincipal().toString();

    console.log(myPrincipal);

    setLoggedInPrincipal(myPrincipal); // is this necessary anymore?
    for (const token of tokens) {
      token.setLoggedInPrincipal(myPrincipal);
    }
    setIsConnected(true);
    setConnectionType('ii');
    await createAgent();
  };

  useEffect(() => {
    if (!identityProvider || !authClient) return;

    login();
  }, [identityProvider]);

  const createAuthClient = async (): Promise<void> => {
    setAuthClient(await AuthClient.create());
  };

  useEffect(() => {
    createAuthClient(); //Need to check if already logged in on refresh!
  }, []);

  const checkLoggedIn = async () => {
    if (!isConnected || connectionType !== 'ii') return;
    if (!authClient) return;

    const authenticated = await authClient.isAuthenticated();
    if (authenticated) setupLoggedInVars();
  };

  useEffect(() => {
    if (!authClient) return;

    checkLoggedIn();
  }, [authClient]);

  const logout = async () => {
    if (!authClient) return;
    if (authClient) {
      await authClient.logout();
      setIsConnected(false);
      setConnectionType('');
      setLoggedInPrincipal('');
      for (const token of tokens) {
        token.logout();
      }
      setIdentityProvider(null);
    }
  };

  const createAgent = async () => {
    if (!authClient) {
      console.error('authClientRef was null in createAgent()');
      return;
    }
    const identity = authClient.getIdentity();

    const agent = new HttpAgent({
      host:
        process.env.DFX_NETWORK === 'local'
          ? 'http://localhost:4943'
          : String(identityProvider) ===
            'https://identity.internetcomputer.org/'
          ? 'https://internetcomputer.org'
          : 'https://ic0.app/', // Will identityProvider work?
      identity: identity,
    });

    if (process.env.DFX_NETWORK === 'local') {
      await agent.fetchRootKey();
      console.log('aaa');
    }

    for (const token of tokens) {
      token.setActor('ii', agent);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <>
          {!buttonToggle ? (
            <button
              disabled={loading}
              onClick={() => {
                setButtonToggle(!buttonToggle);
              }}
            >
              Login with Internet Identity
            </button>
          ) : (
            <>
              <button
                disabled={loading}
                onClick={() => {
                  setupIdentityProvider(0);
                }}
              >
                ic0.app
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  setupIdentityProvider(1);
                }}
              >
                internetcomputer.org
              </button>
            </>
          )}
        </>
      ) : connectionType === 'ii' ? (
        <>
          <p>
            Your Internet Identity Principal is <br />
            {loggedInPrincipal}
          </p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default InternetIdentityLoginHandler;
