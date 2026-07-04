import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/admin', icon: '📊', label: 'Dashboard' },
    { to: '/admin/users', icon: '👥', label: 'Userlist\nManagement' },
    { to: '/admin/projects', icon: '📁', label: 'Project\nManagement' },
    { to: '/admin/profile', icon: '👤', label: 'My Profile' },
  ];

  const userLinks = [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/projects', icon: '📁', label: 'Projects' },
    { to: '/profile', icon: '👤', label: 'My Profile' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer-sidebar" id="drawer-sidebar">
        <div className="drawer-header">
          <span className="drawer-header-text">
            Welcome <span>{user?.role === 'admin' ? 'admin' : (user?.username || user?.name)}</span>
          </span>
          <button className="drawer-close" onClick={onClose} id="btn-drawer-close">✕</button>
        </div>

        <nav className="drawer-nav">
          {links.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin' || to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) => `drawer-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="drawer-nav-icon">{icon}</span>
              {label.split('\n').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </NavLink>
          ))}
        </nav>

        <div className="drawer-footer">
          <div className="drawer-user-info">
            <div className="drawer-user-avatar">{initials}</div>
            <div>
              <div className="drawer-user-name">{user?.name}</div>
              <div className="drawer-user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
