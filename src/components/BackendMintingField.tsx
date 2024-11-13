import { useEffect, useState } from "react";
import { TextField, ThemeProvider, createTheme } from "@mui/material";
import theme from "../theme";
import bigintToFloatString from "../utils/bigIntToFloatString";
// import { Principal } from '@dfinity/principal';
// import { _SERVICE as bobService } from '../declarations/nns-ledger'; // why is this icpService?
// import { _SERVICE as reBobService } from '../declarations/service_hack/service';
import ShowTransactionStatus from "./ShowTransactionStatus";
import TokenObject from "../utils/TokenObject";

interface BackendMintingFieldProps {
  inputToken: TokenObject;
  outputToken: TokenObject;
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
  // minimumTransactionAmount: bigint;
}

const BackendMintingField: React.FC<BackendMintingFieldProps> = ({
  inputToken,
  outputToken,
  loading,
  setLoading,
  isConnected,
  // minimumTransactionAmount,
}) => {
  const [inputFieldValue, setInputFieldValue] = useState<string>("");
  const [inputFieldNatValue, setInputFieldNatValue] = useState<bigint>(0n);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textFieldErrored, setTextFieldErrored] = useState<boolean>(false);
  const [statusArray, setStatusArray] = useState<string[]>([""]);
  const [textFieldValueTooLow, setTextFieldValueTooLow] =
    useState<boolean>(true);

  const extraFee = 10n;

  const minimumTransactionAmount: bigint = inputToken.fee * 4n + extraFee;

  const handleInputFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const regex = new RegExp(`^\\d*\\.?\\d{0,${inputToken.decimals}}$`); ///^\d*\.?\d{0,8}$/; // Regex to allow numbers with up to 8 decimal places
    const newInputFieldValue = event.target.value;

    if (regex.test(newInputFieldValue) || newInputFieldValue === "") {
      setInputFieldValue(newInputFieldValue);
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      addStatus("You must be logged in to swap!");
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
      addStatus("Actors not loaded!");
      return;
    }

    setLoading(true);

    const approvalResult = await approveInputToken(
      inputFieldNatValue + inputToken.fee
    );

    if (!approvalResult) {
      inputToken.getLedgerBalance();
      outputToken.getLedgerBalance();
      setLoading(false);
      return;
    }

    const result = await backendDeposit(inputFieldNatValue);

    if (!result) {
      addStatus(`${inputToken.ticker} was approved, but was not transferred.`);
    }

    console.log("getting new ledger balances. (minting)");
    inputToken.getLedgerBalance();
    outputToken.getLedgerBalance();
    setLoading(false);
    setInputFieldNatValue(0n);
    setInputFieldValue("");
  };

  const approveInputToken = async (amountInE8s: bigint) => {
    if (!inputToken.actor) return false;

    addStatus(
      `Requesting to approve ${bigintToFloatString(
        amountInE8s,
        inputToken.decimals
      )} ${inputToken.ticker}.`
    );

    const result = await inputToken.approve(
      amountInE8s,
      outputToken.canisterId
    );

    if (result) {
      addStatus(
        `${bigintToFloatString(amountInE8s, inputToken.decimals)} ${
          inputToken.ticker
        } approved for transfer!`
      );
      return true;
    } else {
      addStatus(`${inputToken.ticker} was not approved for transfer.`);
      return false;
    }
  };

  const backendDeposit = async (amountInE8s: bigint): Promise<boolean> => {
    if (!outputToken.actor) {
      return false;
    }

    const result = await outputToken.deposit(amountInE8s);

    if (result) {
      addStatus(
        `Successfully swapped ${bigintToFloatString(
          amountInE8s,
          inputToken.decimals
        )} ${inputToken.ticker}!`
      );
      return true;
    } else {
      addStatus(
        `Failed to deposit ${inputToken.ticker} to the backend (Check your web browser's console)`
      );
      return false;
    }
  };

  const addStatus = (inputText: string) => {
    setStatusArray((prevArray) => [inputText, ...prevArray]);
  };

  useEffect(() => {
    const inputNatValue =
      inputFieldValue && inputFieldValue !== "."
        ? BigInt(
            (
              parseFloat(inputFieldValue) * Math.pow(10, inputToken.decimals)
            ).toFixed(0) // Convert based on decimals
          )
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
      <h6 style={{ marginTop: "10px", marginBottom: "10px", color: "#999" }}>
        {`There is a one-way fee of ${bigintToFloatString(
          extraFee,
          inputToken.decimals
        )} ${inputToken.ticker} to swap to ${outputToken.ticker}`}
      </h6>
      {inputToken.ledgerBalance <= minimumTransactionAmount ? (
        <>
          <div>
            {`You need at least ${bigintToFloatString(
              minimumTransactionAmount,
              inputToken.decimals
            )} $${inputToken.ticker} to swap to $${outputToken.ticker}`}
          </div>
        </>
      ) : (
        <></>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
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
                    inputToken.decimals
                  )} ${inputToken.ticker} to swap.`
                : ""
            }
            error={textFieldErrored}
            disabled={loading}
            slotProps={{
              input: {
                inputMode: "decimal", // Helps show the numeric pad with decimal on mobile devices
              },
            }}
            style={{ width: "200px", minHeight: "84px" }} // Set a fixed width or use a percentage
          />
        </div>
        <div style={{ height: "100%", paddingLeft: "2px" }}>
          <button
            onClick={handleMint}
            disabled={loading || buttonDisabled}
            style={{
              height: "56px", // Match this with TextField's height
              width: "200px", // Set the same width as TextField
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="bobButton"
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
