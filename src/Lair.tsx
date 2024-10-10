import { Link } from 'react-router-dom';
const Lair = () => {
  return (
    <>
      <div className="banner">~~~the dragons lair~~~</div>
      <div className="egg-section">
        <h2>⚔️🥚🐉🧙‍♀️🧙🏼‍♀️🧙🏽‍♀️🐉🥚⚔️</h2>
        <iframe
          src="https://oc.app/community/x2nco-2qaaa-aaaaf-bm6qq-cai"
          sandbox=""
          style={{ width: '100%', height: '800px', border: 'none' }}
          allowFullScreen
        ></iframe>
      </div>
      <div className="egg-section">
        <Link to="/">
          <button>HOME</button>
        </Link>
      </div>
    </>
  );
};

export default Lair;
