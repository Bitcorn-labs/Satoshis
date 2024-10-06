import { Principal } from '@dfinity/principal';
import { TextField, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import bigintToFloatString from '../bigIntToFloatString';
import theme from '../theme';
import TokenObject from '../TokenObject';

interface TransactionBoxProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  // tokenActor: bobService | reBobService | null;
  // tokenFee: bigint;
  // tokenTicker: string;
  // tokenDecimals: number;
  // tokenLedgerBalance: bigint;
  token: TokenObject;
}

const TransactionBox: React.FC<TransactionBoxProps> = ({
  loading,
  setLoading,
  // tokenActor,
  // tokenFee,
  // tokenTicker,
  // tokenDecimals,
  // tokenLedgerBalance,
  token,
}) => {
  const [transactionFieldValue, setTransactionFieldValue] =
    useState<string>('');
  const [transactionFieldNatValue, setTransactionFieldNatValue] =
    useState<bigint>(0n);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textFieldValueTooLow, setTextFieldValueTooLow] =
    useState<boolean>(false);
  const [valueFieldErrored, setValueFieldErrored] = useState<boolean>(false);

  const [principalField, setPrincipalField] = useState<string>('');
  const [principalFieldErrored, setPrincipalFieldErrored] =
    useState<boolean>(false);

  const [remainder, setRemainder] = useState<string>('');

  const transfer = async (amountInE8s: bigint, toPrincipal: string) => {
    if (!token.actor) return;

    setLoading(true);

    console.log({ amountInE8s, toPrincipal });

    // try {
    //   // Call the token actor's icrc1_transfer function
    //   const result = await token.actor.icrc1_transfer({
    //     amount: amountInE8s, // The amount to transfer (must be a bigint)
    //     to: {
    //       owner: toPrincipal, // The recipient's principal
    //       subaccount: [], // Optional, an empty array for no subaccount
    //     },
    //     fee: [token.fee], // Optional fee, default is empty
    //     memo: [], // Optional memo, default is empty
    //     from_subaccount: [], // Optional, if you want to specify a subaccount
    //     created_at_time: [BigInt(Date.now()) * 1000000n],
    //   });

    //   console.log({ result });
    //   // Handle the result
    //   if ('Ok' in result) {
    //     console.log(`Transfer successful! Transaction ID: ${result.Ok}`);
    //     return result.Ok;
    //   } else if ('Err' in result) {
    //     console.error('Transfer failed:', result.Err);
    //     return result.Err;
    //   }
    // } catch (error) {
    //   console.error('Error during token transfer:', error);
    //   throw error;
    // } finally {
    //   cleanUp();
    //   setTransactionFieldValue('');
    //   setPrincipalField('');
    // }
    try {
      token.transfer(amountInE8s, toPrincipal);
      setTransactionFieldValue('');
      setPrincipalField('');
    } catch (error) {
      console.error('An error occurred while trying to transfer tokens', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const regex = new RegExp(`^\\d*\\.?\\d{0,${token.decimals}}$`);
    const newBobFieldValue = event.target.value;

    if (regex.test(newBobFieldValue) || newBobFieldValue === '') {
      setTransactionFieldValue(newBobFieldValue);
    }
  };

  useEffect(() => {
    const decimalMultiplier = 10 ** token.decimals;
    const natValue =
      transactionFieldValue && transactionFieldValue !== '.'
        ? BigInt(
            (parseFloat(transactionFieldValue) * decimalMultiplier).toFixed(0)
          ) // Convert to Nat
        : 0n;

    // console.log(bobNatValue);
    setButtonDisabled(natValue + token.fee > token.ledgerBalance);

    setTextFieldValueTooLow(natValue < token.fee);
    setValueFieldErrored(
      (token.ledgerBalance < token.fee && natValue > 0) ||
        (token.ledgerBalance >= token.fee &&
          natValue + token.fee > token.ledgerBalance)
    );
    setTransactionFieldNatValue(natValue);
    if (token.ledgerBalance - natValue - token.fee > 0) {
      setRemainder(
        bigintToFloatString(
          token.ledgerBalance - natValue - token.fee,
          token.decimals
        )
      );
    } else {
      setRemainder('0');
    }
  }, [transactionFieldValue, token]);

  const handleTransaction = () => {
    if (!isValidPrincipal(principalField)) return;
    transfer(transactionFieldNatValue, principalField);
  };

  const handlePrincipalFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrincipalField(event.target.value);
    if (event.target.value === '') {
      setPrincipalFieldErrored(false);
    } else {
      setPrincipalFieldErrored(!isValidPrincipal(event.target.value));
    }
  };

  const isValidPrincipal = (principalString: string): boolean => {
    try {
      Principal.fromText(principalString);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleMaxClick = () => {
    setTransactionFieldValue(
      token.ledgerBalance > token.fee
        ? bigintToFloatString(token.ledgerBalance - token.fee, token.decimals)
        : '0'
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <div>
          <div>
            <div>{`Remaining: ${remainder} ${token.ticker}s`}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <TextField
              label="To Principal"
              variant="filled"
              onChange={handlePrincipalFieldChange}
              value={principalField}
              error={principalFieldErrored}
              helperText={
                principalFieldErrored ? 'Enter a valid principal!' : ''
              }
              disabled={loading}
            />

            <TextField
              label={token.ticker}
              variant="filled"
              value={transactionFieldValue}
              onChange={handleTransactionFieldChange}
              helperText={
                buttonDisabled
                  ? `You don't have enough ${token.ticker}!`
                  : textFieldValueTooLow
                  ? `You must input at least ${bigintToFloatString(
                      token.fee,
                      token.decimals
                    )} to transfer.`
                  : ''
              }
              error={valueFieldErrored}
              disabled={loading}
              slotProps={{
                input: {
                  inputMode: 'decimal', // Helps show the numeric pad with decimal on mobile devices
                },
              }}
              style={{ width: '200px', minHeight: '84px' }} // Set a fixed width or use a percentage
            />
            <div>
              <button style={{ height: '56px' }} onClick={handleMaxClick}>
                MAX
              </button>
            </div>
            <div>
              <button
                disabled={buttonDisabled || principalFieldErrored || loading}
                onClick={handleTransaction}
                style={{ height: '56px' }}
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default TransactionBox;
