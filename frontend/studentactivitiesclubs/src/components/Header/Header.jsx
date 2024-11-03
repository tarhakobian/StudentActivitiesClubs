import { Link } from 'react-router-dom';
import "./Header.css"

function Header({ title }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
      <h1>{title}</h1>
      <Link to="/signin">
        <button>Sign In</button>
      </Link>
    </header>
  );
}

export default Header;