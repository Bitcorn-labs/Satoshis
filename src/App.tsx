import './App.css';
import { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import ic from 'ic0';
import { Stats } from './declarations/backend/backend.did.d';

import bigintToFloatString from './bigIntToFloatString';
import PlugLoginHandler from './components/PlugLoginHandler';
import InternetIdentityLoginHandler from './components/InternetIdentityLoginHandler';
import TokenManagement from './components/TokenManagement';
import GroupPhoto from './components/GroupPhoto';
import TokenObject from './TokenObject';
import BackendMintingField from './components/BackendMintingField';
import BackendWithdrawField from './components/BackendWithdrawField';

function App() {
  const [loading, setLoading] = useState(false);
  // const [icpBalance, setIcpBalance] = useState<bigint>(0n);

  const [bobLedgerAllowance, setBobLedgerAllowance] = useState<bigint>(0n);
  const [reBobLedgerAllowance, setReBobLedgerAllowance] = useState<bigint>(0n);

  const [share, setShare] = useState<bigint>(0n);
  const [stats, setStats] = useState<Stats | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionType, setConnectionType] = useState<string>('');

  const [totalBobHeld, setTotalBobHeld] = useState<string>('');
  const [totalReBobMinted, setTotalReBobMinted] = useState<string>('');

  const [loggedInPrincipal, setLoggedInPrincipal] = useState('');

  const inputTokenDetails = {
    fee: 100_000n,
    ticker: 'dkp',
    decimals: 8,
    canisterId:
      process.env.DFX_NETWORK === 'local'
        ? 'bd3sg-teaaa-aaaaa-qaaba-cai'
        : 'zfcdd-tqaaa-aaaaq-aaaga-cai',
  };

  const outputTokenDetails = {
    fee: 1250n,
    ticker: 'dpw',
    decimals: 12,
    canisterId:
      process.env.DFX_NETWORK === 'local'
        ? 'bkyz2-fmaaa-aaaaa-qaaaq-cai'
        : 'hjfd4-eqaaa-aaaam-adkmq-cai',
  };

  const [inputTokenObject, setInputTokenObject] = useState<TokenObject>(
    new TokenObject({
      ...inputTokenDetails,
      actor: null,
      ledgerBalance: 0n,
      setToken: null,
      loggedInPrincipal: '',
    })
  );

  const [outputTokenObject, setOutputTokenObject] = useState<TokenObject>(
    new TokenObject({
      ...outputTokenDetails,
      actor: null,
      ledgerBalance: 0n,
      setToken: null,
      loggedInPrincipal: '',
    })
  );

  const fetchTotalTokens = async () => {
    // const totalBobHeldResponse = await bobLedgerActor.icrc1_balance_of({
    //   owner: Principal.fromText(reBobCanisterID),
    //   subaccount: [],
    // }); // Can't use plug actors as anonymous.
    // We will use the internet identity anonymous calls in the next update. ic0 will work for now.
    //const bobIcActor = await ic('7pail-xaaaa-aaaas-aabmq-cai'); // hard coding this because it will work in local still.
    // const totalBobHeldResponse = await bobIcActor.call('icrc1_balance_of', {
    //   owner: Principal.fromText('qvwlv-uyaaa-aaaas-aidpq-cai'), // hard coding this because it won't work with local of reBobCanisterID
    //   subaccount: [],
    // });
    // //const totalReBobMintedResponse = await reBobActor.icrc1_total_supply();
    // setTotalBobHeld(bigintToFloatString(totalBobHeldResponse, 8));
    //setTotalReBobMinted(bigintToFloatString(totalReBobMintedResponse));
  };

  useEffect(() => {
    fetchTotalTokens();

    setInputTokenObject(
      new TokenObject({
        ...inputTokenDetails,
        actor: null,
        ledgerBalance: 0n,
        setToken: setInputTokenObject,
        loggedInPrincipal: '',
      })
    );

    setOutputTokenObject(
      new TokenObject({
        ...outputTokenDetails,
        actor: null,
        ledgerBalance: 0n,
        setToken: setOutputTokenObject,
        loggedInPrincipal: '',
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

  const isValidPrincipal = (principalString: string): boolean => {
    try {
      Principal.fromText(principalString);
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchBalances = async () => {
    fetchTotalTokens();

    if (!isConnected) return;
    inputTokenObject.getLedgerBalance();
    outputTokenObject.getLedgerBalance();
  };

  return (
    <div className="App" style={{ maxWidth: '600px' }}>
      <header>
        <h1>DRAGGIN KARMA POINTS</h1>
        <h1>Paladin Wizard Society</h1>
        <h2>
          Use your karma points to unleash your inner Dragon Paladin Wizard
        </h2>
      </header>
      <div className="container">
        <div className="image-box">
          <img src="./assets/Paladin.jpg" alt="Paladin" />
          <p>Brave Paladin</p>
        </div>
        <div className="image-box">
          <img src="./assets/Borovan.jpg" alt="Dragon" />
          <p>Dragon king</p>
        </div>
        <div className="image-box">
          <img src="./assets/Priests.jpg" alt="Wizard" />
          <p>protect your eggs</p>
        </div>
        <div className="image-box">
          <img src="./assets/Eggs.jpg" alt="Egg" />
          <p>draggin karma eggs</p>
        </div>
      </div>
      <div className="banner">Dragon Paladin Wizards</div>
      {/* <!--------------------------------ACTION--> */}
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
      <button
        onClick={() => {
          console.log(inputTokenObject);

          inputTokenObject.getLedgerBalance();
          outputTokenObject.getLedgerBalance();
        }}
      >
        clickme
      </button>
      {isConnected ? (
        <>
          <div
            style={{
              border: '3px solid lightgrey',
              padding: '10px',
              width: '100%',
            }}
          >
            <h2>{`Convert ${inputTokenObject.ticker}:`}</h2>
            <h3>{`$${inputTokenObject.ticker} Balance: ${bigintToFloatString(
              inputTokenObject.ledgerBalance,
              inputTokenObject.decimals
            )}`}</h3>
            <BackendMintingField
              inputToken={inputTokenObject}
              outputToken={outputTokenObject}
              loading={loading}
              setLoading={setLoading}
              isConnected={isConnected}
              // cleanUp={cleanUp}
              //minimumTransactionAmount={3000000n}
            />

            <p></p>
          </div>
          <div
            style={{
              border: '3px solid lightgrey',
              padding: '10px',
              width: '100%',
              marginTop: '16px',
            }}
          >
            <h2>{`Convert ${outputTokenObject.ticker}:`}</h2>
            <h3>
              {`$${outputTokenObject.ticker} Balance: `}
              {bigintToFloatString(
                outputTokenObject.ledgerBalance,
                outputTokenObject.decimals
              )}
            </h3>
            <BackendWithdrawField
              inputToken={inputTokenObject}
              outputToken={outputTokenObject}
              loading={loading}
              setLoading={setLoading}
              isConnected={isConnected}
            />
          </div>
          <TokenManagement
            loading={loading}
            setLoading={setLoading}
            tokens={[inputTokenObject, outputTokenObject]}
            loggedInPrincipal={loggedInPrincipal}
            fetchBalances={fetchBalances}
          />
        </>
      ) : (
        <></>
      )}
      <div className="egg-section">
        <h2>use karma points</h2>
        <p>
          You've sent <span id="eggsSent">0</span> dragon karma to this world.
          How much more will you send?
        </p>
        <button id="sendEggButton">deposit dkp in the dragons keep</button>
      </div>
      {/* <!--------------------------------ACTION--> */}
      <GroupPhoto />
      <p className="read-the-docs">
        Bitcorn Labs presents: Dragon Paladin Wizard
      </p>
    </div>
  );
}

export default App;
