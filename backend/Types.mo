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
    dpw_fee_d12 : Balance;
    dkp_swap_fee_d8 : Balance;
    d8_to_d12 : Int;
    conversion_factor : Nat;
  };
};
