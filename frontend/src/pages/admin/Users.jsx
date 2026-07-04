import { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

/**
 * Modal for adding or editing a user.
 */
function UserModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    username: user?.username || '',
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{user ? 'EDIT USER' : 'ADD USER'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} id="user-form">
          <div className="form-group">
            <label>UserName*</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="UserName*" required />
          </div>
          <div className="form-group">
            <label>Name*</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name*" required />
          </div>
          <div className="form-group">
            <label>{user ? 'New Password (leave blank to keep)' : 'Password*'}</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password*" required={!user} />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email*" required />
          </div>
          <div className="form-group">
            <label>IsAdmin</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">false</option>
              <option value="admin">true</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="btn-save-user">
              {user ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Confirmation modal for user deletion.
 */
function DeleteConfirmModal({ username, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <p className="confirm-modal-text">
          Are you sure you want to delete <strong>{username}</strong>?
        </p>
        <div className="confirm-modal-actions">
          <button className="confirm-btn confirm-btn-no" onClick={onCancel}>No</button>
          <button className="confirm-btn confirm-btn-yes" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    api.get('/users').then(res => setUsers(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  // Client-side search filter
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      (u.username || '').toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleSave = async (form) => {
    try {
      if (modal?._id) {
        await api.put(`/users/${modal._id}`, form);
        toast.success('User updated successfully!');
      } else {
        await api.post('/users', form);
        toast.success('User created successfully!');
      }
      setModal(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      toast.success(`User "${deleteTarget.username || deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
      setDeleteTarget(null);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Userlist Management</h2>
          <p className="page-subtitle">{users.length} total user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" id="btn-new-user" onClick={() => setModal({})}>
          Add New User +
        </button>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
        <input
          id="search-users"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by username, name or email…"
          style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Mail</th>
                <th>IsAdmin</th>
                <th style={{ textAlign: 'right' }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    {search ? 'No users match your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : filteredUsers.map((u, index) => (
                <tr key={u._id}>
                  <td style={{ color: 'var(--text-secondary)' }}>{index + 1}</td>
                  <td>{u.username || '—'}</td>
                  <td>{u.name}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </td>
                  <td>
                    <span className={`badge badge-${u.role}`}>
                      {u.role === 'admin' ? 'true' : 'false'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button className="action-btn" id={`btn-edit-user-${u._id}`} onClick={() => setModal(u)} title="Edit user">✏️</button>
                      <button className="action-btn danger" id={`btn-delete-user-${u._id}`} onClick={() => setDeleteTarget(u)} title="Delete user">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== null && (
        <UserModal user={modal?._id ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          username={deleteTarget.username || deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
