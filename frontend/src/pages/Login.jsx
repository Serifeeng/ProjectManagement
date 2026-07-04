import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        identifier: form.identifier,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-card">
        <h2 className="login-heading">Log in</h2>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="login-form-group">
            <label htmlFor="identifier">User Name</label>
            <input
              id="identifier"
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="User Name"
              required
              autoComplete="username"
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="show-password-row">
            <label htmlFor="show-password">Show Password</label>
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
          </div>

          <div className="login-submit-row">
            <button
              type="submit"
              className="login-submit-btn"
              id="btn-login"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'S U B M I T'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
