#!/bin/bash

# Source the environment variables from the .env file
if [ -f .env ]; then
  source .env
else
  echo ".env file not found! Please create it with the necessary variables."
  exit 1
fi

# Use account1 identity
dfx identity use $ACCOUNT1

# Mint tokens
dfx canister call $CANISTER_ID_FAKEDKP mint_tokens

# Transfer tokens to the stored principal
dfx canister call $CANISTER_ID_FAKEDKP icrc1_transfer "(record {
    to = record { 
        owner = principal \"$PLUG_PRINCIPAL\"; 
        subaccount = null 
    }; 
    fee = opt 100_000; 
    memo = opt blob \"\"; 
    amount = 800_000_0000_0000
})"

# Mint tokens
dfx canister call $CANISTER_ID_FAKEDKP mint_tokens

# Transfer tokens to the stored principal
dfx canister call $CANISTER_ID_FAKEDKP icrc1_transfer "(record {
    to = record { 
        owner = principal \"$INTERNET_IDENTITY_PRINCIPAL\"; 
        subaccount = null 
    }; 
    fee = opt 100_000; 
    memo = opt blob \"\"; 
    amount = 800_000_0000_0000
})"

# Switch to account2 identity
dfx identity use $ACCOUNT2
