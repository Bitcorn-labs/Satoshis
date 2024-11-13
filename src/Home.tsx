import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

interface HomeProps {
  totalInputTokenHeld: string;
}

const Home: React.FC<HomeProps> = ({ totalInputTokenHeld }) => {
  return (
    <div>
      <div>
        <p>
          {`Total Satoshi's converted to $sats: ${(
            <span>
              {totalInputTokenHeld !== "" ? (
                totalInputTokenHeld
              ) : (
                <>
                  <CircularProgress size={16} />
                </>
              )}
            </span>
          )}`}
        </p>
        <section id="introduction" className="content-box">
          <h2>Introduction to Bitcoin</h2>
          {/* Image placeholder */}
          <img
            src="bitcoin-image.jpg"
            alt="Bitcoin Image"
            className="content-image"
          />
          <p>
            Bitcoin is a decentralized digital currency created in 2009 by an
            anonymous person or group known as Satoshi Nakamoto. It allows
            secure, peer-to-peer transactions without the need for banks or
            intermediaries.
          </p>
        </section>

        <section id="why-bitcoin" className="content-box">
          <h2>Why Bitcoin Matters</h2>
          <p>
            Bitcoin represents financial freedom, transparency, and a hedge
            against inflation. With its limited supply, it’s designed to be a
            deflationary asset, unlike traditional fiat currencies.
          </p>
        </section>

        <section id="how-bitcoin-works" className="content-box">
          <h2>How Bitcoin Works</h2>
          <p>
            Bitcoin transactions are stored on a decentralized ledger known as
            the blockchain, ensuring security and transparency. Every
            transaction is verified by a network of nodes through cryptographic
            techniques.
          </p>
        </section>

        <section id="internet-computer" className="content-box">
          <h2>The Internet Computer</h2>
          <p>
            The Internet Computer is a decentralized blockchain network that
            allows users to build applications at scale, using smart contracts
            on the web. Its integration with Bitcoin allows for direct Bitcoin
            transactions without intermediaries, enhancing privacy and control.
          </p>
        </section>

        <section id="chain-key-tech" className="content-box">
          <h2>Chain Key Technology</h2>
          <p>
            Chain Key Technology is a breakthrough innovation that allows the
            Internet Computer to control Bitcoin directly. It achieves this
            through cryptographic signatures, enabling secure and efficient
            transactions that integrate Bitcoin into web-based applications.
          </p>
        </section>

        <Link to="/swap">
          <button>Swap your bitcoin for Satoshi's (Ticker: SATS)</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bitcoin, Corntoshis Vision</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon"> <!-- Favicon placeholder -->
</head>
<body>
    

    <main>
        
    </main>

    <footer>
        <p>&copy; 2024 Bitcoin, Corntoshis Vision. All Rights Reserved.</p>
        <p>Disclaimer: The information provided here is for educational purposes only. Always conduct thorough financial research and consult with a financial advisor before investing in any cryptocurrency.</p>
    </footer>
</body>
</html>

*/
