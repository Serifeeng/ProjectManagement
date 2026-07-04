import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-header" id="top-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onMenuToggle} id="btn-hamburger" aria-label="Toggle menu">
          ☰
        </button>
        <span className="header-welcome">
          Welcome <span>{user?.role === 'admin' ? 'admin' : user?.name}</span>
        </span>
      </div>
      <div className="header-right">
        <button className="header-logout" onClick={handleLogout} id="btn-header-logout" title="Sign out">
          ⏻
        </button>
      </div>
    </header>
  );
}
