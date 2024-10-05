import './App.css';
import { useState, useEffect } from 'react';
// import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import { Principal } from '@dfinity/principal';
// import {Agent, Actor, HttpAgent} from '@dfinity/agent';
import ic from 'ic0';

import { idlFactory as icpFactory } from './declarations/nns-ledger';
import { _SERVICE as bobService } from './declarations/nns-ledger/index.d';

import { idlFactory as reBobFactory } from './declarations/backend';
import { _SERVICE as reBobService } from './declarations/service_hack/service'; // changed to service.d because dfx generate would remove the export line from index.d
import { Stats } from './declarations/backend/backend.did.d';

import bigintToFloatString from './bigIntToFloatString';
import PlugLoginHandler from './components/PlugLoginHandler';
import InternetIdentityLoginHandler from './components/InternetIdentityLoginHandler';
import TokenManagement from './components/TokenManagement';
import GroupPhoto from './components/GroupPhoto';
import TokenObject from './TokenObject';
import BackendMintingField from './components/BackendMintingField';

const bobCanisterID =
  process.env.DFX_NETWORK === 'local'
    ? 'bd3sg-teaaa-aaaaa-qaaba-cai'
    : '7pail-xaaaa-aaaas-aabmq-cai';
const reBobCanisterID =
  process.env.DFX_NETWORK === 'local'
    ? 'bkyz2-fmaaa-aaaaa-qaaaq-cai'
    : 'qvwlv-uyaaa-aaaas-aidpq-cai';

function App() {
  const [loading, setLoading] = useState(false);
  // const [icpBalance, setIcpBalance] = useState<bigint>(0n);
  const [bobLedgerBalance, setBobLedgerBalance] = useState<bigint>(0n);
  const [reBobLedgerBalance, setreBobLedgerBalance] = useState<bigint>(0n);

  const [bobLedgerAllowance, setBobLedgerAllowance] = useState<bigint>(0n);
  const [reBobLedgerAllowance, setReBobLedgerAllowance] = useState<bigint>(0n);

  const [share, setShare] = useState<bigint>(0n);
  const [stats, setStats] = useState<Stats | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionType, setConnectionType] = useState<string>('');

  const [reBobActor, setreBobActor] = useState<reBobService | null>(null);
  // const [reBobActorTemp, setreBobActorTemp] = useState<reBobService | null>(
  //   null
  // );
  const [bobLedgerActor, setBobLedgerActor] = useState<bobService | null>(null);

  const [totalBobHeld, setTotalBobHeld] = useState<string>('');
  const [totalReBobMinted, setTotalReBobMinted] = useState<string>('');

  const [loggedInPrincipal, setLoggedInPrincipal] = useState('');

  const dkpTokenDetails = {
    fee: 100_000n,
    ticker: 'dkp',
    decimals: 8,
    canisterId:
      process.env.DFX_NETWORK === 'local'
        ? 'bd3sg-teaaa-aaaaa-qaaba-cai'
        : 'zfcdd-tqaaa-aaaaq-aaaga-cai',
  };

  const dpwTokenDetails = {
    fee: 1250n,
    ticker: 'dpw',
    decimals: 12,
    canisterId:
      process.env.DFX_NETWORK === 'local'
        ? 'bkyz2-fmaaa-aaaaa-qaaaq-cai'
        : 'hjfd4-eqaaa-aaaam-adkmq-cai',
  };

  const [dkpTokenObject, setDkpTokenObject] = useState<TokenObject>(
    new TokenObject({
      ...dkpTokenDetails,
      actor: null,
      ledgerBalance: 0n,
      setToken: null,
      loggedInPrincipal: '',
    })
  );

  const [dpwTokenObject, setDpwTokenObject] = useState<TokenObject>(
    new TokenObject({
      ...dpwTokenDetails,
      actor: null,
      ledgerBalance: 0n,
      setToken: null,
      loggedInPrincipal: '',
    })
  );

  //const bobFee: bigint = 1_000_000n;
  //const reBobFee: bigint = 10_000n;

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

  const cleanUp = () => {
    setLoading(false);
    if (bobLedgerActor && reBobActor) {
      fetchBalances();
      //fetchStats();
    } else {
      console.error('Actors were not loaded when trying to cleanup!');
    }
  };

  useEffect(() => {
    //console.log('Component mounted, waiting for user to log in...');
    fetchTotalTokens();
    // checkLoggedIn();
    console.log(process.env.DFX_NETWORK);

    setDkpTokenObject(
      new TokenObject({
        ...dkpTokenDetails,
        actor: null,
        ledgerBalance: 0n,
        setToken: setDkpTokenObject,
        loggedInPrincipal: '',
      })
    );

    setDpwTokenObject(
      new TokenObject({
        ...dpwTokenDetails,
        actor: null,
        ledgerBalance: 0n,
        setToken: setDpwTokenObject,
        loggedInPrincipal: '',
      })
    );

    //setUpActors(); // can't use plug actors as anonymous?
    //console.log("first time", isConnected);
    //checkConnection();
  }, []); // Dependency array remains empty if you only want this effect to run once on component mount

  useEffect(() => {
    // This code runs after `icpActor` and `icdvActor` have been updated.
    //console.log('actors updated', bobLedgerActor, reBobActor);

    fetchBalances();
    //fetchMinters();
    // Note: If `fetchBalances` depends on `icpActor` or `icdvActor`, you should ensure it's capable of handling null values or wait until these values are not null.
  }, [bobLedgerActor, reBobActor]);

  // useEffect(() => {
  //   // This code runs after `icpActor` and `icdvActor` have been updated.
  //   //console.log("actors updated", icpActor, bobActor, bobLedgerActor, reBobActor);

  //   fetchStats();
  //   //fetchMinters();
  //   // Note: If `fetchBalances` depends on `icpActor` or `icdvActor`, you should ensure it's capable of handling null values or wait until these values are not null.
  // }, [reBobActorTemp]);

  // const fetchStats = async () => {
  //   if (reBobActorTemp != null) {
  //     const stats = await reBobActorTemp.stats();
  //     console.log({ stats });
  //     await setStats(stats);
  //   }
  // };

  const isValidPrincipal = (principalString: string): boolean => {
    try {
      Principal.fromText(principalString);
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchBalances = async () => {
    //
    // You'd need to replace this with actual logic to instantiate your actors and fetch balances
    // This is a placeholder for actor creation and balance fetching

    fetchTotalTokens();

    //if (!isConnected) return;

    // console.log('Fetching balances...', bobLedgerActor, reBobActor);
    //if (bobLedgerActor === null || reBobActor === null) return;
    // Fetch balances (assuming these functions return balances in a suitable format)

    // getBobLedgerBalance();
    //dkpTokenObject.getLedgerBalance(loggedInPrincipal, setDkpTokenObject);
    //dpwTokenObject.getLedgerBalance(loggedInPrincipal, setDpwTokenObject);

    // getReBobLedgerBalance();
    // getBobLedgerAllowance();
    // getReBobLedgerAllowance();
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
        tokens={[dkpTokenObject, dpwTokenObject]}
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
        tokens={[dkpTokenObject, dpwTokenObject]}
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
          console.log(dkpTokenObject);

          dkpTokenObject.getLedgerBalance();
          dpwTokenObject.getLedgerBalance();
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
            <h2>reHASH Bobs:</h2>
            <h3>{`$${dkpTokenObject.ticker} Balance: ${bigintToFloatString(
              dkpTokenObject.ledgerBalance,
              dkpTokenObject.decimals
            )}`}</h3>
            <BackendMintingField
              inputToken={dkpTokenObject}
              outputToken={dpwTokenObject}
              loading={loading}
              setLoading={setLoading}
              isConnected={isConnected}
              // cleanUp={cleanUp}
              minimumTransactionAmount={3000000n}
            />

            <p></p>
          </div>
          {/* <div
              style={{
                border: '3px solid lightgrey',
                padding: '10px',
                width: '100%',
                marginTop: '16px',
              }}
            >
              <h2>unHASH reBobs: </h2>
              <h3>
                $reBob Balance: {bigintToFloatString(reBobLedgerBalance, 6)}
              </h3>
              <BobWithdrawField
                loading={loading}
                setLoading={setLoading}
                reBobLedgerBalance={reBobLedgerBalance}
                reBobFee={reBobFee}
                bobFee={bobFee}
                isConnected={isConnected}
                reBobActor={reBobActor}
                reBobCanisterID={reBobCanisterID}
                cleanUp={cleanUp}
              />
            </div> */}
          <TokenManagement
            loading={loading}
            setLoading={setLoading}
            tokens={[dkpTokenObject, dpwTokenObject]}
            cleanUp={cleanUp}
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
