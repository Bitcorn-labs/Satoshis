import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import D "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Result "mo:base/Result";

import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Timer "mo:base/Timer";

import CertifiedData "mo:base/CertifiedData";
import Nat64 "mo:base/Nat64";
import CertTree "mo:cert/CertTree";

import ICRC1 "mo:icrc1-mo/ICRC1";
import Account "mo:icrc1-mo/ICRC1/Account";
import ICRC2 "mo:icrc2-mo/ICRC2";
import ICRC3 "mo:icrc3-mo/";
import ICRC4 "mo:icrc4-mo/ICRC4";

///ckBTC Token
import Types "Types";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import ICPTypes "ICPTypes";

//game variables
import Array "mo:base/Array";

shared ({ caller = _owner }) actor class Token(
  args : ?{
    icrc1 : ?ICRC1.InitArgs;
    icrc2 : ?ICRC2.InitArgs;
    icrc3 : ICRC3.InitArgs; //already typed nullable
    icrc4 : ?ICRC4.InitArgs;
  }
) = this {

  let Set = ICRC1.Set;
  let Map = ICRC1.Map;

  //let ICPLedger : ICPTypes.Service = actor ("ryjl3-tyaaa-aaaaa-aaaba-cai");
  let CKBTCLedger : ICPTypes.Service = actor ("mxzaz-hqaaa-aaaar-qaada-cai"); //ic0
  // let backendCanisterID : String = "hjfd4-eqaaa-aaaam-adkmq-cai"; // ic0
  // let CKBTCLedger : ICPTypes.Service = actor ("bd3sg-teaaa-aaaaa-qaaba-cai"); // local

  type Account = ICRC1.Account;

  let settings : Types.Settings = {
    btc_fee_d8 = 10;
    sats_fee_d8 = 10;
    btc_swap_fee_d8 = 10; // Fee of 10 ckBTC when swapping to SATS
    conversion_factor = 1_0000_0000; // 1 BTC = 100,000,000 SATS
  };

  let default_icrc1_args : ICRC1.InitArgs = {
    name = ?"Satoshi Division";
    symbol = ?"SATS";
    logo = ?"data:image/jpg;base64,NEEDNEWLOGO"; // Need a new logo...
    decimals = 8;
    fee = ? #Fixed(settings.sats_fee_d8);
    minting_account = ?{
      owner = _owner;
      subaccount = null;
    };
    max_supply = null;
    min_burn_amount = ?10;
    max_memo = ?32;
    advanced_settings = null;
    metadata = null;
    fee_collector = null;
    transaction_window = null;
    permitted_drift = null;
    max_accounts = ?100000000;
    settle_to_accounts = ?99999000;
  };

  let default_icrc2_args : ICRC2.InitArgs = {
    max_approvals_per_account = ?10000;
    max_allowance = ? #TotalSupply;
    fee = ? #ICRC1;
    advanced_settings = null;
    max_approvals = ?10000000;
    settle_to_approvals = ?9990000;
  };

  let default_icrc3_args : ICRC3.InitArgs = ?{
    maxActiveRecords = 3000;
    settleToRecords = 2000;
    maxRecordsInArchiveInstance = 100000000;
    maxArchivePages = 62500;
    archiveIndexType = #Stable;
    maxRecordsToArchive = 8000;
    archiveCycles = 6_000_000_000_000;
    archiveControllers = null; //??[put cycle ops prinicpal here];
    supportedBlocks = [
      {
        block_type = "1xfer";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      },
      {
        block_type = "2xfer";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      },
      {
        block_type = "2approve";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      },
      {
        block_type = "1mint";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      },
      {
        block_type = "1burn";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      },
    ];
  };

  let default_icrc4_args : ICRC4.InitArgs = {
    max_balances = ?200;
    max_transfers = ?200;
    fee = ? #ICRC1;
  };

  let icrc1_args : ICRC1.InitArgs = switch (args) {
    case (null) default_icrc1_args;
    case (?args) {
      switch (args.icrc1) {
        case (null) default_icrc1_args;
        case (?val) {
          {
            val with minting_account = switch (
              val.minting_account
            ) {
              case (?val) ?val;
              case (null) {
                ?{
                  owner = _owner;
                  subaccount = null;
                };
              };
            };
          };
        };
      };
    };
  };

  let icrc2_args : ICRC2.InitArgs = switch (args) {
    case (null) default_icrc2_args;
    case (?args) {
      switch (args.icrc2) {
        case (null) default_icrc2_args;
        case (?val) val;
      };
    };
  };

  let icrc3_args : ICRC3.InitArgs = switch (args) {
    case (null) default_icrc3_args;
    case (?args) {
      switch (args.icrc3) {
        case (null) default_icrc3_args;
        case (?val) ?val;
      };
    };
  };

  let icrc4_args : ICRC4.InitArgs = switch (args) {
    case (null) default_icrc4_args;
    case (?args) {
      switch (args.icrc4) {
        case (null) default_icrc4_args;
        case (?val) val;
      };
    };
  };

  stable let icrc1_migration_state = ICRC1.init(ICRC1.initialState(), #v0_1_0(#id), ?icrc1_args, _owner);
  stable let icrc2_migration_state = ICRC2.init(ICRC2.initialState(), #v0_1_0(#id), ?icrc2_args, _owner);
  stable let icrc4_migration_state = ICRC4.init(ICRC4.initialState(), #v0_1_0(#id), ?icrc4_args, _owner);
  stable let icrc3_migration_state = ICRC3.init(ICRC3.initialState(), #v0_1_0(#id), icrc3_args, _owner);
  stable let cert_store : CertTree.Store = CertTree.newStore();
  let ct = CertTree.Ops(cert_store);

  stable var owner = _owner;

  let #v0_1_0(#data(icrc1_state_current)) = icrc1_migration_state;

  private var _icrc1 : ?ICRC1.ICRC1 = null;

  private func get_icrc1_state() : ICRC1.CurrentState {
    return icrc1_state_current;
  };

  private func get_icrc1_environment() : ICRC1.Environment {
    {
      get_time = null;
      get_fee = null;
      add_ledger_transaction = ?icrc3().add_record;
      can_transfer = null; //set to a function to intercept and add validation logic for transfers
    };
  };

  func icrc1() : ICRC1.ICRC1 {
    switch (_icrc1) {
      case (null) {
        let initclass : ICRC1.ICRC1 = ICRC1.ICRC1(?icrc1_migration_state, Principal.fromActor(this), get_icrc1_environment());
        ignore initclass.register_supported_standards({
          name = "ICRC-3";
          url = "https://github.com/dfinity/ICRC/ICRCs/icrc-3/";
        });
        ignore initclass.register_supported_standards({
          name = "ICRC-10";
          url = "https://github.com/dfinity/ICRC/ICRCs/icrc-10/";
        });
        _icrc1 := ?initclass;
        initclass;
      };
      case (?val) val;
    };
  };

  let #v0_1_0(#data(icrc2_state_current)) = icrc2_migration_state;

  private var _icrc2 : ?ICRC2.ICRC2 = null;

  private func get_icrc2_state() : ICRC2.CurrentState {
    return icrc2_state_current;
  };

  private func get_icrc2_environment() : ICRC2.Environment {
    {
      icrc1 = icrc1();
      get_fee = null;
      can_approve = null; //set to a function to intercept and add validation logic for approvals
      can_transfer_from = null; //set to a function to intercept and add validation logic for transfer froms
    };
  };

  func icrc2() : ICRC2.ICRC2 {
    switch (_icrc2) {
      case (null) {
        let initclass : ICRC2.ICRC2 = ICRC2.ICRC2(?icrc2_migration_state, Principal.fromActor(this), get_icrc2_environment());
        _icrc2 := ?initclass;
        initclass;
      };
      case (?val) val;
    };
  };

  let #v0_1_0(#data(icrc4_state_current)) = icrc4_migration_state;

  private var _icrc4 : ?ICRC4.ICRC4 = null;

  private func get_icrc4_state() : ICRC4.CurrentState {
    return icrc4_state_current;
  };

  private func get_icrc4_environment() : ICRC4.Environment {
    {
      icrc1 = icrc1();
      get_fee = null;
      can_approve = null; //set to a function to intercept and add validation logic for approvals
      can_transfer_from = null; //set to a function to intercept and add validation logic for transfer froms
    };
  };

  func icrc4() : ICRC4.ICRC4 {
    switch (_icrc4) {
      case (null) {
        let initclass : ICRC4.ICRC4 = ICRC4.ICRC4(?icrc4_migration_state, Principal.fromActor(this), get_icrc4_environment());
        _icrc4 := ?initclass;
        initclass;
      };
      case (?val) val;
    };
  };

  let #v0_1_0(#data(icrc3_state_current)) = icrc3_migration_state;

  private var _icrc3 : ?ICRC3.ICRC3 = null;

  private func get_icrc3_state() : ICRC3.CurrentState {
    return icrc3_state_current;
  };

  func get_state() : ICRC3.CurrentState {
    return icrc3_state_current;
  };

  private func get_icrc3_environment() : ICRC3.Environment {
    ?{
      updated_certification = ?updated_certification;
      get_certificate_store = ?get_certificate_store;
    };
  };

  func ensure_block_types(icrc3Class : ICRC3.ICRC3) : () {
    let supportedBlocks = Buffer.fromIter<ICRC3.BlockType>(icrc3Class.supported_block_types().vals());

    let blockequal = func(a : { block_type : Text }, b : { block_type : Text }) : Bool {
      a.block_type == b.block_type;
    };

    if (Buffer.indexOf<ICRC3.BlockType>({ block_type = "1xfer"; url = "" }, supportedBlocks, blockequal) == null) {
      supportedBlocks.add({
        block_type = "1xfer";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      });
    };

    if (Buffer.indexOf<ICRC3.BlockType>({ block_type = "2xfer"; url = "" }, supportedBlocks, blockequal) == null) {
      supportedBlocks.add({
        block_type = "2xfer";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      });
    };

    if (Buffer.indexOf<ICRC3.BlockType>({ block_type = "2approve"; url = "" }, supportedBlocks, blockequal) == null) {
      supportedBlocks.add({
        block_type = "2approve";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      });
    };

    if (Buffer.indexOf<ICRC3.BlockType>({ block_type = "1mint"; url = "" }, supportedBlocks, blockequal) == null) {
      supportedBlocks.add({
        block_type = "1mint";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      });
    };

    if (Buffer.indexOf<ICRC3.BlockType>({ block_type = "1burn"; url = "" }, supportedBlocks, blockequal) == null) {
      supportedBlocks.add({
        block_type = "1burn";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
      });
    };

    icrc3Class.update_supported_blocks(Buffer.toArray(supportedBlocks));
  };

  func icrc3() : ICRC3.ICRC3 {
    switch (_icrc3) {
      case (null) {
        let initclass : ICRC3.ICRC3 = ICRC3.ICRC3(?icrc3_migration_state, Principal.fromActor(this), get_icrc3_environment());
        _icrc3 := ?initclass;
        ensure_block_types(initclass);

        initclass;
      };
      case (?val) val;
    };
  };

  private func updated_certification(cert : Blob, lastIndex : Nat) : Bool {

    // D.print("updating the certification " # debug_show(CertifiedData.getCertificate(), ct.treeHash()));
    ct.setCertifiedData();
    // D.print("did the certification " # debug_show(CertifiedData.getCertificate()));
    return true;
  };

  private func get_certificate_store() : CertTree.Store {
    // D.print("returning cert store " # debug_show(cert_store));
    return cert_store;
  };

  /// Functions for the ICRC1 token standard
  public shared query func icrc1_name() : async Text {
    icrc1().name();
  };

  public shared query func icrc1_symbol() : async Text {
    icrc1().symbol();
  };

  public shared query func icrc1_decimals() : async Nat8 {
    icrc1().decimals();
  };

  public shared query func icrc1_fee() : async ICRC1.Balance {
    icrc1().fee();
  };

  public shared query func icrc1_metadata() : async [ICRC1.MetaDatum] {
    icrc1().metadata();
  };

  public shared query func icrc1_total_supply() : async ICRC1.Balance {
    icrc1().total_supply();
  };

  public shared query func icrc1_minting_account() : async ?ICRC1.Account {
    ?icrc1().minting_account();
  };

  public shared query func icrc1_balance_of(args : ICRC1.Account) : async ICRC1.Balance {
    icrc1().balance_of(args);
  };

  public shared query func icrc1_supported_standards() : async [ICRC1.SupportedStandard] {
    icrc1().supported_standards();
  };

  public shared query func icrc10_supported_standards() : async [ICRC1.SupportedStandard] {
    icrc1().supported_standards();
  };

  public shared ({ caller }) func icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult {
    switch (await* icrc1().transfer_tokens(caller, args, false, null)) {
      case (#trappable(val)) val;
      case (#awaited(val)) val;
      case (#err(#trappable(err))) D.trap(err);
      case (#err(#awaited(err))) D.trap(err);
    };
  };

  private func time64() : Nat64 {
    Nat64.fromNat(Int.abs(Time.now()));
  };

  // let ONE_DAY = 86_400_000_000_000;

  stable var lastError : (Text, Int) = ("null", 0);

  public query (msg) func getLastError() : async (Text, Int) {
    if (msg.caller != owner) {
      return ("Unauthorized", 0);
    };
    lastError;
  };

  private func refund(caller : Principal, subaccount : ?[Nat8], amount : Nat, e : Text) : async* Result.Result<(Nat, Nat), Text> {
    try {
      let result = await CKBTCLedger.icrc1_transfer({
        from_subaccount = null;
        fee = null;
        to = {
          owner = caller;
          subaccount = subaccount;
        };
        memo = ?Blob.toArray("\63\6b\42\54\43\20\72\65\74\75\72\6e" : Blob); // ckBTC return
        created_at_time = ?time64();
        amount = amount;
      });
    } catch (e) {
      return #err("stuck funds");
    };

    return #err("cannot transfer to minter " # e);
  };

  public shared ({ caller }) func deposit(subaccount : ?[Nat8], amount : Nat) : async Result.Result<(Nat, Nat), Text> {
    log.add(debug_show (Time.now()) # "trying deposit " # debug_show (subaccount));

    if (amount < settings.btc_fee_d8) {
      return #err("amount too low");
    };

    let result = try {
      await CKBTCLedger.icrc2_transfer_from({
        to = {
          owner = Principal.fromActor(this);
          subaccount = null;
        };
        fee = null;
        spender_subaccount = null;
        from = {
          owner = caller;
          subaccount = subaccount;
        };
        memo = ?Blob.toArray("\63\6b\42\54\43\20\64\65\70\6f\73\69\74" : Blob); // ckBTC deposit
        created_at_time = ?time64();
        amount = amount;
      });
    } catch (e) {
      log.add(debug_show (Time.now()) # "trying transfer from " # Error.message(e));
      D.trap("cannot transfer from failed" # Error.message(e));
    };

    let block = switch (result) {
      case (#Ok(block)) block;
      case (#Err(err)) {
        D.trap("cannot transfer from failed" # debug_show (err));
      };
    };

    //let mintingAmount = amount;
    let mintingAmount = Int.abs((amount - settings.btc_swap_fee_d8) * settings.conversion_factor);

    let newtokens = await* icrc1().mint_tokens(
      icrc1().get_state().minting_account.owner,
      {
        to = {
          owner = caller;
          subaccount = switch (subaccount) {
            case (null) null;
            case (?val) ?Blob.fromArray(val);
          };
        };
        amount = mintingAmount; // The number of tokens to mint.
        created_at_time = ?time64();
        memo = ?("\53\41\54\53\20\4d\69\6e\74" : Blob); // SATS Mint
      },
    );

    log.add(debug_show (Time.now()) # "trying mint from mint " # debug_show (newtokens));

    let mint = switch (newtokens) {
      case (#trappable(#Ok(val))) val;
      case (#awaited(#Ok(val))) val;
      case (#trappable(#Err(err))) {
        return await* refund(caller, subaccount, amount, debug_show (err));

      };
      case (#awaited(#Err(err))) {
        return await* refund(caller, subaccount, amount, debug_show (err));
      };
      case (#err(#trappable(err))) {
        return await* refund(caller, subaccount, amount, debug_show (err));
      };
      case (#err(#awaited(err))) {
        return await* refund(caller, subaccount, amount, debug_show (err));
      };
    };

    return #ok((block, mint));
  };

  public shared ({ caller }) func withdraw(subaccount : ?[Nat8], amount : Nat) : async Result.Result<(Nat, Nat), Text> {
    log.add(debug_show (Time.now()) # "trying withdraw " # debug_show (subaccount));

    if (amount <= (settings.btc_fee_d8 * 2)) {
      // Accounting for sending ckBTC to the user from this canister. We pay the fee.
      return #err("amount too low");
    };

    let burnResult = await* icrc1().burn(
      caller,
      {
        from_subaccount = switch (subaccount) {
          case (null) null;
          case (?val) ?Blob.fromArray(val);
        }; // The subaccount from which tokens are burned.
        amount = amount; // The number of tokens to burn.
        memo = ?("\53\41\54\53\20\57\69\74\68\64\72\61\77" : Blob); // SATS Withdraw
        created_at_time = ?time64(); // The time the burn operation was created.
      },
    );

    let parse = switch (burnResult) {
      case (#Ok(val)) val;
      case (#Err((err))) return #err(debug_show (err));
    };

    //let old_balance_d8 : T.Balance = Int.abs(old_balance_d12 / settings.d8_to_d12); // from sneed swap
    let returnAmount = Int.abs((amount - settings.btc_fee_d8) / settings.conversion_factor); // hope this work

    let result = try {
      await CKBTCLedger.icrc1_transfer({
        to = {
          owner = caller;
          subaccount = subaccount;
        };
        fee = null;
        from_subaccount = null;
        memo = ?Blob.toArray("\53\41\54\53\20\57\69\74\68\64\72\61\77"); // SATS Withdraw
        created_at_time = ?time64();
        amount = returnAmount;
      });
    } catch (e) {
      //put back

      let remintResult = await* icrc1().mint(
        caller,
        {
          to = {
            owner = caller;
            subaccount = switch (subaccount) {
              case (null) null;
              case (?val) ?Blob.fromArray(val);
            }; // The subaccount from which tokens are burned.
          };
          amount = amount; // The number of tokens to burn.
          memo = ?("\53\41\54\53\20\57\69\74\68\64\72\61\77" : Blob); // SATS Withdraw
          created_at_time = ?time64(); // The time the burn operation was created.
        },
      );
      log.add(debug_show (Time.now()) # "trying withdraw from " # Error.message(e));
      return #err("cannot withdraw - failed and refunded " # Error.message(e));
    };

    let block = switch (result) {
      case (#Ok(block)) block;
      case (#Err(err)) {
        let remintResult = await* icrc1().mint(
          caller,
          {
            to = {
              owner = caller;
              subaccount = switch (subaccount) {
                case (null) null;
                case (?val) ?Blob.fromArray(val);
              }; // The subaccount from which tokens are burned.
            };
            amount = amount; // The number of tokens to burn.
            memo = ?("\53\41\54\53\20\57\69\74\68\64\72\61\77" : Blob); // SATS Withdraw
            created_at_time = ?time64(); // The time the burn operation was created.
          },
        );
        log.add(debug_show (Time.now()) # "trying withdraw from " # debug_show (err));
        return #err("cannot withdraw - failed" # debug_show (err));
      };
    };

    return #ok((parse, block));
  };

  public type Stats = {
    totalSupply : Nat;
    holders : Nat;
  };

  public query func stats() : async Stats {
    return {
      totalSupply = icrc1().total_supply();
      holders = ICRC1.Map.size(icrc1().get_state().accounts);
    };
  };

  public query func holders(min : ?Nat, max : ?Nat, prev : ?ICRC1.Account, take : ?Nat) : async [(ICRC1.Account, Nat)] {

    let results = ICRC1.Vector.new<(ICRC1.Account, Nat)>();
    let (bFound_, targetAccount) = switch (prev) {
      case (null)(true, { owner = Principal.fromActor(this); subaccount = null });
      case (?val)(false, val);
    };

    var bFound : Bool = bFound_;

    let takeVal = switch (take) {
      case (null) 1000; //default take
      case (?val) val;
    };

    label search for (thisAccount in ICRC1.Map.entries(icrc1().get_state().accounts)) {
      if (bFound) {
        if (ICRC1.Vector.size(results) >= takeVal) {
          break search;
        };

      } else {
        if (ICRC1.account_eq(targetAccount, thisAccount.0)) {
          bFound := true;
        } else {
          continue search;
        };
      };
      let minSearch = switch (min) {
        case (null) 0;
        case (?val) val;
      };
      let maxSearch = switch (max) {
        case (null) 1_000_000_0000_0000_0000_0000; // 1 Million BTC max.
        case (?val) val;
      };
      if (thisAccount.1 >= minSearch and thisAccount.1 <= maxSearch) ICRC1.Vector.add(results, (thisAccount.0, thisAccount.1));
    };

    return ICRC1.Vector.toArray(results);
  };

  public query ({ caller }) func icrc2_allowance(args : ICRC2.AllowanceArgs) : async ICRC2.Allowance {
    return icrc2().allowance(args.spender, args.account, false);
  };

  public shared ({ caller }) func icrc2_approve(args : ICRC2.ApproveArgs) : async ICRC2.ApproveResponse {
    switch (await* icrc2().approve_transfers(caller, args, false, null)) {
      case (#trappable(val)) val;
      case (#awaited(val)) val;
      case (#err(#trappable(err))) D.trap(err);
      case (#err(#awaited(err))) D.trap(err);
    };
  };

  public shared ({ caller }) func icrc2_transfer_from(args : ICRC2.TransferFromArgs) : async ICRC2.TransferFromResponse {
    switch (await* icrc2().transfer_tokens_from(caller, args, null)) {
      case (#trappable(val)) val;
      case (#awaited(val)) val;
      case (#err(#trappable(err))) D.trap(err);
      case (#err(#awaited(err))) D.trap(err);
    };
  };

  public query func icrc3_get_blocks(args : ICRC3.GetBlocksArgs) : async ICRC3.GetBlocksResult {
    return icrc3().get_blocks(args);
  };

  public query func icrc3_get_archives(args : ICRC3.GetArchivesArgs) : async ICRC3.GetArchivesResult {
    return icrc3().get_archives(args);
  };

  public query func icrc3_get_tip_certificate() : async ?ICRC3.DataCertificate {
    return icrc3().get_tip_certificate();
  };

  public query func icrc3_supported_block_types() : async [ICRC3.BlockType] {
    return icrc3().supported_block_types();
  };

  public query func get_tip() : async ICRC3.Tip {
    return icrc3().get_tip();
  };

  public shared ({ caller }) func icrc4_transfer_batch(args : ICRC4.TransferBatchArgs) : async ICRC4.TransferBatchResults {
    switch (await* icrc4().transfer_batch_tokens(caller, args, null, null)) {
      case (#trappable(val)) val;
      case (#awaited(val)) val;
      case (#err(#trappable(err))) err;
      case (#err(#awaited(err))) err;
    };
  };

  public shared query func icrc4_balance_of_batch(request : ICRC4.BalanceQueryArgs) : async ICRC4.BalanceQueryResult {
    icrc4().balance_of_batch(request);
  };

  public shared query func icrc4_maximum_update_batch_size() : async ?Nat {
    ?icrc4().get_state().ledger_info.max_transfers;
  };

  public shared query func icrc4_maximum_query_batch_size() : async ?Nat {
    ?icrc4().get_state().ledger_info.max_balances;
  };

  public shared ({ caller }) func admin_update_owner(new_owner : Principal) : async Bool {
    if (caller != owner) { D.trap("Unauthorized") };
    owner := new_owner;
    return true;
  };

  public shared ({ caller }) func admin_update_icrc1(requests : [ICRC1.UpdateLedgerInfoRequest]) : async [Bool] {
    if (caller != owner) { D.trap("Unauthorized") };
    return icrc1().update_ledger_info(requests);
  };

  public shared ({ caller }) func admin_update_icrc2(requests : [ICRC2.UpdateLedgerInfoRequest]) : async [Bool] {
    if (caller != owner) { D.trap("Unauthorized") };
    return icrc2().update_ledger_info(requests);
  };

  public shared ({ caller }) func admin_update_icrc4(requests : [ICRC4.UpdateLedgerInfoRequest]) : async [Bool] {
    if (caller != owner) { D.trap("Unauthorized") };
    return icrc4().update_ledger_info(requests);
  };

  /* /// Uncomment this code to establish have icrc1 notify you when a transaction has occured.
  private func transfer_listener(trx: ICRC1.Transaction, trxid: Nat) : () {

  };

  /// Uncomment this code to establish have icrc1 notify you when a transaction has occured.
  private func approval_listener(trx: ICRC2.TokenApprovalNotification, trxid: Nat) : () {

  };

  /// Uncomment this code to establish have icrc1 notify you when a transaction has occured.
  private func transfer_from_listener(trx: ICRC2.TransferFromNotification, trxid: Nat) : () {

  }; */

  // private stable var _init = false;
  // public shared(msg) func admin_init() : async () {
  //   //can only be called once

  //   if(_init == false){
  //     //ensure metadata has been registered
  //     let test1 = icrc1().metadata();
  //     let test2 = icrc2().metadata();
  //     let test4 = icrc4().metadata();
  //     let test3 = icrc3().stats();

  //     //uncomment the following line to register the transfer_listener
  //     //icrc1().register_token_transferred_listener("my_namespace", transfer_listener);

  //     //uncomment the following line to register the transfer_listener
  //     //icrc2().register_token_approved_listener("my_namespace", approval_listener);

  //     //uncomment the following line to register the transfer_listener
  //     //icrc1().register_transfer_from_listener("my_namespace", transfer_from_listener);
  //   };
  //   _init := true;
  // };

  let log = Buffer.Buffer<Text>(1);

  public shared (msg) func clearLog() : async () {
    if (msg.caller != owner) {
      D.trap("Unauthorized");
    };
    log.clear();
  };

  public query (msg) func get_log() : async [Text] {
    Buffer.toArray(log);
  };

  // Deposit cycles into this canister.
  public shared func deposit_cycles() : async () {
    let amount = ExperimentalCycles.available();
    let accepted = ExperimentalCycles.accept<system>(amount);
    assert (accepted == amount);
  };

  public shared (msg) func init() : async () {
    if (Principal.fromActor(this) != msg.caller) {
      D.trap("Only the canister can initialize the canister");
    };
    log.add(debug_show (Time.now()) # "In init ");
    ignore icrc1().metadata();
    ignore icrc2().metadata();
    ignore icrc3().stats();
    ignore icrc4().metadata();
  };

  ignore Timer.setTimer<system>(
    #nanoseconds(0),
    func() : async () {
      let selfActor : actor {
        init : shared () -> async ();
      } = actor (Principal.toText(Principal.fromActor(this)));
      await selfActor.init();
    },
  );

  system func preupgrade() {
    stable_winners := winners;
  };

  system func postupgrade() {
    ignore icrc1().init_metadata();
    winners := stable_winners;
  };

  stable var stable_winners : [Principal] = [];

  var winners : [Principal] = [];

  public shared (msg) func setGameCompleted() : async () {
    if (msg.caller == Principal.fromText("2vxsx-fae")) return;

    let found : ?Principal = Array.find<Principal>(
      winners,
      func(p : Principal) : Bool {
        return p == msg.caller;
      },
    );

    if (found == null) {
      // Add caller to winners if not already present
      winners := Array.append<Principal>(winners, [msg.caller]);
    };
  };

  // public func deleteWinners() : async () {
  //   winners := [];
  // };

  public query func didPrincipalWin(principal : Principal) : async Bool {
    let found : ?Principal = Array.find<Principal>(
      winners,
      func(p : Principal) : Bool {
        return p == principal;
      },
    );
    return found != null;
  };

  //re wire up the listener after upgrade
  //uncomment the following line to register the transfer_listener
  //icrc1().register_token_transferred_listener("bobminter", transfer_listener);

  //uncomment the following line to register the transfer_listener
  //icrc2().register_token_approved_listener("my_namespace", approval_listener);

  //uncomment the following line to register the transfer_listener
  //icrc1().register_transfer_from_listener("my_namespace", transfer_from_listener);
};
