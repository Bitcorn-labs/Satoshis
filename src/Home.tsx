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
        <h2>use karma points</h2>
        <p>
          Travlers have sent{' '}
          <span id="eggsSent">
            {totalInputTokenHeld !== '' ? (
              totalInputTokenHeld
            ) : (
              <>
                <CircularProgress size={16} />
              </>
            )}
          </span>{' '}
          dragon karma to this world.
        </p>
        <Link to="/keep">
          <button>Enter the Keep</button>
        </Link>

        <Link to="/lair">
          <button>Enter the Lair</button>
        </Link>

        <Link to="/game">
          <button>Enter the Luminescent Grove</button>
        </Link>
      </div>
      <GroupPhoto />
    </div>
  );
};

export default Home;
