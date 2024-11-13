import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div>
        <h2>404 - NOT FOUND</h2>
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
