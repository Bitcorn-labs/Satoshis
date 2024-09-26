import { useEffect, useState } from 'react';
import { TextField, ThemeProvider, createTheme } from '@mui/material';
import theme from '../theme';
import bigintToFloatString from '../bigIntToFloatString';
import { Principal } from '@dfinity/principal';
import { _SERVICE as bobService } from '../declarations/nns-ledger/index.d'; // why is this icpService?
import { _SERVICE as reBobService } from '../declarations/service_hack/service';
import ShowTransactionStatus from './ShowTransactionStatus';

interface ReBobMintingFieldProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  bobLedgerBalance: bigint;
  bobFee: bigint;
  isConnected: boolean;
  reBobCanisterID: string;
  cleanUp: () => void;
  bobLedgerActor: bobService | null;
  reBobActor: reBobService | null;
  minimumTransactionAmount: bigint;
}

const ReBobMintingField: React.FC<ReBobMintingFieldProps> = ({
  loading,
  setLoading,
  bobLedgerBalance,
  bobFee,
  isConnected,
  reBobCanisterID,
  cleanUp,
  bobLedgerActor,
  reBobActor,
  minimumTransactionAmount,
}) => {
  const [bobFieldValue, setBobFieldValue] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textFieldErrored, setTextFieldErrored] = useState<boolean>(false);
  const [statusArray, setStatusArray] = useState<string[]>(['']);
  const [bobFieldNatValue, setBobFieldNatValue] = useState<bigint>(0n);
  const [textFieldValueTooLow, setTextFieldValueTooLow] =
    useState<boolean>(true);

  const handleBobFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d{0,8}$/; // Regex to allow numbers with up to 8 decimal places
    const newBobFieldValue = event.target.value;

    if (regex.test(newBobFieldValue) || newBobFieldValue === '') {
      setBobFieldValue(newBobFieldValue);
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      addStatus('You must be logged in to swap!');
      return;
    }

    if (
      bobFieldNatValue + bobFee * 2n > bobLedgerBalance ||
      bobLedgerBalance < minimumTransactionAmount
    ) {
      addStatus('You do not have enough Bob.');
      return;
    }

    if (!bobLedgerActor || !reBobActor) {
      addStatus('Actors not loaded!');
      return;
    }

    setLoading(true);

    const approvalResult = await approveBob(bobFieldNatValue + bobFee);

    if (!approvalResult) {
      cleanUp();
      return;
    }

    const result = await bobDeposit(bobFieldNatValue);

    if (!result) {
      addStatus('Bob was approved, but was not transferred.');
    }

    cleanUp();
    setBobFieldNatValue(0n);
    setBobFieldValue('');
  };

  const approveBob = async (amountInE8s: bigint) => {
    if (!bobLedgerActor) return false;

    addStatus(
      `Requesting to approve ${bigintToFloatString(amountInE8s, 8)} Bob.`
    );

    try {
      const approvalResult = await bobLedgerActor.icrc2_approve({
        amount: amountInE8s, // Approve amount and the fee to send bob back during icrc2_transfer_from() in deposit() function
        // Adjust with your canister ID and parameters
        spender: {
          owner: await Principal.fromText(reBobCanisterID),
          subaccount: [],
        },
        memo: [],
        fee: [bobFee],
        created_at_time: [BigInt(Date.now()) * 1000000n],
        expires_at: [],
        expected_allowance: [],
        from_subaccount: [],
      });

      if ('Ok' in approvalResult) {
        addStatus(
          `${bigintToFloatString(amountInE8s, 8)} Bob approved for transfer!`
        );
        return true;
      } else {
        addStatus('Bob was not approved for transfer.');
        return false;
      }
    } catch (error) {
      console.error('Error occurred when approving Bob:', error);
      addStatus(
        "Error occurred when approving Bob (Check your web browser's console)"
      );
      return false;
    }
  };

  const bobDeposit = async (amountInE8s: bigint) => {
    if (!reBobActor) {
      return false;
    }

    try {
      addStatus(
        `Depositing ${bigintToFloatString(amountInE8s, 8)} Bob to mint reBob.`
      );
      const result = await reBobActor.deposit([], amountInE8s);

      if ('ok' in result) {
        addStatus(
          `Swapped ${bigintToFloatString(
            amountInE8s,
            8
          )} Bob for ${bigintToFloatString(
            amountInE8s,
            6
          )} reBob! Bob transferred on block ${result.ok[0].toString()}. ReBob minted on block ${result.ok[1].toString()}.`
        );
        return true;
      } else {
        addStatus(
          "Failed to deposit Bob to the reBob hasher (Check your web browser's console)"
        );
        console.error(
          'Failed to deposit Bob to the reBob hasher: ',
          result.err.toString()
        );
        return false;
      }
    } catch (error) {
      console.error('Failed when depositing Bob to the reBob hasher:', error);
      addStatus(
        "Failed when depositing Bob to the reBob hasher (Check your web browser's console)"
      );
      return false;
    }
  };

  const addStatus = (inputText: string) => {
    setStatusArray((prevArray) => [inputText, ...prevArray]);
  };

  useEffect(() => {
    const bobNatValue =
      bobFieldValue && bobFieldValue !== '.'
        ? BigInt((parseFloat(bobFieldValue) * 1_0000_0000).toFixed(0)) // Convert to Nat
        : 0n;

    // console.log(bobNatValue);
    setButtonDisabled(bobNatValue + bobFee * 2n > bobLedgerBalance);
    setTextFieldValueTooLow(bobNatValue < minimumTransactionAmount);
    setTextFieldErrored(
      (bobLedgerBalance < minimumTransactionAmount && bobNatValue > 0) ||
        (bobLedgerBalance >= minimumTransactionAmount &&
          bobNatValue + bobFee * 2n > bobLedgerBalance)
    );
    setBobFieldNatValue(bobNatValue);
  }, [bobFieldValue, bobLedgerBalance]);

  return (
    <ThemeProvider theme={theme}>
      {bobLedgerBalance <= minimumTransactionAmount ? (
        <>
          <div>
            You need at least {bigintToFloatString(minimumTransactionAmount, 8)}{' '}
            $Bob to hash to reBob
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
            label="Bob"
            variant="filled"
            value={bobFieldValue}
            onChange={handleBobFieldChange}
            helperText={
              buttonDisabled
                ? "You don't have enough Bob!"
                : textFieldValueTooLow
                ? `You must input at least ${bigintToFloatString(
                    minimumTransactionAmount,
                    8
                  )} to swap.`
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
            {'Enlarge Bobs'}
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

export default ReBobMintingField;
