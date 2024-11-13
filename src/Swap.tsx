import TokenObject from "./utils/TokenObject";
import bigintToFloatString from "./utils/bigIntToFloatString";
import SwapFields from "./components/SwapFields";
import { useEffect, useRef } from "react";

interface SwapProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  isConnected: boolean;
  inputTokenObject: TokenObject;
  outputTokenObject: TokenObject;
  tokens: TokenObject[]; // Array of tokens
  setIsConnected: (value: boolean) => void;
  connectionType: string;
  setConnectionType: (value: string) => void;
  loggedInPrincipal: string;
  setLoggedInPrincipal: (value: string) => void;
}

const Swap: React.FC<SwapProps> = ({
  loading,
  setLoading,
  isConnected,
  inputTokenObject,
  outputTokenObject,
  setIsConnected,
  connectionType,
  setConnectionType,
  loggedInPrincipal,
  setLoggedInPrincipal,
}) => {
  const targetSection = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Scroll to the referenced element
    if (targetSection.current) {
      targetSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <>
      <div ref={targetSection}>
        <p>
          {!isConnected ? (
            <>{`Connect your wallet to see how many satoshi's you have.`}</>
          ) : (
            <>
              {`You have ${(
                <span>
                  {` ${bigintToFloatString(
                    outputTokenObject.ledgerBalance,
                    outputTokenObject.decimals
                  )} `}
                </span>
              )} satoshi's.`}
            </>
          )}
        </p>
        <div className="swap-fields">
          <SwapFields
            loading={loading}
            setLoading={setLoading}
            isConnected={isConnected}
            inputTokenObject={inputTokenObject}
            outputTokenObject={outputTokenObject}
          />
        </div>
      </div>
    </>
  );
};

export default Swap;
