import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TaskDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('id');

  const [task, setTask] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetail();
    } else {
      setLoading(false);
    }
  }, [taskId]);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('spms_token')}`
  });

  const formatDate = (dateVal) => {
    if (!dateVal) return 'N/A';
    const d = new Date(dateVal);
    if (isNaN(d.getTime()) || d.getFullYear() < 2000) return 'N/A';
    return d.toLocaleDateString();
  };

  const fetchTaskDetail = async () => {
    setLoading(true);
    try {
      const taskRes = await fetch(`https://localhost:7089/api/Task/${taskId}`, {
        headers: authHeaders()
      });

      if (!taskRes.ok) {
        setTask(null);
        return;
      }

      const taskJson = await taskRes.json();
      const t = taskJson.data || taskJson.Data || null;
      setTask(t);

      if (t?.projectAllocationID) {
        const allocRes = await fetch(`https://localhost:7089/api/ProjectAllocation/${t.projectAllocationID}`, {
          headers: authHeaders()
        });
        if (allocRes.ok) {
          const allocJson = await allocRes.json();
          setAllocation(allocJson.data || allocJson.Data || null);
        }
      }
    } catch (err) {
      console.error(err);
      setTask(null);
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

  const getPriorityClass = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p.includes('high') || p.includes('critical')) return 'priority-high';
    if (p.includes('medium')) return 'priority-medium';
    return 'priority-low';
  };

  if (loading) return <div className="p-4 text-center">Loading task details...</div>;
  if (!task) return <div className="p-4 text-center">Task not found.</div>;

  const progress = task.progressPercentage || 0;

  return (
    <>
      <div className="container-fluid p-0">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Task Details</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Projects</a></li>
                <li className="breadcrumb-item">
                  <span
                    className="text-decoration-none text-muted"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (allocation?.projectID) navigate(`/project-detail?id=${allocation.projectID}`);
                      else navigate(-1);
                    }}
                  >
                    {allocation?.projectTitle || 'Project'}
                  </span>
                </li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">{task.taskTitle}</li>
              </ol>
            </nav>
          </div>

          <div className="d-flex gap-2">
            <button className="btn spms-btn-secondary d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
              Back
            </button>
          </div>
        </div>

        <div className="row g-4">

          <div className="col-12 col-xl-8">
            <div className="card spms-premium-card border-0">
              <div className="card-body p-4 p-md-5">

                <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
                  <div>
                    <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                      Task ID: TASK-{String(task.taskID).padStart(4, '0')}
                    </span>
                    <h3 className="fw-bold text-dark mt-1 mb-0">{task.taskTitle}</h3>
                    {allocation?.projectTitle && (
                      <p className="text-secondary small mb-0 mt-2">
                        Project:{' '}
                        <span
                          className="fw-semibold"
                          style={{ color: '#6B5CA5', cursor: 'pointer' }}
                          onClick={() => navigate(`/project-detail?id=${allocation.projectID}`)}
                        >
                          {allocation.projectTitle}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="d-flex flex-column align-items-end gap-2">
                    <span className={`spms-detail-badge ${getStatusClass(task.taskStatusName)}`}>
                      {task.taskStatusName || 'Pending'}
                    </span>
                    <span className={`spms-detail-badge ${getPriorityClass(task.taskPriorityName)}`}>
                      {task.taskPriorityName || 'Medium'}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <h6 className="fw-bold text-dark mb-3">Task Description</h6>
                  <p className="text-secondary lh-lg mb-0" style={{ fontSize: '0.95rem' }}>
                    {task.taskDescription || 'No description provided for this task.'}
                  </p>
                </div>

                <div className="bg-light rounded-4 p-4 mb-5 border" style={{ borderColor: '#F1F5F9' }}>
                  <h6 className="fw-bold text-dark mb-3">Task Timeline</h6>
                  <div className="row g-3">
                    <div className="col-sm-6 col-md-4">
                      <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Assigned Date</span>
                      <div className="fw-bold text-dark">{formatDate(task.taskAssignedDate)}</div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Start Date</span>
                      <div className="fw-bold text-dark">{formatDate(task.taskStartDate)}</div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Due Date</span>
                      <div className="fw-bold text-dark">{formatDate(task.taskDueDate)}</div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Completed Date</span>
                      <div className="fw-bold text-dark">{formatDate(task.taskCompletedDate)}</div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Next Follow-up</span>
                      <div className="fw-bold text-dark">{formatDate(task.nextFollowUpDate)}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-end mb-2">
                    <h6 className="fw-bold text-dark mb-0">Task Progress</h6>
                    <span className="fw-bold fs-5" style={{ color: '#6B5CA5' }}>{progress}%</span>
                  </div>
                  <div className="progress" style={{ height: '10px', borderRadius: '10px', backgroundColor: '#E2E8F0' }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${progress}%`, backgroundColor: '#6B5CA5' }}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Remarks */}
            <div className="card spms-premium-card border-0 mt-4">
              <div className="card-body p-4 p-md-5">
                <h6 className="fw-bold text-dark mb-4">Remarks</h6>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}>
                      <span className="text-muted small fw-semibold text-uppercase d-block mb-2">Faculty Remarks</span>
                      <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
                        {task.facultyRemarks || 'No faculty remarks yet.'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}>
                      <span className="text-muted small fw-semibold text-uppercase d-block mb-2">Student Remarks</span>
                      <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
                        {task.studentRemarks || 'No student remarks yet.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">

            <div className="card spms-premium-card border-0 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Score Summary</h6>

                <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <span className="fw-semibold text-secondary">Assigned Score</span>
                  <span className="badge bg-light text-dark border px-3 py-2 fs-6">{task.assignedScore ?? 0}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <span className="fw-semibold text-secondary">Earned Score</span>
                  <span className="badge bg-light text-success border border-success px-3 py-2 fs-6">{task.earnedScore ?? 0}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold text-secondary">Progress</span>
                  <span className="badge bg-light border px-3 py-2 fs-6" style={{ color: '#6B5CA5', borderColor: 'rgba(107,92,165,0.3)' }}>
                    {progress}%
                  </span>
                </div>
              </div>
            </div>

            {allocation && (
              <>
                <div className="card spms-premium-card border-0 mb-4">
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Supervising Faculty</h6>
                    <div className="d-flex align-items-center">
                      <div className="spms-detail-avatar me-3 shadow-sm" style={{ backgroundColor: '#6B5CA5', width: '48px', height: '48px', fontSize: '1.2rem' }}>
                        {(allocation.facultyName || 'F').charAt(0)}
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">{allocation.facultyName || 'Unassigned'}</h6>
                        <p className="text-secondary small mb-0">Faculty Mentor</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card spms-premium-card border-0">
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Assigned Student</h6>
                    <div className="d-flex align-items-center p-2 rounded-3" style={{ backgroundColor: '#F8FAFC' }}>
                      <div className="spms-detail-avatar me-3 shadow-sm" style={{ backgroundColor: '#20C997', width: '38px', height: '38px', fontSize: '1rem' }}>
                        {(allocation.studentName || 'S').charAt(0)}
                      </div>
                      <span className="fw-semibold text-dark">{allocation.studentName || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      <style>
        {`
          .spms-premium-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important;
          }

          .spms-btn-secondary {
            background-color: #64748B;
            color: #FFFFFF;
            font-weight: 600;
            border-radius: 8px;
            border: none;
            transition: all 0.3s ease;
            padding: 8px 18px;
          }
          .spms-btn-secondary:hover {
            background-color: #475569;
            color: #FFFFFF;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(100, 116, 139, 0.2);
          }

          .spms-detail-badge {
            padding: 6px 16px;
            border-radius: 8px;
            font-size: 0.80rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid transparent;
            display: inline-block;
          }

          .status-completed { background-color: rgba(32, 201, 151, 0.1); color: #17a57a; border-color: rgba(32, 201, 151, 0.2); }
          .status-inprogress { background-color: rgba(107, 92, 165, 0.1); color: #6B5CA5; border-color: rgba(107, 92, 165, 0.2); }
          .status-pending { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; border-color: rgba(245, 158, 11, 0.2); }
          .priority-high { background-color: rgba(239, 68, 68, 0.1); color: #EF4444; border-color: rgba(239, 68, 68, 0.2); }
          .priority-medium { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; border-color: rgba(245, 158, 11, 0.2); }
          .priority-low { background-color: rgba(59, 130, 246, 0.1); color: #3B82F6; border-color: rgba(59, 130, 246, 0.2); }

          .spms-detail-avatar {
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #FFFFFF;
            font-weight: bold;
          }
        `}
      </style>
    </>
  );
};

export default TaskDetails;
