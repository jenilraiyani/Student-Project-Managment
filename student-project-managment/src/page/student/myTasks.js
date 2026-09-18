import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const MyTasks = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.userId) fetchMyTasks();
  }, [currentUser?.userId]);

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };
      const [allocRes, taskRes] = await Promise.all([
        fetch('https://localhost:7089/api/ProjectAllocation', { headers }),
        fetch('https://localhost:7089/api/Task', { headers })
      ]);

      let allocs = [];
      let allTasks = [];
      if (allocRes.ok) {
        const json = await allocRes.json();
        allocs = json.data || json.Data || [];
      }
      if (taskRes.ok) {
        const json = await taskRes.json();
        allTasks = json.data || json.Data || [];
      }

      const myId = Number(currentUser.userId);
      const myAllocIds = new Set(
        allocs.filter(a => Number(a.studentID) === myId).map(a => a.projectAllocationID)
      );

      const mapped = allTasks
        .filter(t => myAllocIds.has(t.projectAllocationID))
        .map(t => {
          const alloc = allocs.find(a => a.projectAllocationID === t.projectAllocationID);
          return {
            id: t.taskID,
            title: t.taskTitle,
            project: alloc?.projectTitle || `Alloc #${t.projectAllocationID}`,
            status: t.taskStatusName || 'Pending',
            priority: t.taskPriorityName || 'Medium',
            dueDate: t.taskDueDate ? new Date(t.taskDueDate).toLocaleDateString() : 'N/A',
            progress: t.progressPercentage || 0,
            earnedScore: t.earnedScore || 0,
            assignedScore: t.assignedScore || 0,
            facultyRemarks: t.facultyRemarks || ''
          };
        });

      setTasks(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('complete')) return 'status-completed';
    if (s.includes('progress')) return 'status-inprogress';
    return 'status-pending';
  };

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-4 text-center">Loading your tasks...</div>;

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>My Tasks</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><span className="text-muted">Home</span></li>
                <li className="breadcrumb-item active fw-semibold">My Tasks</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control shadow-none border-0 shadow-sm"
            style={{ maxWidth: '350px', borderRadius: '8px', padding: '10px 15px' }}
            placeholder="Search my tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="card spms-premium-card border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="text-muted fw-bold text-uppercase small">Task</th>
                    <th className="text-muted fw-bold text-uppercase small">Project</th>
                    <th className="text-muted fw-bold text-uppercase small">Priority</th>
                    <th className="text-muted fw-bold text-uppercase small">Status</th>
                    <th className="text-muted fw-bold text-uppercase small">Due Date</th>
                    <th className="text-muted fw-bold text-uppercase small">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map(t => (
                    <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/task-detail?id=${t.id}`)}>
                      <td><span className="fw-bold text-dark">{t.title}</span></td>
                      <td className="text-secondary small fw-semibold">{t.project}</td>
                      <td><span className="task-badge">{t.priority}</span></td>
                      <td><span className={`task-badge ${getStatusClass(t.status)}`}>{t.status}</span></td>
                      <td className="text-secondary small">{t.dueDate}</td>
                      <td className="small fw-bold">
                        {t.earnedScore > 0 ? `${t.earnedScore}/${t.assignedScore}` : `--/${t.assignedScore}`}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">No tasks assigned to you yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .spms-premium-card {
          border-radius: 12px; background: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border-top: 4px solid #6B5CA5 !important;
        }
        .task-badge {
          padding: 4px 10px; border-radius: 6px; font-size: 0.70rem;
          font-weight: 700; text-transform: uppercase; border: 1px solid #E2E8F0;
          background: #F8FAFC; color: #64748B;
        }
        .status-completed { background: rgba(32,201,151,0.1); color: #17a57a; border-color: rgba(32,201,151,0.2); }
        .status-inprogress { background: rgba(107,92,165,0.1); color: #6B5CA5; border-color: rgba(107,92,165,0.2); }
        .status-pending { background: rgba(245,158,11,0.1); color: #F59E0B; border-color: rgba(245,158,11,0.2); }
      `}</style>
    </>
  );
};

export default MyTasks;
