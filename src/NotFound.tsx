import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <div className="egg-section">
        <h2>You're not supposed to be here traveller</h2>
        <footer>
          <Link to="/">
            <button>Back to Home</button>
          </Link>
        </footer>
      </div>
    </>
  );
};

export default NotFound;
