import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1.5rem',
      background: 'var(--bg-primary)',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '6rem', lineHeight: 1 }}>🔍</div>
      <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--purple-light)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} id="btn-go-back">
          ← Go Back
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/')} id="btn-go-home">
          Go Home
        </button>
      </div>
    </div>
  );
}
