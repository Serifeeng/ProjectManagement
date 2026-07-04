import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projectsCount: 0, users: 0, tasks: 0, completed: 0 });
  const [projects, setProjects] = useState([]);
  const [tasksByProject, setTasksByProject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, uRes, tRes] = await Promise.all([
          api.get('/projects'),
          api.get('/users'),
          api.get('/tasks/all'),
        ]);

        setProjects(pRes.data);
        setStats({
          projectsCount: pRes.data.length,
          users: uRes.data.length,
          tasks: tRes.data.length,
          completed: tRes.data.filter(t => t.status === 'completed').length,
        });

        const taskMap = {};
        await Promise.all(pRes.data.map(async (p) => {
          const ptRes = await api.get(`/tasks/project/${p._id}`);
          taskMap[p._id] = ptRes.data;
        }));
        setTasksByProject(taskMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-subtitle">Workspace overview and project performance</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon purple">📁</div>
          <div>
            <div className="stat-value">{stats.projectsCount}</div>
            <div className="stat-label">Total Projects</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon green">👥</div>
          <div>
            <div className="stat-value">{stats.users}</div>
            <div className="stat-label">Team Members</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon yellow">📋</div>
          <div>
            <div className="stat-value">{stats.tasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed Tasks</div>
          </div>
        </div>
      </div>

      <div className="card glass">
        <div className="card-header">
          <span className="card-title">Project Performance</span>
        </div>
        {projects.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No projects yet. Create one from the Projects page.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Progress</th>
                  <th>Members</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => {
                  const pTasks = tasksByProject[p._id] || [];
                  const completedTasks = pTasks.filter(t => t.status === 'completed').length;
                  const totalTasks = pTasks.length;
                  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                  return (
                    <tr key={p._id}>
                      <td style={{ minWidth: '200px' }}>
                        <div style={{ fontWeight: 600 }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{totalTasks} tasks total</div>
                      </td>
                      <td style={{ width: '40%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="progress-container" style={{ flex: 1, marginTop: 0 }}>
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', width: '35px' }}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.9rem' }}>👥</span>
                          <span>{p.assignedUsers?.length || 0}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${progress === 100 ? 'badge-completed' : 'badge-in_progress'}`}>
                          {progress === 100 ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
