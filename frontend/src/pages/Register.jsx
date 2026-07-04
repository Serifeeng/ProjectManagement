import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-card glass" style={{ textAlign: 'center' }}>
        <div className="login-logo">
          <div className="login-logo-icon">⚡</div>
          <h1>TaskFlow</h1>
        </div>

        <h2 className="login-heading">Register</h2>
        <p className="login-subheading" style={{ marginBottom: '2rem' }}>
          Registration is currently by invitation only.
        </p>

        <div className="coming-soon-badge">
          <span>COMING SOON</span>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Go to Login
          </Link>
          <Link to="/" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
            Back to Home
          </Link>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Contact your administrator to request an account.
        </p>
      </div>
    </div>
  );
}
