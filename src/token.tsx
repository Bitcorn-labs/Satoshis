import { Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as icpFactory } from './declarations/nns-ledger';
import { _SERVICE as bobService } from './declarations/nns-ledger/index.d';
import { _SERVICE as reBobService } from './declarations/service_hack/service';

class token {
  public actor: bobService | reBobService | null;
  public fee: bigint;
  public ticker: string;
  public decimals: number;
  public ledgerBalance: bigint;

  constructor(
    actor: bobService | reBobService | null,
    fee: bigint,
    ticker: string,
    decimals: number,
    ledgerBalance: bigint
  ) {
    this.actor = actor;
    this.fee = fee;
    this.ticker = ticker;
    this.decimals = decimals;
    this.ledgerBalance = ledgerBalance;
  }

  // Method to transfer tokens
  async transfer(amount: bigint, to: string): Promise<boolean> {
    // Implement transfer logic here
    return true; // Replace with actual implementation
  }

  // Method to get the ledger balance
  async getLedgerBalance(owner: string): Promise<bigint | null> {
    if (this.actor === null) return null;

    const response = await this.actor.icrc1_balance_of({
      owner: Principal.fromText(owner),
      subaccount: [],
    });

    console.log('Fetching balances...', { response });
    this.ledgerBalance = response; // Update the balance in the instance
    return response;
  }

  // Method to set up the actor
  async setActor(
    canisterId: string,
    method: 'plug' | 'ii',
    agent?: any
  ): Promise<void> {
    if (method === 'plug') {
      this.actor = await window.ic.plug.createActor({
        canisterId,
        interfaceFactory: icpFactory, // Assuming icpFactory is imported correctly
      });
    } else if (method === 'ii' && agent) {
      this.actor = await Actor.createActor(icpFactory, {
        agent,
        canisterId,
      });
    }
  }
}

export default token;
