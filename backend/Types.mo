import ICPTypes "ICPTypes";

module {
  public type MintFromICPArgs = {
    source_subaccount : ?[Nat8];
    target : ?ICPTypes.Account;
    amount : Nat;
  };

  public type Balance = Nat;

  public type Settings = {
    btc_fee_d8 : Balance;
    sats_fee_d8 : Balance;
    btc_swap_fee_d8 : Balance;
    conversion_factor : Nat;
  };
};
