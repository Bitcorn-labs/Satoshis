import { Link } from 'react-router-dom';
import GroupPhoto from './components/GroupPhoto';
import { CircularProgress } from '@mui/material';

interface HomeProps {
  totalInputTokenHeld: string;
}

const Home: React.FC<HomeProps> = ({ totalInputTokenHeld }) => {
  return (
    <div>
      <div className="egg-section">
        <h2>Split Your BTC into 100,000,000 satoshis and back</h2>
        <p>
          users have sent{' '}
          <span id="eggsSent">
            {totalInputTokenHeld !== '' ? (
              totalInputTokenHeld
            ) : (
              <>
                <CircularProgress size={16} />
              </>
            )}
          </span>{' '}
          Bitcoin to this Canister
        </p>
        <Link to="/keep">
          <button>create Satoshis</button>
        </Link>

      </div>
      <GroupPhoto />
    </div>
  );
};

export default Home;
