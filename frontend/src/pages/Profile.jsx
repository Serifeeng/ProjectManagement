import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Profile() {
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [nameForm, setNameForm] = useState({ name: user?.name || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!nameForm.name.trim()) return;
    setLoadingName(true);
    try {
      const res = await api.put('/auth/me', { name: nameForm.name });
      // Update stored user
      const updatedUser = { ...user, name: res.data.name };
      login(updatedUser, localStorage.getItem('token'));
      toast.success('Name updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name');
    } finally {
      setLoadingName(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoadingPass(true);
    try {
      await api.put('/auth/me/password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">My Profile</h2>
          <p className="page-subtitle">Manage your account details</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem', flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>@{user?.username || user?.email}</div>
          <div style={{ marginTop: '0.4rem' }}>
            <span className={`badge badge-${user?.role}`}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Edit Name */}
      <div className="card glass" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--purple-light)' }}>
          Edit Display Name
        </h3>
        <form onSubmit={handleNameSave}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              id="profile-name"
              value={nameForm.name}
              onChange={e => setNameForm({ name: e.target.value })}
              placeholder="Your full name"
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" id="btn-save-name" disabled={loadingName}>
              {loadingName ? 'Saving…' : 'Save Name'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card glass">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--purple-light)' }}>
          Change Password
        </h3>
        <form onSubmit={handlePasswordSave}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              id="current-password"
              type="password"
              value={passForm.currentPassword}
              onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
              placeholder="Current password"
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              id="new-password"
              type="password"
              value={passForm.newPassword}
              onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
              placeholder="New password (min 6 chars)"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              value={passForm.confirmPassword}
              onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" id="btn-save-password" disabled={loadingPass}>
              {loadingPass ? 'Saving…' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
