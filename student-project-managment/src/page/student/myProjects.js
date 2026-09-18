import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const MyProjects = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.userId) fetchMyProjects();
  }, [currentUser?.userId]);

  const fetchMyProjects = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };
      const [allocRes, taskRes] = await Promise.all([
        fetch('https://student-project-managment.onrender.com/api/ProjectAllocation', { headers }),
        fetch('https://student-project-managment.onrender.com/api/Task', { headers })
      ]);

      let allocs = [];
      let tasks = [];
      if (allocRes.ok) {
        const json = await allocRes.json();
        allocs = json.data || json.Data || [];
      }
      if (taskRes.ok) {
        const json = await taskRes.json();
        tasks = json.data || json.Data || [];
      }

      const myId = Number(currentUser.userId);
      const myAllocs = allocs.filter(a => Number(a.studentID) === myId);

      const mapped = myAllocs.map(a => {
        const allocTasks = tasks.filter(t => t.projectAllocationID === a.projectAllocationID);
        const completed = allocTasks.filter(t => (t.taskStatusName || '').toLowerCase().includes('complete')).length;
        const progress = allocTasks.length
          ? Math.round(allocTasks.reduce((s, t) => s + (Number(t.progressPercentage) || 0), 0) / allocTasks.length)
          : Number(a.progressPercentage) || 0;

        return {
          id: a.projectAllocationID,
          projectId: a.projectID,
          title: a.projectTitle || 'Untitled Project',
          faculty: a.facultyName || '-',
          startDate: a.projectStartDate ? new Date(a.projectStartDate).toLocaleDateString() : 'N/A',
          endDate: a.projectEndDate ? new Date(a.projectEndDate).toLocaleDateString() : 'N/A',
          totalTasks: allocTasks.length,
          completedTasks: completed,
          progress,
          grade: a.overAllGrade || '-'
        };
      });

      setProjects(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-4 text-center">Loading your projects...</div>;

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>My Projects</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><span className="text-muted">Home</span></li>
                <li className="breadcrumb-item active fw-semibold">My Projects</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control shadow-none border-0 shadow-sm"
            style={{ maxWidth: '350px', borderRadius: '8px', padding: '10px 15px' }}
            placeholder="Search my projects..."
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
                    <th className="text-muted fw-bold text-uppercase small">Project</th>
                    <th className="text-muted fw-bold text-uppercase small">Faculty</th>
                    <th className="text-muted fw-bold text-uppercase small">Timeline</th>
                    <th className="text-muted fw-bold text-uppercase small">Tasks</th>
                    <th className="text-muted fw-bold text-uppercase small">Progress</th>
                    <th className="text-muted fw-bold text-uppercase small">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map(p => (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/project-detail?id=${p.projectId}`)}>
                      <td><span className="fw-bold text-dark">{p.title}</span></td>
                      <td className="text-secondary small fw-semibold">{p.faculty}</td>
                      <td className="text-secondary small">{p.startDate} → {p.endDate}</td>
                      <td><span className="badge bg-light text-dark border">{p.completedTasks}/{p.totalTasks}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '60px', backgroundColor: '#E2E8F0' }}>
                            <div className="progress-bar" style={{ width: `${p.progress}%`, backgroundColor: '#6B5CA5' }}></div>
                          </div>
                          <span className="small fw-bold">{p.progress}%</span>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark border">{p.grade}</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">No projects allocated to you yet.</td>
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
      `}</style>
    </>
  );
};

export default MyProjects;
