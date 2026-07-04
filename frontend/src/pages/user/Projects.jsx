import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

/* ─────────────────────────────────────────
   Task Detail Modal
   - Assigned user sees: title, description, Started/Finish/Status + status CHANGE dropdown
   - Non-assigned user sees: same but WITHOUT change controls (read-only)
   ───────────────────────────────────────── */
function TaskDetailModal({ task, currentUserId, onStatusChange, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState(task.status);
  const isOwner = String(task.assignedTo?._id || task.assignedTo) === String(currentUserId);

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  const statusLabel = (s) => {
    if (s === 'in_progress') return 'In Progress';
    if (s === 'completed') return 'Completed';
    return 'Pending';
  };

  const statusColor = (s) => {
    if (s === 'in_progress') return 'var(--warning)';
    if (s === 'completed') return 'var(--success)';
    return 'var(--text-secondary)';
  };

  const handleChange = () => {
    if (selectedStatus !== task.status) {
      onStatusChange(task._id, selectedStatus);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={onClose}>
      <div className="task-split-modal" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close task-split-close" onClick={onClose}>✕</button>

        {/* LEFT: title + description */}
        <div className="task-split-left">
          <div className="task-split-title">{task.title}</div>
          <div className="task-split-desc-label">Description:</div>
          <div className="task-split-desc">{task.description || 'No description provided.'}</div>
        </div>

        {/* RIGHT: meta + optional status change */}
        <div className="task-split-right">
          <div className="task-split-meta">
            <div className="task-split-meta-row">
              <span className="task-split-meta-label">Started Time:</span>
              <span className="task-split-meta-value">{formatDate(task.startedAt)}</span>
            </div>
            <div className="task-split-meta-row">
              <span className="task-split-meta-label">Finish Time:</span>
              <span className="task-split-meta-value">{formatDate(task.finishedAt)}</span>
            </div>
            <div className="task-split-meta-row">
              <span className="task-split-meta-label">Status:</span>
              <span style={{ color: statusColor(task.status), fontWeight: 600, fontSize: '0.85rem' }}>
                {statusLabel(task.status)}
              </span>
            </div>
          </div>

          {/* Only show CHANGE controls if the user owns this task */}
          {isOwner && (
            <div className="task-split-change-row">
              <select
                className="task-split-select"
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button className="task-split-change-btn" onClick={handleChange}>
                CHANGE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Summarylist Panel (full-page overlay)
   Columns: Summary, Description, Status, Details (opens task detail modal)
   ───────────────────────────────────────── */
function SummaryListPanel({ project, currentUserId, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    const res = await api.get(`/tasks/project/${project._id}`);
    setTasks(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      // Update task in local state
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
      if (selectedTask?._id === taskId) {
        setSelectedTask(prev => ({ ...prev, status }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusLabel = (s) => {
    if (s === 'pending') return 'Open';
    if (s === 'in_progress') return 'In Progress';
    return 'Completed';
  };

  const statusColor = (s) => {
    if (s === 'pending') return 'var(--success)';
    if (s === 'in_progress') return 'var(--warning)';
    return '#a78bfa';
  };

  if (loading) return (
    <div className="user-summary-overlay">
      <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>Loading…</p>
    </div>
  );

  return (
    <div className="user-summary-overlay">
      <div className="user-summary-panel">
        <div className="user-summary-header">
          <h2 className="user-summary-title">Summarylist</h2>
          <button className="user-summary-close" onClick={onClose} id="btn-close-summarylist">✕</button>
        </div>

        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Summary</th>
                <th>Description</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No summaries for this project.
                  </td>
                </tr>
              ) : tasks.map(t => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.description || '—'}
                  </td>
                  <td>
                    <span style={{ color: statusColor(t.status), fontWeight: 600, fontSize: '0.85rem' }}>
                      {statusLabel(t.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="user-details-btn"
                      id={`btn-task-detail-${t._id}`}
                      onClick={() => setSelectedTask(t)}
                      title="View details"
                    >📁</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          currentUserId={currentUserId}
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN UserProjects — Project List table
   Columns: Number, Project Name, Details
   ───────────────────────────────────────── */
export default function UserProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryProject, setSummaryProject] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="user-page-title">Projects</h2>
      </div>

      <div className="user-project-table-card">
        <table className="user-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Project Name</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  You have not been assigned to any projects yet.
                </td>
              </tr>
            ) : projects.map((p, idx) => (
              <tr key={p._id}>
                <td>{idx + 1}</td>
                <td>{p.title}</td>
                <td>
                  <button
                    className="user-details-btn"
                    id={`btn-project-detail-${p._id}`}
                    onClick={() => setSummaryProject(p)}
                    title="View project summaries"
                  >📁</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {summaryProject && (
        <SummaryListPanel
          project={summaryProject}
          currentUserId={user?._id}
          onClose={() => setSummaryProject(null)}
        />
      )}
    </div>
  );
}
