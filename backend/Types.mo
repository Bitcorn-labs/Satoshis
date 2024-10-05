import ICPTypes "ICPTypes";

module {
  public type MintFromICPArgs = {
    source_subaccount : ?[Nat8];
    target : ?ICPTypes.Account;
    amount : Nat;
  };

  public type Balance = Nat;

  public type Settings = {
    dkp_fee_d8 : Balance;
    dkp_fee_d12 : Balance;
    dpw_fee_d8 : Balance;
    dpw_fee_d12 : Balance;
    d8_to_d12 : Int;
    d12_to_d8 : Int;
    dkp_min_amount_d8 : Balance;
    dpw_min_amount_d12 : Balance;
    conversion_factor : Nat;
  };
};
