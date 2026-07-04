import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

/* ─────────────────────────────────────────
   ADD PROJECT modal  (screenshot: ADD PROJECT)
   Fields: ID (read-only auto), Project Name, User dropdown
   ───────────────────────────────────────── */
function AddProjectModal({ users, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', assignedUsers: [] });
  const [selectedUser, setSelectedUser] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddUser = () => {
    if (!selectedUser || form.assignedUsers.includes(selectedUser)) return;
    setForm(f => ({ ...f, assignedUsers: [...f.assignedUsers, selectedUser] }));
    setSelectedUser('');
  };

  const handleRemoveUser = (id) => {
    setForm(f => ({ ...f, assignedUsers: f.assignedUsers.filter(u => u !== id) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title: form.title, assignedUsers: form.assignedUsers });
  };

  const nonAdminUsers = users.filter(u => u.role !== 'admin');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="proj-modal" onClick={e => e.stopPropagation()}>
        <div className="proj-modal-header">
          <span className="proj-modal-title">ADD PROJECT</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} id="project-form">
          <input
            className="proj-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project Name"
            required
          />
          <div className="proj-user-row">
            <label className="proj-label">User:</label>
            <select
              className="proj-select-inline"
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
            >
              <option value="">Choose one ▾</option>
              {nonAdminUsers.map(u => (
                <option key={u._id} value={u._id}>{u.username || u.name}</option>
              ))}
            </select>
            <button type="button" className="proj-add-user-btn" onClick={handleAddUser}>+</button>
          </div>
          {form.assignedUsers.length > 0 && (
            <div className="proj-assigned-list">
              {form.assignedUsers.map(uid => {
                const u = users.find(u => u._id === uid);
                return (
                  <div key={uid} className="proj-assigned-item">
                    <span>{u?.username || u?.name || uid}</span>
                    <button type="button" className="proj-remove-user" onClick={() => handleRemoveUser(uid)}>🗑️</button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="proj-modal-footer">
            <button type="button" className="proj-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="proj-btn-add" id="btn-save-project">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROJECT EDIT modal  (screenshot: PROJECT EDIT)
   Fields: Project Name, ADD USER section (dropdown + button, table with id/Name/Delete)
   ───────────────────────────────────────── */
function EditProjectModal({ project, users, onSave, onClose }) {
  const [title, setTitle] = useState(project?.title || '');
  const [assignedUsers, setAssignedUsers] = useState(
    project?.assignedUsers?.map(u => u._id || u) || []
  );
  const [selectedUser, setSelectedUser] = useState('');

  const handleAddUser = () => {
    if (!selectedUser || assignedUsers.includes(selectedUser)) return;
    setAssignedUsers(prev => [...prev, selectedUser]);
    setSelectedUser('');
  };

  const handleRemoveUser = (id) => {
    setAssignedUsers(prev => prev.filter(u => u !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, assignedUsers });
  };

  const nonAdminUsers = users.filter(u => u.role !== 'admin');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="proj-modal" onClick={e => e.stopPropagation()}>
        <div className="proj-modal-header">
          <span className="proj-modal-title">PROJECT EDIT</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} id="project-edit-form">
          <label className="proj-label">Project Name</label>
          <input
            className="proj-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <div style={{ marginTop: '1rem' }}>
            <label className="proj-label" style={{ marginBottom: '0.5rem', display: 'block' }}>ADD USER</label>
            <div className="proj-user-row">
              <select
                className="proj-select-inline"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
              >
                <option value="">Choose One ▾</option>
                {nonAdminUsers.map(u => (
                  <option key={u._id} value={u._id}>{u.username || u.name}</option>
                ))}
              </select>
              <button type="button" className="proj-add-user-btn" onClick={handleAddUser}>+</button>
            </div>

            {assignedUsers.length > 0 && (
              <table className="proj-users-table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Name</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedUsers.map((uid, idx) => {
                    const u = users.find(u => u._id === uid);
                    return (
                      <tr key={uid}>
                        <td>{idx + 1}</td>
                        <td>{u?.username || u?.name || '—'}</td>
                        <td>
                          <button
                            type="button"
                            className="proj-remove-icon"
                            onClick={() => handleRemoveUser(uid)}
                          >🗑️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="proj-modal-footer">
            <button type="button" className="proj-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="proj-btn-confirm" id="btn-confirm-project">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUMMARY (Task) LIST  (screenshot: Admin-Summary Listesi Ekranı)
   Columns: ID, USER, SUMMARY, DESCRIPTION, STATUS, STARTED, FINISH, EDIT
   ───────────────────────────────────────── */
function SummaryList({ project, users, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryModal, setSummaryModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTasks = async () => {
    const res = await api.get(`/tasks/project/${project._id}`);
    setTasks(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSave = async (form) => {
    try {
      if (summaryModal?._id) {
        await api.put(`/tasks/${summaryModal._id}`, form);
      } else {
        await api.post('/tasks', { ...form, projectId: project._id });
      }
      setSummaryModal(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    await api.delete(`/tasks/${deleteTarget._id}`);
    setDeleteTarget(null);
    fetchTasks();
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  if (loading) return (
    <div className="summary-overlay">
      <div className="summary-panel">
        <p style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading…</p>
      </div>
    </div>
  );

  return (
    <div className="summary-overlay">
      <div className="summary-panel">
        <div className="summary-panel-header">
          <h2 className="summary-panel-title">{project.title}</h2>
          <button className="modal-close summary-close-btn" onClick={onClose} id="btn-close-summary">✕</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            className="btn btn-primary"
            id="btn-add-summary"
            onClick={() => setSummaryModal({})}
          >
            Add summary +
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>SUMMARY</th>
                  <th>DESCRIPTION</th>
                  <th>STATUS</th>
                  <th>STARTED</th>
                  <th>FINISH</th>
                  <th style={{ textAlign: 'right' }}>EDIT</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No summaries yet.
                    </td>
                  </tr>
                ) : tasks.map((t, idx) => (
                  <tr key={t._id}>
                    <td style={{ color: 'var(--text-secondary)' }}>{idx + 1}</td>
                    <td>{t.assignedTo?.name || t.assignedTo?.username || 'NULL'}</td>
                    <td style={{ fontWeight: 600 }}>{t.title}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.description ? `"${t.description.slice(0, 40)}${t.description.length > 40 ? '…' : ''}"` : '—'}
                    </td>
                    <td>
                      <span className={`status-text status-${t.status}`}>
                        {t.status === 'in_progress' ? 'Inprogress' : t.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(t.startedAt)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(t.finishedAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          className="action-btn"
                          id={`btn-edit-task-${t._id}`}
                          onClick={() => setSummaryModal(t)}
                        >✏️</button>
                        <button
                          className="action-btn danger"
                          id={`btn-delete-task-${t._id}`}
                          onClick={() => setDeleteTarget(t)}
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit/Add Summary Modal */}
      {summaryModal !== null && (
        <SummaryModal
          task={summaryModal?._id ? summaryModal : null}
          projectId={project._id}
          users={users}
          onSave={handleSave}
          onClose={() => setSummaryModal(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <p className="confirm-modal-text">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="confirm-modal-actions">
              <button className="confirm-btn confirm-btn-no" onClick={() => setDeleteTarget(null)}>No</button>
              <button className="confirm-btn confirm-btn-yes" onClick={handleDeleteConfirm}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SUMMARY EDIT/ADD modal  (screenshot: Admin-Summary Edit Ekranı)
   Fields: Summary, Description, Started Time, Finish Time, Status, User ID
   ───────────────────────────────────────── */
function SummaryModal({ task, projectId, users, onSave, onClose }) {
  const formatInputDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    startedAt: formatInputDate(task?.startedAt),
    finishedAt: formatInputDate(task?.finishedAt),
    status: task?.status || 'in_progress',
    assignedTo: task?.assignedTo?._id || task?.assignedTo || '',
    projectId: task?.projectId || projectId,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const parseDate = (str) => {
    if (!str) return undefined;
    const parts = str.split('.');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(str);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      startedAt: parseDate(form.startedAt),
      finishedAt: parseDate(form.finishedAt),
    };
    if (!payload.assignedTo) delete payload.assignedTo;
    onSave(payload);
  };

  const nonAdminUsers = users.filter(u => u.role !== 'admin');

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={onClose}>
      <div className="proj-modal" onClick={e => e.stopPropagation()}>
        <div className="proj-modal-header">
          <span className="proj-modal-title">{task ? 'EDIT SUMMARY' : 'ADD SUMMARY'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} id="summary-form">
          <div className="form-group">
            <label className="proj-label">Summary</label>
            <input className="proj-input" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="proj-label">Description</label>
            <textarea
              className="proj-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="form-group">
            <label className="proj-label">Started Time</label>
            <input
              className="proj-input"
              name="startedAt"
              value={form.startedAt}
              onChange={handleChange}
              placeholder="DD.MM.YYYY"
            />
          </div>
          <div className="form-group">
            <label className="proj-label">Finish Time</label>
            <input
              className="proj-input"
              name="finishedAt"
              value={form.finishedAt}
              onChange={handleChange}
              placeholder="DD.MM.YYYY"
            />
          </div>
          <div className="proj-user-row" style={{ marginBottom: '0.75rem' }}>
            <label className="proj-label" style={{ marginBottom: 0, marginRight: '0.5rem' }}>Status:</label>
            <select className="proj-select-inline" name="status" value={form.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in_progress">Inprogress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="proj-user-row">
            <label className="proj-label" style={{ marginBottom: 0, marginRight: '0.5rem' }}>User ID:</label>
            <select className="proj-select-inline" name="assignedTo" value={form.assignedTo} onChange={handleChange}>
              <option value="">Unassigned</option>
              {nonAdminUsers.map(u => (
                <option key={u._id} value={u._id}>{u.username || u.name}</option>
              ))}
            </select>
          </div>
          <div className="proj-modal-footer">
            <button type="button" className="proj-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="proj-btn-confirm" id="btn-save-summary">
              {task ? 'Add' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN AdminProjects component
   Shows: Projects List table (ID, PROJECT NAME, DETAILS, EDIT)
   ───────────────────────────────────────── */
export default function AdminProjects() {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [summaryProject, setSummaryProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchAll = async () => {
    const [pRes, uRes] = await Promise.all([api.get('/projects'), api.get('/users')]);
    setProjects(pRes.data);
    setUsers(uRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSaveNew = async (form) => {
    try {
      await api.post('/projects', form);
      toast.success('Project created successfully!');
      setAddModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleSaveEdit = async (form) => {
    try {
      await api.put(`/projects/${editModal._id}`, form);
      toast.success('Project updated successfully!');
      setEditModal(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/projects/${deleteTarget._id}`);
      toast.success(`Project "${deleteTarget.title}" deleted`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
    setDeleteTarget(null);
    fetchAll();
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Projects List</h2>
        <button className="btn btn-primary" id="btn-create-project" onClick={() => setAddModal(true)}>
          Create Project +
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>PROJECT NAME</th>
                <th>DETAILS</th>
                <th style={{ textAlign: 'right' }}>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No projects yet. Create your first!
                  </td>
                </tr>
              ) : projects.map((p, idx) => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-secondary)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{p.title}</td>
                  <td>
                    <button
                      className="action-btn"
                      id={`btn-details-${p._id}`}
                      onClick={() => setSummaryProject(p)}
                      title="View summaries"
                    >
                      📁
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        className="action-btn"
                        id={`btn-edit-project-${p._id}`}
                        onClick={() => setEditModal(p)}
                        title="Edit project"
                      >✏️</button>
                      <button
                        className="action-btn danger"
                        id={`btn-delete-project-${p._id}`}
                        onClick={() => setDeleteTarget(p)}
                        title="Delete project"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {addModal && (
        <AddProjectModal
          users={users}
          onSave={handleSaveNew}
          onClose={() => setAddModal(false)}
        />
      )}

      {/* Edit Project Modal */}
      {editModal && (
        <EditProjectModal
          project={editModal}
          users={users}
          onSave={handleSaveEdit}
          onClose={() => setEditModal(null)}
        />
      )}

      {/* Summary (Task) List Panel */}
      {summaryProject && (
        <SummaryList
          project={summaryProject}
          users={users}
          onClose={() => setSummaryProject(null)}
        />
      )}

      {/* Delete Project Confirm */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <p className="confirm-modal-text">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="confirm-modal-actions">
              <button className="confirm-btn confirm-btn-no" onClick={() => setDeleteTarget(null)}>No</button>
              <button className="confirm-btn confirm-btn-yes" onClick={handleDeleteConfirm}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
