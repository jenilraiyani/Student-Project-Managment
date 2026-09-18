import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageAllocation = () => {
  const [allocations, setAllocations] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allocTasks, setAllocTasks] = useState([]);

  const [projectsList, setProjectsList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  const [editingAlloc, setEditingAlloc] = useState({
    projectAllocationID: 0,
    projectID: '',
    studentID: '',
    facultyID: '',
    assignedDate: '',
    projectStartDate: '',
    projectEndDate: '',
    totalTasksGiven: 0,
    totalCompletedTasks: 0,
    progressPercentage: 0,
    overAllGrade: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllocationsAndTasks();
    fetchDropdowns();
  }, []);

  const isCompletedTask = (t) => (t.taskStatusName || '').toLowerCase().includes('complete');

  const getTaskStats = (allocationId, tasksList = allTasks) => {
    const tasks = tasksList.filter(t => t.projectAllocationID === allocationId);
    const completed = tasks.filter(isCompletedTask).length;
    const avgProgress = tasks.length
      ? Math.round(tasks.reduce((s, t) => s + (Number(t.progressPercentage) || 0), 0) / tasks.length)
      : 0;
    return { tasks, total: tasks.length, completed, avgProgress };
  };

  const toDateInput = (val) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime()) || d.getFullYear() < 2000) return '';
    return d.toISOString().slice(0, 10);
  };

  const toIsoDate = (dateStr, fallback) => {
    if (!dateStr) return fallback || new Date().toISOString();
    return new Date(`${dateStr}T00:00:00`).toISOString();
  };

  const fetchAllocationsAndTasks = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };
      const [allocRes, taskRes] = await Promise.all([
        fetch('https://student-project-managment.onrender.com/api/ProjectAllocation', { headers }),
        fetch('https://student-project-managment.onrender.com/api/Task', { headers })
      ]);

      let tasks = [];
      if (taskRes.ok) {
        const taskJson = await taskRes.json();
        tasks = taskJson.data || taskJson.Data || [];
        setAllTasks(tasks);
      }

      if (allocRes.ok) {
        const json = await allocRes.json();
        const allocs = json.data || json.Data || [];
        // Enrich each allocation with live task counts from Task API
        const enriched = allocs.map(a => {
          const stats = getTaskStats(a.projectAllocationID, tasks);
          return {
            ...a,
            liveTotalTasks: stats.total,
            liveCompletedTasks: stats.completed,
            liveProgress: stats.avgProgress
          };
        });
        setAllocations(enriched);
      }
    } catch (e) {
      console.error('Error fetching allocations/tasks:', e);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };
      const [projRes, userRes] = await Promise.all([
        fetch('https://student-project-managment.onrender.com/api/ProjectMaster/dropdown', { headers }),
        fetch('https://student-project-managment.onrender.com/api/User', { headers })
      ]);

      if (projRes.ok) {
        const json = await projRes.json();
        setProjectsList(json.data || json.Data || []);
      }
      if (userRes.ok) {
        const json = await userRes.json();
        const users = json.data || json.Data || [];
        setStudentsList(users.filter(u => u.userTypeName && u.userTypeName.toLowerCase().includes('student')));
        setFacultyList(users.filter(u => u.userTypeName && /faculty|admin|guide/i.test(u.userTypeName)));
      }
    } catch (err) {
      console.error('Error fetching dropdowns:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this allocation?')) return;
    try {
      const response = await fetch(`https://student-project-managment.onrender.com/api/ProjectAllocation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('spms_token')}` }
      });
      if (response.ok) {
        fetchAllocationsAndTasks();
      } else {
        alert('Failed to delete allocation.');
      }
    } catch (e) {
      console.error('Error deleting:', e);
    }
  };

  const handleEditClick = (alloc) => {
    const stats = getTaskStats(alloc.projectAllocationID);
    setAllocTasks(stats.tasks);
    setEditingAlloc({
      projectAllocationID: alloc.projectAllocationID,
      projectID: String(alloc.projectID || ''),
      studentID: String(alloc.studentID || ''),
      facultyID: String(alloc.facultyID || ''),
      assignedDate: toDateInput(alloc.assignedDate),
      projectStartDate: toDateInput(alloc.projectStartDate),
      projectEndDate: toDateInput(alloc.projectEndDate),
      // Prefer live Task API counts
      totalTasksGiven: stats.total,
      totalCompletedTasks: stats.completed,
      progressPercentage: stats.total > 0 ? stats.avgProgress : (alloc.progressPercentage || 0),
      overAllGrade: (alloc.overAllGrade || '').substring(0, 1)
    });
    setIsEditModalOpen(true);
  };

  const submitEdit = async () => {
    if (!editingAlloc.projectID || !editingAlloc.studentID || !editingAlloc.facultyID) {
      alert('Please select Project, Student and Faculty.');
      return;
    }
    if (!editingAlloc.assignedDate || !editingAlloc.projectStartDate || !editingAlloc.projectEndDate) {
      alert('Please fill all date fields.');
      return;
    }
    if (parseInt(editingAlloc.totalCompletedTasks, 10) > parseInt(editingAlloc.totalTasksGiven, 10)) {
      alert('Completed tasks cannot exceed total tasks.');
      return;
    }

    const payload = {
      projectAllocationID: editingAlloc.projectAllocationID,
      projectID: parseInt(editingAlloc.projectID, 10),
      studentID: parseInt(editingAlloc.studentID, 10),
      facultyID: parseInt(editingAlloc.facultyID, 10),
      assignedDate: toIsoDate(editingAlloc.assignedDate),
      projectStartDate: toIsoDate(editingAlloc.projectStartDate),
      projectEndDate: toIsoDate(editingAlloc.projectEndDate),
      totalTasksGiven: parseInt(editingAlloc.totalTasksGiven, 10) || 0,
      totalCompletedTasks: parseInt(editingAlloc.totalCompletedTasks, 10) || 0,
      progressPercentage: parseFloat(editingAlloc.progressPercentage) || 0,
      overAllGrade: editingAlloc.overAllGrade ? editingAlloc.overAllGrade.substring(0, 1) : null
    };

    setSaving(true);
    try {
      const response = await fetch(`https://student-project-managment.onrender.com/api/ProjectAllocation/${editingAlloc.projectAllocationID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('spms_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json().catch(() => ({}));

      if (response.ok && json.success !== false) {
        fetchAllocationsAndTasks();
        setIsEditModalOpen(false);
      } else {
        const errors = json.errors || json.Errors || [];
        alert(errors.length ? errors.join('\n') : (json.message || json.Message || 'Failed to update allocation.'));
      }
    } catch (e) {
      console.error('Error updating:', e);
      alert('Error updating allocation.');
    } finally {
      setSaving(false);
    }
  };

  const filteredAllocations = allocations.filter(a =>
    a.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.facultyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container-fluid p-0">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Manage Allocations</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Project Management</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Allocations</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <div className="search-box position-relative" style={{ width: '100%', maxWidth: '350px' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" viewBox="0 0 16 16"
              style={{ zIndex: 10 }}
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            <input
              type="text"
              className="form-control ps-5 shadow-none border-0 shadow-sm"
              placeholder="Search by project, student, or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate('/add-allocation')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Add New Allocation
          </button>
        </div>

        <div className="card spms-premium-card border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle spms-table mb-0">
                <thead>
                  <tr>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '7%' }}>ID</th>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '20%' }}>Project Title</th>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '14%' }}>Student</th>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '14%' }}>Faculty</th>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '12%' }}>Tasks</th>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '10%' }}>Progress</th>
                    <th className="text-muted fw-bold text-uppercase" style={{ width: '8%' }}>Grade</th>
                    <th className="text-muted fw-bold text-uppercase text-center" style={{ width: '10%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllocations.length > 0 ? (
                    filteredAllocations.map(alloc => (
                      <tr key={alloc.projectAllocationID} className="spms-table-row">
                        <td><span className="fw-bold text-secondary">#{alloc.projectAllocationID}</span></td>
                        <td><span className="fw-bold text-dark">{alloc.projectTitle}</span></td>
                        <td><span className="text-secondary fw-semibold small">{alloc.studentName}</span></td>
                        <td><span className="text-secondary fw-semibold small">{alloc.facultyName}</span></td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {alloc.liveCompletedTasks || 0} / {alloc.liveTotalTasks || 0}
                          </span>
                          <div className="text-muted" style={{ fontSize: '0.70rem' }}>completed / total</div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {alloc.liveTotalTasks > 0 ? alloc.liveProgress : (alloc.progressPercentage || 0)}%
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{alloc.overAllGrade || '-'}</span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-light text-primary me-2 action-btn"
                            title="Edit Full Allocation"
                            onClick={() => handleEditClick(alloc)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                            </svg>
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger action-btn"
                            title="Delete Allocation"
                            onClick={() => handleDelete(alloc.projectAllocationID)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <h6 className="mt-3 fw-semibold text-dark">No Allocations Found</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="spms-modal-overlay">
          <div className="spms-modal-content card spms-premium-card border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-dark mb-0">Update Project Allocation</h5>
                <span className="text-muted small">Edit all allocation fields (API PUT)</span>
              </div>
              <button type="button" className="btn-close shadow-none" onClick={() => setIsEditModalOpen(false)}></button>
            </div>

            <div className="card-body px-4 pb-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>

              <div className="mb-3">
                <label className="form-label fw-bold text-secondary small">Project <span className="text-danger">*</span></label>
                <select
                  className="form-select spms-input shadow-none"
                  value={editingAlloc.projectID}
                  onChange={(e) => setEditingAlloc({ ...editingAlloc, projectID: e.target.value })}
                >
                  <option value="" disabled>-- Select Project --</option>
                  {projectsList.map(p => (
                    <option key={p.projectID} value={p.projectID}>{p.projectTitle}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-secondary small">Student <span className="text-danger">*</span></label>
                <select
                  className="form-select spms-input shadow-none"
                  value={editingAlloc.studentID}
                  onChange={(e) => setEditingAlloc({ ...editingAlloc, studentID: e.target.value })}
                >
                  <option value="" disabled>-- Select Student --</option>
                  {studentsList.map(s => (
                    <option key={s.userID} value={s.userID}>{s.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-secondary small">Faculty <span className="text-danger">*</span></label>
                <select
                  className="form-select spms-input shadow-none"
                  value={editingAlloc.facultyID}
                  onChange={(e) => setEditingAlloc({ ...editingAlloc, facultyID: e.target.value })}
                >
                  <option value="" disabled>-- Select Faculty --</option>
                  {facultyList.map(f => (
                    <option key={f.userID} value={f.userID}>{f.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary small">Assigned Date *</label>
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={editingAlloc.assignedDate}
                    onChange={(e) => setEditingAlloc({ ...editingAlloc, assignedDate: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary small">Start Date *</label>
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={editingAlloc.projectStartDate}
                    onChange={(e) => setEditingAlloc({ ...editingAlloc, projectStartDate: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary small">End Date *</label>
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={editingAlloc.projectEndDate}
                    onChange={(e) => setEditingAlloc({ ...editingAlloc, projectEndDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary small">Total Tasks (from Task API)</label>
                  <input
                    type="number"
                    className="form-control spms-input shadow-none"
                    value={editingAlloc.totalTasksGiven}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary small">Completed Tasks</label>
                  <input
                    type="number"
                    className="form-control spms-input shadow-none"
                    value={editingAlloc.totalCompletedTasks}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary small">Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="form-control spms-input shadow-none"
                    value={editingAlloc.progressPercentage}
                    onChange={(e) => setEditingAlloc({ ...editingAlloc, progressPercentage: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4 p-3 rounded-3 border" style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem' }}>Assigned Tasks</h6>
                  <span className="badge bg-white text-dark border">{allocTasks.length} Tasks</span>
                </div>
                {allocTasks.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm mb-0 align-middle">
                      <thead>
                        <tr>
                          <th className="text-muted small text-uppercase">Task</th>
                          <th className="text-muted small text-uppercase">Status</th>
                          <th className="text-muted small text-uppercase">Priority</th>
                          <th className="text-muted small text-uppercase text-end">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocTasks.map(t => (
                          <tr key={t.taskID}>
                            <td>
                              <span
                                className="fw-semibold small"
                                style={{ color: '#6B5CA5', cursor: 'pointer' }}
                                onClick={() => navigate(`/task-detail?id=${t.taskID}`)}
                              >
                                {t.taskTitle}
                              </span>
                            </td>
                            <td className="small text-secondary">{t.taskStatusName || '-'}</td>
                            <td className="small text-secondary">{t.taskPriorityName || '-'}</td>
                            <td className="small text-secondary text-end">{t.progressPercentage || 0}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted small mb-0">No tasks assigned to this allocation yet.</p>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold text-secondary small">Overall Grade</label>
                <select
                  className="form-select spms-input shadow-none"
                  value={editingAlloc.overAllGrade}
                  onChange={(e) => setEditingAlloc({ ...editingAlloc, overAllGrade: e.target.value })}
                >
                  <option value="">-</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn btn-light fw-semibold px-4" onClick={() => setIsEditModalOpen(false)} style={{ color: '#64748B' }}>
                  Cancel
                </button>
                <button type="button" className="btn spms-btn-primary px-4 shadow-sm" onClick={submitEdit} disabled={saving}>
                  {saving ? 'Saving...' : 'Update Allocation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .spms-table { border-collapse: separate; border-spacing: 0; font-size: 0.9rem; }
          .spms-table-row { transition: all 0.2s ease; }
          .spms-table-row:hover { background-color: #F8FAFC !important; }
          .spms-table th {
            font-size: 0.75rem; letter-spacing: 0.5px; padding: 1rem;
            border-bottom: 2px solid #F1F5F9;
          }
          .spms-table td { padding: 1rem; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
          .spms-premium-card {
            border-radius: 12px; background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important;
          }
          .action-btn {
            width: 32px; height: 32px; padding: 0; display: inline-flex;
            align-items: center; justify-content: center; border-radius: 6px;
          }
          .action-btn:hover { background-color: #E2E8F0; transform: translateY(-2px); }
          .spms-btn-primary {
            background-color: #6B5CA5; color: #FFFFFF; font-weight: 600;
            padding: 10px 20px; border-radius: 8px; border: none;
          }
          .spms-btn-primary:hover { background-color: #55488c; color: #FFFFFF; }
          .search-box .form-control {
            border-radius: 8px; background-color: #FFFFFF; font-size: 0.9rem;
            padding-top: 10px; padding-bottom: 10px;
          }
          .search-box .form-control:focus {
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }
          .spms-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
            display: flex; justify-content: center; align-items: center; z-index: 1050;
            padding: 20px;
          }
          .spms-modal-content { width: 100%; max-width: 720px; }
          .spms-input {
            border-radius: 8px; border: 1px solid #E2E8F0; background-color: #F8FAFC;
            font-size: 0.95rem; color: #1E293B;
          }
          .spms-input:focus {
            background-color: #FFFFFF; border-color: #6B5CA5;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }
        `}
      </style>
    </>
  );
};

export default ManageAllocation;
