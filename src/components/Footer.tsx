import TokenObject from "../utils/TokenObject";
import TokenManagement from "./TokenManagement";

interface FooterProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  tokens: TokenObject[]; // Array of tokens
  loggedInPrincipal: string;
  fetchBalances: () => void;
  isConnected: boolean;
}

const Footer: React.FC<FooterProps> = ({
  loading,
  setLoading,
  tokens,
  loggedInPrincipal,
  fetchBalances,
  isConnected,
}) => {
  return (
    <>
      <TokenManagement
        loading={loading}
        setLoading={setLoading}
        tokens={tokens}
        loggedInPrincipal={loggedInPrincipal}
        fetchBalances={fetchBalances}
        isConnected={isConnected}
      />
      <footer>
        <p>Powered by the Internet Computer</p>
        <p>&copy; 2024 Bitcoin, Corntoshis Vision. All Rights Reserved. </p>
        <p>
          Disclaimer: This site does not contain investment advice. All
          information found on this site can be inaccurate, and is presented for
          entertainment purposes only. No responsibility is accepted by this
          site for inaccurate information presented here. Engage with this
          website at your own risk and discretion. Always conduct your own
          research and consult with financial professionals before participating
          in any cryptocurrency activities
        </p>
        <p>
          <a href="https://bitcorn.dev/">bitcorn.dev</a>
        </p>
      </footer>
    </>
  );
};

export default Footer;
