import React, { useState, useEffect } from 'react';

const ScoresAndRemarks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEval, setCurrentEval] = useState(null);
  const [editScore, setEditScore] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [editProgress, setEditProgress] = useState(0);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };

      const [taskRes, allocRes] = await Promise.all([
        fetch('https://student-project-managment.onrender.com/api/Task', { headers }),
        fetch('https://student-project-managment.onrender.com/api/ProjectAllocation', { headers })
      ]);

      if (taskRes.ok && allocRes.ok) {
        const taskJson = await taskRes.json();
        const allocJson = await allocRes.json();

        const tasks = taskJson.data || taskJson.Data || [];
        const allocs = allocJson.data || allocJson.Data || [];

        const mergedData = tasks.map(task => {
          const alloc = allocs.find(a => a.projectAllocationID === task.projectAllocationID);
          const earned = Number(task.earnedScore || 0);
          const isGraded = earned > 0 || !!(task.facultyRemarks && task.facultyRemarks.trim());

          return {
            ...task,
            id: task.taskID,
            taskTitle: task.taskTitle,
            project: alloc ? alloc.projectTitle : 'N/A',
            student: alloc ? alloc.studentName : 'Unassigned',
            assignedScore: Number(task.assignedScore || 0),
            earnedScore: earned,
            facultyRemarks: task.facultyRemarks || '',
            status: isGraded ? 'Graded' : 'Pending Evaluation',
            avatarColor: '#6B5CA5'
          };
        });

        setEvaluations(mergedData);
      }
    } catch (err) {
      console.error('Error fetching tasks for evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvaluations = evaluations.filter(item => {
    const matchesSearch =
      (item.taskTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.student || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (evalItem) => {
    setCurrentEval(evalItem);
    setEditScore(evalItem.earnedScore > 0 ? String(evalItem.earnedScore) : '');
    setEditRemarks(evalItem.facultyRemarks || '');
    setEditProgress(evalItem.progressPercentage || 0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEval(null);
    setEditScore('');
    setEditRemarks('');
    setEditProgress(0);
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (!currentEval) return;

    const earned = parseFloat(editScore);
    const maxScore = Number(currentEval.assignedScore || 0);

    if (isNaN(earned) || earned < 0) {
      alert('Please enter a valid earned score.');
      return;
    }
    if (earned > maxScore) {
      alert(`Earned score cannot exceed assigned score (${maxScore}).`);
      return;
    }

    // Full TaskDTO payload required by PUT /api/Task/{id}
    const payload = {
      taskID: currentEval.taskID,
      taskTitle: currentEval.taskTitle,
      taskDescription: currentEval.taskDescription || null,
      assignedScore: maxScore,
      earnedScore: earned,
      progressPercentage: parseFloat(editProgress) || 0,
      taskAssignedDate: currentEval.taskAssignedDate,
      taskStartDate: currentEval.taskStartDate,
      taskDueDate: currentEval.taskDueDate,
      taskCompletedDate: currentEval.taskCompletedDate,
      nextFollowUpDate: currentEval.nextFollowUpDate,
      facultyRemarks: editRemarks || null,
      studentRemarks: currentEval.studentRemarks || null,
      projectAllocationID: currentEval.projectAllocationID,
      taskStatusID: currentEval.taskStatusID,
      taskPriorityID: currentEval.taskPriorityID
    };

    setSaving(true);
    try {
      const response = await fetch(`https://student-project-managment.onrender.com/api/Task/${currentEval.taskID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('spms_token')}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json().catch(() => ({}));

      if (response.ok && json.success !== false) {
        await fetchEvaluations();
        handleCloseModal();
      } else {
        const errors = json.errors || json.Errors || [];
        alert(errors.length ? errors.join('\n') : (json.message || json.Message || 'Failed to save evaluation.'));
      }
    } catch (err) {
      console.error(err);
      alert('Error saving evaluation.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading evaluations...</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Scores & Remarks</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Project Management</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Scores & Remarks</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card spms-premium-card border-0 mb-4">
          <div className="card-body p-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="search-box position-relative" style={{ width: '100%', maxWidth: '400px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" viewBox="0 0 16 16" style={{ zIndex: 10 }}>
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
              <input
                type="text"
                className="form-control ps-5 shadow-none border-0 bg-light"
                placeholder="Search by task or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="d-flex align-items-center gap-3">
              <label className="fw-semibold text-secondary small mb-0 text-nowrap">Filter Status:</label>
              <select
                className="form-select shadow-none border-0 bg-light fw-medium text-dark"
                style={{ width: '180px', fontSize: '0.9rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Tasks</option>
                <option value="Pending Evaluation">Pending Evaluation</option>
                <option value="Graded">Graded</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card spms-premium-card border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle spms-table mb-0">
                <thead>
                  <tr>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '28%' }}>Task & Project</th>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '17%' }}>Student</th>
                    <th className="text-muted fw-bold text-uppercase text-center" style={{ width: '15%' }}>Score Details</th>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '25%' }}>Faculty Remarks</th>
                    <th className="text-muted fw-bold text-uppercase text-center" style={{ width: '15%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluations.length > 0 ? (
                    filteredEvaluations.map(evalItem => (
                      <tr key={evalItem.id} className="spms-table-row">
                        <td>
                          <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>{evalItem.taskTitle}</div>
                          <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.70rem', letterSpacing: '0.5px' }}>
                            {evalItem.project}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle me-2 text-white fw-bold shadow-sm" style={{ backgroundColor: evalItem.avatarColor }}>
                              {(evalItem.student || 'U').charAt(0)}
                            </div>
                            <span className="text-secondary fw-medium small">{evalItem.student}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          {evalItem.status === 'Graded' ? (
                            <div className="score-badge success mx-auto">
                              <span className="earned">{Number(evalItem.earnedScore).toFixed(2)}</span>
                              <span className="divider">/</span>
                              <span className="assigned">{Number(evalItem.assignedScore).toFixed(2)}</span>
                            </div>
                          ) : (
                            <div className="score-badge pending mx-auto">
                              <span className="earned text-muted">--</span>
                              <span className="divider">/</span>
                              <span className="assigned">{Number(evalItem.assignedScore).toFixed(2)}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {evalItem.facultyRemarks ? (
                            <p className="text-secondary small fw-medium mb-0 text-truncate" style={{ maxWidth: '250px' }} title={evalItem.facultyRemarks}>
                              "{evalItem.facultyRemarks}"
                            </p>
                          ) : (
                            <span className="badge bg-light text-warning border border-warning px-2 py-1" style={{ fontSize: '0.70rem' }}>
                              Pending Evaluation
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm spms-btn-outline-primary d-flex align-items-center justify-content-center gap-2 mx-auto"
                            onClick={() => handleOpenModal(evalItem)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                            {evalItem.status === 'Graded' ? 'Edit Score' : 'Evaluate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="text-muted">
                          <h6 className="mt-2 fw-semibold text-dark">No Evaluation Records Found</h6>
                          <p className="mb-0 fs-7">Try adjusting your search or filter criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {isModalOpen && currentEval && (
          <div className="spms-modal-overlay">
            <div className="spms-modal-content card spms-premium-card border-0">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0">
                  {currentEval.status === 'Graded' ? 'Edit Evaluation' : 'Evaluate Task'}
                </h5>
                <button type="button" className="btn-close shadow-none" onClick={handleCloseModal}></button>
              </div>

              <div className="card-body px-4 pb-4">
                <div className="p-3 bg-light rounded-3 mb-4 border" style={{ borderColor: '#F1F5F9' }}>
                  <p className="text-muted small mb-1">Evaluating Task</p>
                  <h6 className="fw-bold text-dark mb-2">{currentEval.taskTitle}</h6>
                  <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                    <span className="small text-secondary fw-medium">
                      Student: <span className="text-dark fw-bold">{currentEval.student}</span>
                    </span>
                    <span className="small text-secondary fw-medium">
                      Max Score: <span className="text-dark fw-bold">{Number(currentEval.assignedScore).toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveEvaluation}>
                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary small">
                      Earned Score <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control spms-input shadow-none"
                      placeholder="Enter score"
                      step="0.01"
                      min="0"
                      max={currentEval.assignedScore}
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                      required
                    />
                    <div className="form-text small text-muted">
                      Must be between 0 and {Number(currentEval.assignedScore).toFixed(2)}.
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary small">Progress (%)</label>
                    <input
                      type="number"
                      className="form-control spms-input shadow-none"
                      min="0"
                      max="100"
                      step="0.01"
                      value={editProgress}
                      onChange={(e) => setEditProgress(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary small">Faculty Remarks</label>
                    <textarea
                      className="form-control spms-input shadow-none"
                      rows="3"
                      maxLength={1000}
                      placeholder="Add evaluation remarks or feedback..."
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button type="button" className="btn btn-light fw-semibold px-4" onClick={handleCloseModal} style={{ color: '#64748B' }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn spms-btn-primary px-4 shadow-sm" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Evaluation'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          .spms-premium-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important;
          }
          .spms-table th {
            font-size: 0.75rem; letter-spacing: 0.8px;
            border-bottom: 2px solid #F1F5F9; padding-bottom: 15px;
            color: #64748B !important;
          }
          .spms-table td {
            padding: 16px 10px; border-bottom: 1px solid #F1F5F9; vertical-align: middle;
          }
          .spms-table-row:hover { background-color: #F8FAFC !important; }
          .avatar-circle {
            width: 30px; height: 30px; border-radius: 50%;
            display: flex; justify-content: center; align-items: center; font-size: 0.80rem;
          }
          .score-badge {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 4px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;
            background-color: #F8FAFC; border: 1px solid #E2E8F0;
          }
          .score-badge.success {
            background-color: rgba(32, 201, 151, 0.05);
            border-color: rgba(32, 201, 151, 0.3);
          }
          .score-badge.success .earned { color: #17a57a; }
          .score-badge .divider { color: #CBD5E1; margin: 0 4px; font-weight: 400; }
          .score-badge .assigned { font-size: 0.75rem; color: #94A3B8; }
          .spms-btn-outline-primary {
            color: #6B5CA5; background-color: transparent;
            border: 1px solid rgba(107, 92, 165, 0.3); font-weight: 600;
            border-radius: 6px; padding: 6px 12px; font-size: 0.8rem;
          }
          .spms-btn-outline-primary:hover {
            background-color: #6B5CA5; color: #FFFFFF; border-color: #6B5CA5;
          }
          .spms-btn-primary {
            background-color: #6B5CA5; color: #FFFFFF; font-weight: 600;
            border-radius: 8px; border: none; padding: 10px 20px;
          }
          .spms-btn-primary:hover { background-color: #55488c; color: #FFFFFF; }
          .spms-input {
            border-radius: 8px; border: 1px solid #E2E8F0; background-color: #F8FAFC;
            font-size: 0.95rem; padding: 10px 15px; color: #1E293B;
          }
          .spms-input:focus {
            background-color: #FFFFFF; border-color: #6B5CA5;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }
          .spms-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
            z-index: 1050; display: flex; align-items: center; justify-content: center; padding: 20px;
          }
          .spms-modal-content { width: 100%; max-width: 500px; }
        `}
      </style>
    </>
  );
};

export default ScoresAndRemarks;
