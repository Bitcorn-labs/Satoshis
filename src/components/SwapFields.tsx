import TokenObject from "../utils/TokenObject";
import bigintToFloatString from "../utils/bigIntToFloatString";
import BackendMintingField from "./BackendMintingField";
import BackendWithdrawField from "./BackendWithdrawField";

interface SwapFieldsProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
  inputTokenObject: TokenObject;
  outputTokenObject: TokenObject;
}

const SwapFields: React.FC<SwapFieldsProps> = ({
  loading,
  setLoading,
  isConnected,
  inputTokenObject,
  outputTokenObject,
}) => {
  return (
    <>
      {isConnected ? (
        <>
          <div
            style={{
              border: "3px solid lightgrey",
              padding: "10px",
              width: "100%",
            }}
          >
            <h2>{`Convert ${inputTokenObject.ticker}:`}</h2>
            <h3>{`$${inputTokenObject.ticker} Balance: ${bigintToFloatString(
              inputTokenObject.ledgerBalance,
              inputTokenObject.decimals
            )}`}</h3>
            <BackendMintingField
              inputToken={inputTokenObject}
              outputToken={outputTokenObject}
              loading={loading}
              setLoading={setLoading}
              isConnected={isConnected}
            />

            <p></p>
          </div>
          <div
            style={{
              border: "3px solid lightgrey",
              padding: "10px",
              width: "100%",
              marginTop: "16px",
            }}
          >
            <h2>{`Convert ${outputTokenObject.ticker}:`}</h2>
            <h3>
              {`$${outputTokenObject.ticker} Balance: `}
              {bigintToFloatString(
                outputTokenObject.ledgerBalance,
                outputTokenObject.decimals
              )}
            </h3>
            <BackendWithdrawField
              inputToken={inputTokenObject}
              outputToken={outputTokenObject}
              loading={loading}
              setLoading={setLoading}
              isConnected={isConnected}
            />
          </div>
        </>
      ) : (
        <>Please connect your wallet to use this feature.</>
      )}
    </>
  );
};

export default SwapFields;
