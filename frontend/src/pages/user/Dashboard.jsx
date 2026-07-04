import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function UserDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasksByProject, setTasksByProject] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const pRes = await api.get('/projects');
      setProjects(pRes.data);
      const taskMap = {};
      await Promise.all(pRes.data.map(async (p) => {
        const tRes = await api.get(`/tasks/project/${p._id}`);
        taskMap[p._id] = tRes.data;
      }));
      setTasksByProject(taskMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // All my tasks across all projects
  const myTasksList = Object.values(tasksByProject).flat().filter(
    t => String(t.assignedTo?._id || t.assignedTo) === String(user?._id)
  );
  const completed = myTasksList.filter(t => t.status === 'completed').length;

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">My Dashboard</h2>
          <p className="page-subtitle">Welcome back, {user?.name || user?.username}!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon purple">📁</div>
          <div>
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Assigned Projects</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon yellow">📋</div>
          <div>
            <div className="stat-value">{myTasksList.length}</div>
            <div className="stat-label">My Tasks</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon red">⏳</div>
          <div>
            <div className="stat-value">{myTasksList.length - completed}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>

      {/* Project progress overview */}
      {projects.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.map(p => {
            const pTasks = tasksByProject[p._id] || [];
            const completedCount = pTasks.filter(t => t.status === 'completed').length;
            const totalCount = pTasks.length;
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            const mine = pTasks.filter(t => String(t.assignedTo?._id || t.assignedTo) === String(user?._id));

            return (
              <div key={p._id} className="card glass">
                <div className="card-header">
                  <span className="card-title">📁 {p.title}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {completedCount}/{totalCount} tasks completed
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                {mine.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      My Tasks ({mine.length})
                    </div>
                    <div className="task-list">
                      {mine.map(t => (
                        <div key={t._id} className="task-item" style={{ cursor: 'default' }}>
                          <div className="task-info">
                            <div className="task-title">{t.title}</div>
                          </div>
                          <span className={`badge badge-${t.status}`}>
                            {t.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {pTasks.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No tasks in this project yet.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {projects.length === 0 && (
        <div className="card glass" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <p>You have no assigned projects yet.</p>
        </div>
      )}
    </div>
  );
}
