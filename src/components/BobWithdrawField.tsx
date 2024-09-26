import { useEffect, useState } from 'react';
import { TextField, ThemeProvider } from '@mui/material';
import theme from '../theme';
import bigintToFloatString from '../bigIntToFloatString';
import { Principal } from '@dfinity/principal';
import { _SERVICE as bobService } from '../declarations/nns-ledger/index.d'; // why is this icpService?
import { _SERVICE as reBobService } from '../declarations/service_hack/service';
import ShowTransactionStatus from './ShowTransactionStatus';

interface BobWithdrawFieldProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  reBobLedgerBalance: bigint;
  reBobFee: bigint;
  bobFee: bigint;
  isConnected: boolean;
  reBobActor: reBobService | null;
  reBobCanisterID: string;
  cleanUp: () => void;
}

const BobWithdrawField: React.FC<BobWithdrawFieldProps> = ({
  loading,
  setLoading,
  reBobLedgerBalance,
  bobFee,
  reBobFee,
  isConnected,
  reBobActor,
  reBobCanisterID,
  cleanUp,
}) => {
  const [reBobFieldValue, setReBobFieldValue] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textFieldErrored, setTextFieldErrored] = useState<boolean>(false);
  const [reBobFieldNatValue, setReBobFieldNatValue] = useState<bigint>(0n);
  const [statusArray, setStatusArray] = useState<string[]>(['']);
  const [textFieldValueTooLow, setTextFieldValueTooLow] =
    useState<boolean>(true);

  const minimumTransactionAmount: bigint = 1_100_000n;

  const handleWithdrawl = async () => {
    if (!isConnected) {
      addStatus('You must be logged in to swap!');
      return;
    }

    if (
      reBobFieldNatValue + bobFee + reBobFee > reBobLedgerBalance ||
      reBobLedgerBalance < minimumTransactionAmount
    ) {
      // Cover the bob transfer from backend fee. Cover the reBob approval fee. The reBob is burned without a fee applied.
      addStatus('You do not have enough reBob.');
      return;
    }

    if (!reBobActor) {
      addStatus('reBob actor not loaded!');
      return;
    }

    setLoading(true);

    // This step isn't needed.
    const approvalResult = await approveReBob(
      reBobFieldNatValue + bobFee + reBobFee
    );

    if (!approvalResult) {
      await cleanUp();
      return;
    }

    const result = await bobWithdraw(reBobFieldNatValue + bobFee);

    if (!result) {
      addStatus('reBob was approved, but was not transferred.');
    }

    await cleanUp();
    setReBobFieldNatValue(0n);
    setReBobFieldValue('');
  };

  const approveReBob = async (amountInE8s: bigint) => {
    if (!reBobActor) return false;

    addStatus(
      `Requesting to approve ${bigintToFloatString(amountInE8s, 6)} reBob.`
    );

    console.log('before');

    try {
      const approvalResult = await reBobActor.icrc2_approve({
        amount: amountInE8s, // Cover the fee of sending the bob back to the user.
        // Adjust with your canister ID and parameters
        spender: {
          owner: await Principal.fromText(reBobCanisterID),
          subaccount: [],
        },
        memo: [],
        fee: [reBobFee],
        created_at_time: [BigInt(Date.now()) * 1000000n],
        expires_at: [
          BigInt(Date.now()) * 1000000n + 5n * 60n * 1000n * 1000000n,
        ], // 5 minute approval.
        expected_allowance: [],
        from_subaccount: [],
      });

      console.log('after');

      console.log({ approvalResult });

      if ('Ok' in approvalResult) {
        addStatus(
          `${bigintToFloatString(amountInE8s, 6)} reBob approved for transfer!`
        );
        return true;
      } else {
        addStatus('reBob was not approved for transfer.');
        return false;
      }
    } catch (error) {
      console.error('Error occurred when approving reBob: ', error);
      addStatus(
        "Error occurred when approving reBob (Check your web browser's console)"
      );
    }
    return false;
  };

  const bobWithdraw = async (amountInE8s: bigint) => {
    if (!reBobActor) {
      return false;
    }

    try {
      addStatus(
        `Depositing ${bigintToFloatString(
          amountInE8s,
          6
        )} reBob to burn for Bob.`
      );
      const result = await reBobActor.withdraw([], amountInE8s);
      if ('ok' in result) {
        addStatus(
          `Swapped ${bigintToFloatString(
            amountInE8s,
            6
          )} reBob for ${bigintToFloatString(
            amountInE8s,
            8
          )} Bob! reBob burned on block ${
            result.ok[0]
          }. Bob transferred on block ${result.ok[1]}`
        );
        return true;
      } else {
        addStatus(
          "failed to burn reBob and return Bob (Check your web browser's console)"
        );
        console.error(
          'failed to burn reBob and return Bob',
          result.err.toString()
        );
        return false;
      }
    } catch (error) {
      console.error('Burning reBob and returning Bob failed:', error);
      addStatus(
        "Burning reBob and returning Bob failed (Check your web browser's console)"
      );
      return false;
    }
  };

  const addStatus = (inputText: string) => {
    setStatusArray((prevArray) => [inputText, ...prevArray]);
  };

  const handleBobFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d{0,6}$/; // Regex to allow numbers with up to 8 decimal places
    const newBobFieldValue = event.target.value;

    if (regex.test(newBobFieldValue) || newBobFieldValue === '') {
      setReBobFieldValue(newBobFieldValue);
    }
  };

  useEffect(() => {
    const reBobNatValue =
      reBobFieldValue && reBobFieldValue !== '.'
        ? BigInt((parseFloat(reBobFieldValue) * 1_000_000).toFixed(0)) // Convert to Nat
        : 0n;

    // console.log(bobNatValue);
    setButtonDisabled(reBobNatValue + bobFee + reBobFee > reBobLedgerBalance);
    setTextFieldValueTooLow(reBobNatValue < minimumTransactionAmount);
    setTextFieldErrored(
      (reBobLedgerBalance < minimumTransactionAmount && reBobNatValue > 0) ||
        (reBobLedgerBalance >= minimumTransactionAmount &&
          reBobNatValue + bobFee + reBobFee > reBobLedgerBalance)
    );
    setReBobFieldNatValue(reBobNatValue);
  }, [reBobFieldValue, reBobLedgerBalance]);

  return (
    <ThemeProvider theme={theme}>
      {reBobLedgerBalance < minimumTransactionAmount ? (
        <>
          <div>
            {`You need at least ${bigintToFloatString(
              minimumTransactionAmount,
              6
            )}
            $reBob to unHASH to Bob`}
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
          width: '100%',
        }}
      >
        <div>
          <TextField
            label="reBob"
            variant="filled"
            value={reBobFieldValue}
            onChange={handleBobFieldChange}
            helperText={
              buttonDisabled
                ? "You don't have enough reBob!"
                : textFieldValueTooLow
                ? `You must input at least ${bigintToFloatString(
                    minimumTransactionAmount,
                    6
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
            onClick={handleWithdrawl}
            disabled={loading || buttonDisabled}
            style={{
              height: '56px', // Match this with TextField's height
              width: '200px', // Set the same width as TextField
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {'Return to Bobs'}
          </button>
        </div>
      </div>
      <div>
        <ShowTransactionStatus statusArray={statusArray} loading={loading} />
      </div>
    </ThemeProvider>
  );
};

export default BobWithdrawField;
