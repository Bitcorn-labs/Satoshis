import { useEffect, useState } from 'react';
import { TextField, ThemeProvider, createTheme } from '@mui/material';
import theme from '../theme';
import bigintToFloatString from '../bigIntToFloatString';
// import { Principal } from '@dfinity/principal';
// import { _SERVICE as bobService } from '../declarations/nns-ledger'; // why is this icpService?
// import { _SERVICE as reBobService } from '../declarations/service_hack/service';
import ShowTransactionStatus from './ShowTransactionStatus';
import TokenObject from '../TokenObject';

interface BackendMintingFieldProps {
  inputToken: TokenObject;
  outputToken: TokenObject;
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
  // cleanUp: () => void;
  minimumTransactionAmount: bigint;
  // bobLedgerBalance: bigint;
  // bobFee: bigint;
  // reBobCanisterID: string;
  // bobLedgerActor: bobService | null;
  // reBobActor: reBobService | null;
}

const BackendMintingField: React.FC<BackendMintingFieldProps> = ({
  inputToken,
  outputToken,
  loading,
  setLoading,
  isConnected,
  // cleanUp,
  minimumTransactionAmount,
  // bobLedgerBalance,
  // bobFee,
  // reBobCanisterID,
  // bobLedgerActor,
  // reBobActor,
}) => {
  const [inputFieldValue, setInputFieldValue] = useState<string>('');
  const [inputFieldNatValue, setInputFieldNatValue] = useState<bigint>(0n);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textFieldErrored, setTextFieldErrored] = useState<boolean>(false);
  const [statusArray, setStatusArray] = useState<string[]>(['']);
  const [textFieldValueTooLow, setTextFieldValueTooLow] =
    useState<boolean>(true);

  const handleInputFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const regex = /^\d*\.?\d{0,8}$/; // Regex to allow numbers with up to 8 decimal places
    const newInputFieldValue = event.target.value;

    if (regex.test(newInputFieldValue) || newInputFieldValue === '') {
      setInputFieldValue(newInputFieldValue);
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      addStatus('You must be logged in to swap!');
      return;
    }

    if (
      inputFieldNatValue + inputToken.fee * 2n > inputToken.ledgerBalance ||
      inputToken.ledgerBalance < minimumTransactionAmount
    ) {
      addStatus(`You do not have enough ${inputToken.ticker}.`);
      return;
    }

    if (!inputToken.actor || !outputToken.actor) {
      addStatus('Actors not loaded!');
      return;
    }

    setLoading(true);

    const approvalResult = await approveInputToken(
      inputFieldNatValue + inputToken.fee
    );

    if (!approvalResult) {
      // cleanUp();
      setLoading(false);
      return;
    }

    const result = await backendDeposit(inputFieldNatValue);

    if (!result) {
      addStatus(`${inputToken.ticker} was approved, but was not transferred.`);
    }

    // cleanUp();
    inputToken.getLedgerBalance();
    outputToken.getLedgerBalance();
    setLoading(false);
    setInputFieldNatValue(0n);
    setInputFieldValue('');
  };

  const approveInputToken = async (amountInE8s: bigint) => {
    if (!inputToken.actor) return false;

    addStatus(
      `Requesting to approve ${bigintToFloatString(amountInE8s, 8)} ${
        inputToken.ticker
      }.`
    );

    const result = await inputToken.approve(
      amountInE8s,
      outputToken.canisterId
    );

    if (result) {
      addStatus(
        `${bigintToFloatString(amountInE8s, 8)} ${
          inputToken.ticker
        } approved for transfer!`
      );
      return true;
    } else {
      addStatus(`${inputToken.ticker} was not approved for transfer.`);
    }

    // try {
    //   const approvalResult = await bobLedgerActor.icrc2_approve({
    //     amount: amountInE8s, // Approve amount and the fee to send bob back during icrc2_transfer_from() in deposit() function
    //     // Adjust with your canister ID and parameters
    //     spender: {
    //       owner: await Principal.fromText(reBobCanisterID),
    //       subaccount: [],
    //     },
    //     memo: [],
    //     fee: [bobFee],
    //     created_at_time: [BigInt(Date.now()) * 1000000n],
    //     expires_at: [],
    //     expected_allowance: [],
    //     from_subaccount: [],
    //   });

    //   if ('Ok' in approvalResult) {
    //     addStatus(
    //       `${bigintToFloatString(amountInE8s, 8)} Bob approved for transfer!`
    //     );
    //     return true;
    //   } else {
    //     addStatus('Bob was not approved for transfer.');
    //     return false;
    //   }
    // } catch (error) {
    //   console.error('Error occurred when approving Bob:', error);
    //   addStatus(
    //     "Error occurred when approving Bob (Check your web browser's console)"
    //   );
    //   return false;
    // }
  };

  const backendDeposit = async (amountInE8s: bigint): Promise<boolean> => {
    if (!outputToken.actor) {
      return false;
    }

    const result = await outputToken.deposit(amountInE8s);

    if (result) {
      addStatus(
        `Successfully swapped ${bigintToFloatString(amountInE8s, 8)} ${
          inputToken.ticker
        }!`
      );
      return true;
    } else {
      addStatus(
        "Failed to deposit Bob to the reBob hasher (Check your web browser's console)"
      );
      return false;
    }

    // try {
    //   addStatus(
    //     `Depositing ${bigintToFloatString(amountInE8s, 8)} Bob to mint reBob.`
    //   );
    //   const result = await reBobActor.deposit([], amountInE8s);

    //   if ('ok' in result) {
    //     addStatus(
    //       `Swapped ${bigintToFloatString(
    //         amountInE8s,
    //         8
    //       )} Bob for ${bigintToFloatString(
    //         amountInE8s,
    //         6
    //       )} reBob! Bob transferred on block ${result.ok[0].toString()}. ReBob minted on block ${result.ok[1].toString()}.`
    //     );
    //     return true;
    //   } else {
    //     addStatus(
    //       "Failed to deposit Bob to the reBob hasher (Check your web browser's console)"
    //     );
    //     console.error(
    //       'Failed to deposit Bob to the reBob hasher: ',
    //       result.err.toString()
    //     );
    //     return false;
    //   }
    // } catch (error) {
    //   console.error('Failed when depositing Bob to the reBob hasher:', error);
    //   addStatus(
    //     "Failed when depositing Bob to the reBob hasher (Check your web browser's console)"
    //   );
    //   return false;
    // }
  };

  const addStatus = (inputText: string) => {
    setStatusArray((prevArray) => [inputText, ...prevArray]);
  };

  useEffect(() => {
    const inputNatValue =
      inputFieldValue && inputFieldValue !== '.'
        ? BigInt((parseFloat(inputFieldValue) * 1_0000_0000).toFixed(0)) // Convert to Nat
        : 0n;

    // console.log(bobNatValue);
    setButtonDisabled(
      inputNatValue + inputToken.fee * 2n > inputToken.ledgerBalance
    );
    setTextFieldValueTooLow(inputNatValue < minimumTransactionAmount);
    setTextFieldErrored(
      (inputToken.ledgerBalance < minimumTransactionAmount &&
        inputNatValue > 0) ||
        (inputToken.ledgerBalance >= minimumTransactionAmount &&
          inputNatValue + inputToken.fee * 2n > inputToken.ledgerBalance)
    );
    setInputFieldNatValue(inputNatValue);
  }, [inputFieldValue, inputToken]);

  return (
    <ThemeProvider theme={theme}>
      {inputToken.ledgerBalance <= minimumTransactionAmount ? (
        <>
          <div>
            {`You need at least ${bigintToFloatString(
              minimumTransactionAmount,
              8
            )} $${inputToken.ticker} to swap to $${outputToken.ticker}`}
          </div>
        </>
      ) : (
        <></>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
        }}
      >
        <div>
          <TextField
            label={`${inputToken.ticker}`}
            variant="filled"
            value={inputFieldValue}
            onChange={handleInputFieldChange}
            helperText={
              buttonDisabled
                ? `You don't have enough ${inputToken.ticker}!`
                : textFieldValueTooLow
                ? `You must input at least ${bigintToFloatString(
                    minimumTransactionAmount,
                    8
                  )} ${inputToken.ticker} to swap.`
                : ''
            }
            error={textFieldErrored}
            disabled={loading}
            slotProps={{
              input: {
                inputMode: 'decimal', // Helps show the numeric pad with decimal on mobile devices
              },
            }}
            style={{ width: '200px', minHeight: '84px' }} // Set a fixed width or use a percentage
          />
        </div>
        <div style={{ height: '100%', paddingLeft: '2px' }}>
          <button
            onClick={handleMint}
            disabled={loading || buttonDisabled}
            style={{
              height: '56px', // Match this with TextField's height
              width: '200px', // Set the same width as TextField
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {`shrink ${inputToken.ticker}????`}
          </button>
        </div>
      </div>
      <div>
        <ShowTransactionStatus statusArray={statusArray} loading={loading} />

        {/* <RetryReBobMint/> */}
      </div>
    </ThemeProvider>
  );
};

export default BackendMintingField;
