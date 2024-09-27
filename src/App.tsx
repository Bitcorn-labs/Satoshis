import './App.css';
import React, { useState, useEffect, ReactElement } from 'react';
// import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import { Principal } from '@dfinity/principal';
// import {Agent, Actor, HttpAgent} from '@dfinity/agent';
import ic from 'ic0';

import { idlFactory as icpFactory } from './declarations/nns-ledger';
import { _SERVICE as bobService } from './declarations/nns-ledger/index.d';

import { idlFactory as reBobFactory } from './declarations/backend';
import { _SERVICE as reBobService } from './declarations/service_hack/service'; // changed to service.d because dfx generate would remove the export line from index.d
import { Stats } from './declarations/backend/backend.did.d';
import { CircularProgress, TextField } from '@mui/material';
import ReBobMintingField from './components/ReBobMintingField';
import ShowTransactionStatus from './components/ShowTransactionStatus';
import BobWithdrawField from './components/BobWithdrawField';

import bigintToFloatString from './bigIntToFloatString';
import GroupPhoto from './components/GroupPhoto';

const bobCanisterID =
  window.location.href.includes('localhost') ||
  window.location.href.includes('127.0.0.1')
    ? 'bd3sg-teaaa-aaaaa-qaaba-cai'
    : 'zfcdd-tqaaa-aaaaq-aaaga-cai';
const reBobCanisterID =
  window.location.href.includes('localhost') ||
  window.location.href.includes('127.0.0.1')
    ? 'bkyz2-fmaaa-aaaaa-qaaaq-cai'
    : 'hjfd4-eqaaa-aaaam-adkmq-cai';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [icpBalance, setIcpBalance] = useState<bigint>(0n);
  const [bobLedgerBalance, setBobLedgerBalance] = useState<bigint>(0n);
  const [reBobLedgerBalance, setreBobLedgerBalance] = useState<bigint>(0n);

  const [bobLedgerAllowance, setBobLedgerAllowance] = useState<bigint>(0n);
  const [reBobLedgerAllowance, setReBobLedgerAllowance] = useState<bigint>(0n);

  const [share, setShare] = useState<bigint>(0n);
  const [stats, setStats] = useState<Stats | null>(null);

  const [reBobActor, setreBobActor] = useState<reBobService | null>(null);
  const [reBobActorTemp, setreBobActorTemp] = useState<reBobService | null>(
    null
  );
  const [bobLedgerActor, setBobLedgerActor] = useState<bobService | null>(null);
  const [yourPrincipal, setYourPrincipal] = useState<string>('null');

  const [totalBobHeld, setTotalBobHeld] = useState<string>('');
  const [totalReBobMinted, setTotalReBobMinted] = useState<string>('');

  const bobFee: bigint = 1_000_000n;
  const reBobFee: bigint = 10_000n;

  const checkLoggedIn = async () => {
    await setIsConnected(!!(await window.ic.plug.isConnected()));
  };

  const fetchTotalTokens = async () => {
    // const totalBobHeldResponse = await bobLedgerActor.icrc1_balance_of({
    //   owner: Principal.fromText(reBobCanisterID),
    //   subaccount: [],
    // }); // Can't use plug actors as anonymous.

    // We will use the internet identity anonymous calls in the next update. ic0 will work for now.
    const bobIcActor = await ic('zfcdd-tqaaa-aaaaq-aaaga-cai'); // hard coding this because it will work in local still.

    const totalBobHeldResponse = await bobIcActor.call('icrc1_balance_of', {
      owner: Principal.fromText('hjfd4-eqaaa-aaaam-adkmq-cai'), // hard coding this because it won't work with local of reBobCanisterID
      subaccount: [],
    });

    //const totalReBobMintedResponse = await reBobActor.icrc1_total_supply();

    setTotalBobHeld(bigintToFloatString(totalBobHeldResponse, 8));
    //setTotalReBobMinted(bigintToFloatString(totalReBobMintedResponse));
  };

  const cleanUp = () => {
    setLoading(false);
    if (bobLedgerActor && reBobActor) {
      fetchBalances();
      fetchStats();
    } else {
      console.error('Actors were not loaded when trying to cleanup!');
    }
  };

  useEffect(() => {
    console.log('Component mounted, waiting for user to log in...');
    fetchTotalTokens();
    checkLoggedIn();

    //setUpActors(); // can't use plug actors as anonymous?
    //console.log("first time", isConnected);
    //checkConnection();
  }, []); // Dependency array remains empty if you only want this effect to run once on component mount

  useEffect(() => {
    // This code runs after `icpActor` and `icdvActor` have been updated.
    console.log('actors updated', bobLedgerActor, reBobActor);

    fetchBalances();
    //fetchMinters();
    // Note: If `fetchBalances` depends on `icpActor` or `icdvActor`, you should ensure it's capable of handling null values or wait until these values are not null.
  }, [bobLedgerActor, reBobActor]);

  useEffect(() => {
    // This code runs after `icpActor` and `icdvActor` have been updated.
    //console.log("actors updated", icpActor, bobActor, bobLedgerActor, reBobActor);

    fetchStats();
    //fetchMinters();
    // Note: If `fetchBalances` depends on `icpActor` or `icdvActor`, you should ensure it's capable of handling null values or wait until these values are not null.
  }, [reBobActorTemp]);

  useEffect(() => {
    // This code runs after `icpActor` and `icdvActor` have been updated.
    if (isConnected) {
      fetchPrincipal();
      // Ensure fetchBalances is defined and correctly handles asynchronous operations
      setUpActors();
    }

    console.log('isConnected', isConnected);

    // Note: If `fetchBalances` depends on `icpActor` or `icdvActor`, you should ensure it's capable of handling null values or wait until these values are not null.
  }, [isConnected]);

  const fetchPrincipal = async () => {
    if (!(await window.ic.plug.agent)) return;
    setYourPrincipal((await window.ic.plug.agent.getPrincipal()).toString());
  };

  const fetchStats = async () => {
    if (reBobActorTemp != null) {
      const stats = await reBobActorTemp.stats();
      console.log({ stats });
      await setStats(stats);
    }
  };

  const setUpActors = async () => {
    console.log('Setting up actors...', bobCanisterID, reBobCanisterID);

    const getreBobActor = await window.ic.plug.createActor({
      canisterId: reBobCanisterID,
      interfaceFactory: reBobFactory,
    });

    await setreBobActor(getreBobActor);

    await setBobLedgerActor(
      await window.ic.plug.createActor({
        canisterId: bobCanisterID,
        interfaceFactory: icpFactory,
      })
    );

    console.log('actors', bobLedgerActor);
  };

  const getBobLedgerBalance = async () => {
    if (bobLedgerActor === null) return;

    const bobLedgerBalanceResponse = await bobLedgerActor.icrc1_balance_of({
      owner: await window.ic.plug.agent.getPrincipal(),
      subaccount: [],
    });

    console.log('Fetching balances...', { bobLedgerBalanceResponse });

    setBobLedgerBalance(bobLedgerBalanceResponse);
  };

  const getReBobLedgerBalance = async () => {
    if (reBobActor === null) return;
    const reBobLedgerBalanceResponse = await reBobActor.icrc1_balance_of({
      owner: await window.ic.plug.agent.getPrincipal(),
      subaccount: [],
    });

    setreBobLedgerBalance(reBobLedgerBalanceResponse);

    console.log('Fetching balances...', { reBobLedgerBalanceResponse });
  };

  const getBobLedgerAllowance = async () => {
    if (bobLedgerActor === null) return;
    const bobLedgerAllowanceResponse = await bobLedgerActor.icrc2_allowance({
      account: {
        owner: await window.ic.plug.agent.getPrincipal(),
        subaccount: [],
      },
      spender: { owner: Principal.fromText(reBobCanisterID), subaccount: [] },
    });

    setBobLedgerAllowance(bobLedgerAllowanceResponse.allowance);

    console.log(
      'Fetching balances... (bobLedgerAllowanceResponse)',
      bobLedgerAllowanceResponse.allowance
    ); // Need to add check if response was good.
  };

  const getReBobLedgerAllowance = async () => {
    if (reBobActor === null) return;
    const reBobLedgerAllowanceResponse = await reBobActor.icrc2_allowance({
      account: {
        owner: await window.ic.plug.agent.getPrincipal(),
        subaccount: [],
      },
      spender: { owner: Principal.fromText(reBobCanisterID), subaccount: [] },
    });

    setReBobLedgerAllowance(reBobLedgerAllowanceResponse.allowance); // Need to add check if response was good.

    console.log(
      'Fetching balances... (reBobLedgerAllowanceResponse)',
      reBobLedgerAllowanceResponse.allowance
    );
  };

  const fetchBalances = async () => {
    //
    // You'd need to replace this with actual logic to instantiate your actors and fetch balances
    // This is a placeholder for actor creation and balance fetching

    fetchTotalTokens();

    if (!isConnected) return;

    console.log('Fetching balances...', bobLedgerActor, reBobActor);
    if (bobLedgerActor === null || reBobActor === null) return;
    // Fetch balances (assuming these functions return balances in a suitable format)

    getBobLedgerBalance();
    getReBobLedgerBalance();
    getBobLedgerAllowance();
    getReBobLedgerAllowance();
  };

  const handleLogout = async () => {
    setLoading(true);

    if (isConnected) {
      try {
        await window.ic.plug.disconnect();
        setIsConnected(false);
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
      const connected = await window.ic.plug.isConnected();
      if (!connected) {
        const pubkey = await window.ic.plug.requestConnect({
          // whitelist, host, and onConnectionUpdate need to be defined or imported appropriately
          whitelist: [bobCanisterID, reBobCanisterID],
          host:
            window.location.href.includes('localhost') ||
            window.location.href.includes('127.0.0.1')
              ? 'http://127.0.0.1:4943'
              : 'https://ic0.app',
          onConnectionUpdate: async () => {
            console.log(
              'Connection updated',
              await window.ic.plug.isConnected()
            );
            await setIsConnected(!!(await window.ic.plug.isConnected()));
          },
        });
        if (
          window.location.href.includes('localhost') ||
          window.location.href.includes('127.0.0.1')
        ) {
          await window.ic.plug.sessionManager.sessionData.agent.agent.fetchRootKey();
        }
        console.log('Connected with pubkey:', pubkey);
        await setIsConnected(true);
      } else {
        if (
          window.location.href.includes('localhost') ||
          window.location.href.includes('127.0.0.1')
        ) {
          await window.ic.plug.sessionManager.sessionData.agent.agent.fetchRootKey();
        }
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
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
