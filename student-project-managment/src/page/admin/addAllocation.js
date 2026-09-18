import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAllocation = () => {
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [assignDate, setAssignDate] = useState(new Date().toISOString().slice(0, 10));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalTasksGiven, setTotalTasksGiven] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [overAllGrade, setOverAllGrade] = useState('');
  const [saving, setSaving] = useState(false);

  const [projectsList, setProjectsList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };
      const [projRes, userRes] = await Promise.all([
        fetch('https://localhost:7089/api/ProjectMaster/dropdown', { headers }),
        fetch('https://localhost:7089/api/User', { headers })
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

  const toIsoDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    return new Date(`${dateStr}T00:00:00`).toISOString();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!projectId || !studentId || !facultyId) {
      alert('Please select Project, Student, and Faculty.');
      return;
    }
    if (!assignDate || !startDate || !endDate) {
      alert('Please fill Assigned Date, Start Date and End Date.');
      return;
    }
    if (parseInt(totalCompletedTasks, 10) > parseInt(totalTasksGiven, 10)) {
      alert('Completed tasks cannot exceed total tasks.');
      return;
    }

    const payload = {
      projectAllocationID: 0,
      projectID: parseInt(projectId, 10),
      studentID: parseInt(studentId, 10),
      facultyID: parseInt(facultyId, 10),
      assignedDate: toIsoDate(assignDate),
      projectStartDate: toIsoDate(startDate),
      projectEndDate: toIsoDate(endDate),
      totalTasksGiven: parseInt(totalTasksGiven, 10) || 0,
      totalCompletedTasks: parseInt(totalCompletedTasks, 10) || 0,
      progressPercentage: parseFloat(progressPercentage) || 0,
      overAllGrade: overAllGrade ? overAllGrade.substring(0, 1) : null
    };

    setSaving(true);
    try {
      const response = await fetch('https://localhost:7089/api/ProjectAllocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('spms_token')}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json().catch(() => ({}));

      if (response.ok && (json.success !== false)) {
        navigate(-1);
      } else {
        const errors = json.errors || json.Errors || [];
        alert(errors.length ? errors.join('\n') : (json.message || json.Message || 'Failed to create project allocation.'));
      }
    } catch (err) {
      console.error(err);
      alert('Error saving project allocation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="container-fluid p-0">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Add Project Allocation</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Project Management</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Allocations</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Add</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card spms-premium-card border-0">
          <div className="card-body p-4 p-md-5">

            <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Allocation Details</h6>

            <form onSubmit={handleSave}>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Project <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                  <select
                    className="form-select spms-input shadow-none"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Project --</option>
                    {projectsList.map(p => (
                      <option key={p.projectID} value={p.projectID}>{p.projectTitle}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Student <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                  <select
                    className="form-select spms-input shadow-none"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Student --</option>
                    {studentsList.map(s => (
                      <option key={s.userID} value={s.userID}>{s.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Faculty <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                  <select
                    className="form-select spms-input shadow-none"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Faculty --</option>
                    {facultyList.map(f => (
                      <option key={f.userID} value={f.userID}>{f.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Assigned Date <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9 col-lg-4">
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={assignDate}
                    onChange={(e) => setAssignDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Project Start Date <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9 col-lg-4">
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Project End Date <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9 col-lg-4">
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Total Tasks Given
                </label>
                <div className="col-sm-3">
                  <input
                    type="number"
                    min="0"
                    className="form-control spms-input shadow-none"
                    value={totalTasksGiven}
                    onChange={(e) => setTotalTasksGiven(e.target.value)}
                  />
                </div>
                <label className="col-sm-3 col-form-label fw-semibold text-secondary text-sm-end">
                  Completed Tasks
                </label>
                <div className="col-sm-3">
                  <input
                    type="number"
                    min="0"
                    className="form-control spms-input shadow-none"
                    value={totalCompletedTasks}
                    onChange={(e) => setTotalCompletedTasks(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Progress (%)
                </label>
                <div className="col-sm-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="form-control spms-input shadow-none"
                    value={progressPercentage}
                    onChange={(e) => setProgressPercentage(e.target.value)}
                  />
                </div>
                <label className="col-sm-3 col-form-label fw-semibold text-secondary text-sm-end">
                  Overall Grade
                </label>
                <div className="col-sm-3">
                  <input
                    type="text"
                    maxLength={1}
                    className="form-control spms-input shadow-none"
                    placeholder="e.g. A"
                    value={overAllGrade}
                    onChange={(e) => setOverAllGrade(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 d-flex gap-2">
                  <button type="submit" className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm" disabled={saving}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                    </svg>
                    {saving ? 'Saving...' : 'Save Allocation'}
                  </button>
                  <button
                    type="button"
                    className="btn spms-btn-secondary d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => navigate(-1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    Back
                  </button>
                </div>
              </div>

            </form>
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
          .spms-input {
            border-radius: 8px;
            border: 1px solid #E2E8F0;
            background-color: #F8FAFC;
            font-size: 0.95rem;
            padding: 10px 15px;
            color: #1E293B;
            transition: all 0.2s;
          }
          .spms-input:focus {
            background-color: #FFFFFF;
            border-color: #6B5CA5;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }
          .spms-btn-primary {
            background-color: #6B5CA5;
            color: #FFFFFF;
            font-weight: 600;
            padding: 10px 22px;
            border-radius: 8px;
            border: none;
            transition: all 0.3s ease;
            font-size: 0.9rem;
          }
          .spms-btn-primary:hover {
            background-color: #55488c;
            color: #FFFFFF;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(107, 92, 165, 0.2);
          }
          .spms-btn-secondary {
            background-color: #64748B;
            color: #FFFFFF;
            font-weight: 600;
            padding: 10px 22px;
            border-radius: 8px;
            border: none;
            transition: all 0.3s ease;
            font-size: 0.9rem;
          }
          .spms-btn-secondary:hover {
            background-color: #475569;
            color: #FFFFFF;
            transform: translateY(-1px);
          }
          .col-form-label { font-size: 0.95rem; }
        `}
      </style>
    </>
  );
};

export default AddAllocation;
