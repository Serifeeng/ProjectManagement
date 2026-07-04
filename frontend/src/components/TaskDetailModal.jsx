import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TaskDetailModal({ taskId, onClose, onRefresh }) {
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${taskId}`);
      setTask(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/tasks/${taskId}/comment`, { text: comment });
      setTask(res.data);
      setComment('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <p>Loading task details...</p>
      </div>
    </div>
  );

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal task-detail-modal glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-title">{task.title}</span>
            <div style={{ marginTop: '0.25rem' }}>
              <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="task-description-box">
          {task.description || 'No description provided.'}
        </div>

        <div className="comments-section">
          <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Activity & Comments</h4>
          
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-user">{c.user?.name || 'Unknown'}</span>
                    <span className="comment-date">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="comment-text">{c.text}</div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem' }}>
                No comments yet. Start the conversation!
              </p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="comment-input-group">
            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !comment.trim()}>
              {submitting ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
