import { useEffect, useState } from 'react';
import { TextField, ThemeProvider } from '@mui/material';
import theme from '../theme';
import bigintToFloatString from '../bigIntToFloatString';
import { Principal } from '@dfinity/principal';
// import { _SERVICE as bobService } from '../declarations/nns-ledger'; // why is this icpService?
// import { _SERVICE as reBobService } from '../declarations/service_hack/service';
import ShowTransactionStatus from './ShowTransactionStatus';
import TokenObject from '../TokenObject';

interface BackendWithdrawFieldProps {
  inputToken: TokenObject;
  outputToken: TokenObject;
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
}

const BackendWithdrawField: React.FC<BackendWithdrawFieldProps> = ({
  inputToken,
  outputToken,
  loading,
  setLoading,
  isConnected,
}) => {
  const [outputFieldValue, setOutputFieldValue] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textFieldErrored, setTextFieldErrored] = useState<boolean>(false);
  const [outputFieldNatValue, setOutputFieldNatValue] = useState<bigint>(0n);
  const [statusArray, setStatusArray] = useState<string[]>(['']);
  const [textFieldValueTooLow, setTextFieldValueTooLow] =
    useState<boolean>(true);

  const minimumTransactionAmount: bigint = outputToken.fee * 4n;

  const handleWithdrawl = async () => {
    if (!isConnected) {
      addStatus('You must be logged in to swap!');
      return;
    }

    if (
      outputFieldNatValue + inputToken.fee + outputToken.fee >
        outputToken.ledgerBalance ||
      outputToken.ledgerBalance < minimumTransactionAmount
    ) {
      // Cover the bob transfer from backend fee. Cover the reBob approval fee. The reBob is burned without a fee applied.
      addStatus(`You do not have enough ${outputToken.ticker}.`);
      return;
    }

    if (!outputToken.actor) {
      addStatus(`${outputToken.ticker} actor not loaded!`);
      return;
    }

    setLoading(true);

    // This step isn't needed.
    const approvalResult = await approveOutputToken(
      outputFieldNatValue + inputToken.fee + outputToken.fee
    );

    if (!approvalResult) {
      inputToken.getLedgerBalance();
      outputToken.getLedgerBalance();
      setLoading(false);
      return;
    }

    const result = await backendWithdraw(outputFieldNatValue + inputToken.fee);

    if (!result) {
      addStatus(`${outputToken.ticker} was approved, but was not transferred.`);
    }

    console.log('getting new ledger balances. (withdraw)');
    inputToken.getLedgerBalance();
    outputToken.getLedgerBalance();
    setLoading(false);
    setOutputFieldNatValue(0n);
    setOutputFieldValue('');
  };

  const approveOutputToken = async (amountInE8s: bigint) => {
    if (!outputToken.actor) return false;

    addStatus(
      `Requesting to approve ${bigintToFloatString(
        amountInE8s,
        outputToken.decimals
      )} ${outputToken.ticker}.`
    );

    const result = await outputToken.approve(
      amountInE8s,
      outputToken.canisterId
    );

    if (result) {
      addStatus(
        `${bigintToFloatString(amountInE8s, outputToken.decimals)} ${
          outputToken.ticker
        } approved for transfer!`
      );
      return true;
    } else {
      addStatus(`${outputToken.ticker} was not approved for transfer.`);
      return false;
    }
  };

  const backendWithdraw = async (amountInE8s: bigint): Promise<boolean> => {
    if (!outputToken.actor) {
      return false;
    }

    addStatus(
      `Depositing ${bigintToFloatString(amountInE8s, outputToken.decimals)} ${
        outputToken.ticker
      } to burn for ${inputToken.ticker}.`
    );

    const result = await outputToken.withdraw(amountInE8s);

    if (result) {
      addStatus(
        `Successfully swapped ${bigintToFloatString(
          amountInE8s,
          outputToken.decimals
        )} ${outputToken.ticker}!`
      );
      return true;
    } else {
      addStatus(
        `Failed to withdraw ${inputToken.ticker} from the backend (Check your web browser's console)`
      );
      return false;
    }
  };

  const addStatus = (inputText: string) => {
    setStatusArray((prevArray) => [inputText, ...prevArray]);
  };

  const handleOutputFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const regex = new RegExp(`^\\d*\\.?\\d{0,${outputToken.decimals}}$`); ///^\d*\.?\d{0,6}$/; // Regex to allow numbers with up to 8 decimal places
    const newOutputFieldValue = event.target.value;

    if (regex.test(newOutputFieldValue) || newOutputFieldValue === '') {
      setOutputFieldValue(newOutputFieldValue);
    }
  };

  useEffect(() => {
    const outputNatValue =
      outputFieldValue && outputFieldValue !== '.'
        ? BigInt(
            (
              parseFloat(outputFieldValue) * Math.pow(10, outputToken.decimals)
            ).toFixed(0) // Convert based on decimals
          )
        : 0n;

    // console.log(bobNatValue);
    setButtonDisabled(
      outputNatValue + outputToken.fee * 2n > outputToken.ledgerBalance
    );
    setTextFieldValueTooLow(outputNatValue < minimumTransactionAmount);
    setTextFieldErrored(
      (outputToken.ledgerBalance < minimumTransactionAmount &&
        outputNatValue > 0) ||
        (outputToken.ledgerBalance >= minimumTransactionAmount &&
          outputNatValue + outputToken.fee * 2n > outputToken.ledgerBalance)
    );
    setOutputFieldNatValue(outputNatValue);
  }, [outputFieldValue, outputToken]);

  return (
    <ThemeProvider theme={theme}>
      {outputToken.ledgerBalance < minimumTransactionAmount ? (
        <>
          <div>
            {`You need at least ${bigintToFloatString(
              minimumTransactionAmount,
              outputToken.decimals
            )}
            $${outputToken.ticker} to swap to $${inputToken.ticker}`}
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
            label={`${outputToken.ticker}`}
            variant="filled"
            value={outputFieldValue}
            onChange={handleOutputFieldChange}
            helperText={
              buttonDisabled
                ? `You don't have enough ${outputToken.ticker}!`
                : textFieldValueTooLow
                ? `You must input at least ${bigintToFloatString(
                    minimumTransactionAmount,
                    outputToken.decimals
                  )} ${outputToken.ticker} to swap.`
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
            {`Return to ${inputToken.ticker}s`}
          </button>
        </div>
      </div>
      <div>
        <ShowTransactionStatus statusArray={statusArray} loading={loading} />
      </div>
    </ThemeProvider>
  );
};

export default BackendWithdrawField;
