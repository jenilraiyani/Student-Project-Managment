import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectAllocationId, setProjectAllocationId] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [assignedScore, setAssignedScore] = useState(100);
  const [earnedScore, setEarnedScore] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().slice(0, 10));
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [facultyRemarks, setFacultyRemarks] = useState('');
  const [studentRemarks, setStudentRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  const [allocationsList, setAllocationsList] = useState([]);
  const [prioritiesList, setPrioritiesList] = useState([]);
  const [statusesList, setStatusesList] = useState([]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };

      const [allocRes, prioRes, statRes] = await Promise.all([
        fetch('https://student-project-managment.onrender.com/api/ProjectAllocation', { headers }),
        fetch('https://student-project-managment.onrender.com/api/TaskPriority/dropdown', { headers }),
        fetch('https://student-project-managment.onrender.com/api/TaskStatus/dropdown', { headers })
      ]);

      if (allocRes.ok) {
        const json = await allocRes.json();
        setAllocationsList(json.data || json.Data || []);
      }
      if (prioRes.ok) {
        const json = await prioRes.json();
        const plist = json.data || json.Data || [];
        setPrioritiesList(plist);
        if (plist.length > 0) setPriority(String(plist[0].taskPriorityID));
      }
      if (statRes.ok) {
        const json = await statRes.json();
        const slist = json.data || json.Data || [];
        setStatusesList(slist);
        if (slist.length > 0) setStatus(String(slist[0].taskStatusID));
      }
    } catch (err) {
      console.error('Error fetching dropdowns:', err);
    }
  };

  const toIsoDate = (dateStr, fallbackIso) => {
    if (!dateStr) return fallbackIso;
    return new Date(`${dateStr}T00:00:00`).toISOString();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Task Title is required.');
      return;
    }
    if (!projectAllocationId) {
      alert('Please select a Project Allocation.');
      return;
    }
    if (!priority || !status) {
      alert('Please select Priority and Status.');
      return;
    }
    if (!dueDate) {
      alert('Due Date is required.');
      return;
    }

    const assignedScoreNum = parseFloat(assignedScore) || 0;
    const earnedScoreNum = parseFloat(earnedScore) || 0;
    if (earnedScoreNum > assignedScoreNum) {
      alert('Earned score cannot exceed assigned score.');
      return;
    }

    const assignedIso = toIsoDate(assignedDate, new Date().toISOString());
    const dueIso = toIsoDate(dueDate, assignedIso);
    const emptyDateIso = '0001-01-01T00:00:00.000Z';

    const payload = {
      taskID: 0,
      taskTitle: title.trim(),
      taskDescription: description || null,
      assignedScore: assignedScoreNum,
      earnedScore: earnedScoreNum,
      progressPercentage: parseFloat(progressPercentage) || 0,
      taskAssignedDate: assignedIso,
      taskStartDate: toIsoDate(startDate, assignedIso),
      taskDueDate: dueIso,
      taskCompletedDate: completedDate ? toIsoDate(completedDate) : emptyDateIso,
      nextFollowUpDate: nextFollowUpDate ? toIsoDate(nextFollowUpDate) : dueIso,
      facultyRemarks: facultyRemarks || null,
      studentRemarks: studentRemarks || null,
      projectAllocationID: parseInt(projectAllocationId, 10),
      taskStatusID: parseInt(status, 10),
      taskPriorityID: parseInt(priority, 10)
    };

    setSaving(true);
    try {
      const response = await fetch('https://student-project-managment.onrender.com/api/Task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('spms_token')}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json().catch(() => ({}));

      if (response.ok && (json.success !== false)) {
        // Sync allocation task counts from live Task API
        await syncAllocationTaskCounts(parseInt(projectAllocationId, 10));
        navigate(-1);
      } else {
        const errors = json.errors || json.Errors || [];
        alert(errors.length ? errors.join('\n') : (json.message || json.Message || 'Failed to create task.'));
      }
    } catch (err) {
      console.error(err);
      alert('Error saving task.');
    } finally {
      setSaving(false);
    }
  };

  const syncAllocationTaskCounts = async (allocationId) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('spms_token')}`,
        'Content-Type': 'application/json'
      };

      const [taskRes, allocRes] = await Promise.all([
        fetch('https://student-project-managment.onrender.com/api/Task', { headers }),
        fetch(`https://student-project-managment.onrender.com/api/ProjectAllocation/${allocationId}`, { headers })
      ]);

      if (!taskRes.ok || !allocRes.ok) return;

      const taskJson = await taskRes.json();
      const allocJson = await allocRes.json();
      const tasks = (taskJson.data || taskJson.Data || []).filter(t => t.projectAllocationID === allocationId);
      const alloc = allocJson.data || allocJson.Data;
      if (!alloc) return;

      const completed = tasks.filter(t => (t.taskStatusName || '').toLowerCase().includes('complete')).length;
      const avgProgress = tasks.length
        ? Math.round(tasks.reduce((s, t) => s + (Number(t.progressPercentage) || 0), 0) / tasks.length)
        : 0;

      await fetch(`https://student-project-managment.onrender.com/api/ProjectAllocation/${allocationId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          projectAllocationID: alloc.projectAllocationID,
          projectID: alloc.projectID,
          studentID: alloc.studentID,
          facultyID: alloc.facultyID,
          assignedDate: alloc.assignedDate,
          projectStartDate: alloc.projectStartDate,
          projectEndDate: alloc.projectEndDate,
          totalTasksGiven: tasks.length,
          totalCompletedTasks: completed,
          progressPercentage: avgProgress,
          overAllGrade: alloc.overAllGrade || null
        })
      });
    } catch (err) {
      console.error('Failed to sync allocation task counts:', err);
    }
  };

  return (
    <>
      <div className="container-fluid p-0">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Add Task</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Project Management</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Tasks</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Add</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card spms-premium-card border-0">
          <div className="card-body p-4 p-md-5">

            <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Task Details</h6>

            <form onSubmit={handleSave}>

              <div className="row mb-4 align-items-center">
                <label htmlFor="title" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Task Title <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control spms-input shadow-none"
                    id="title"
                    maxLength={200}
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-4">
                <label htmlFor="description" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Description
                </label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control spms-input shadow-none"
                    id="description"
                    rows="3"
                    maxLength={1000}
                    placeholder="Provide detailed instructions for this task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label htmlFor="projectAllocationId" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Project Allocation <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                  <select
                    className="form-select spms-input shadow-none"
                    id="projectAllocationId"
                    value={projectAllocationId}
                    onChange={(e) => setProjectAllocationId(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Project Allocation --</option>
                    {allocationsList.map(p => (
                      <option key={p.projectAllocationID} value={p.projectAllocationID}>
                        #{p.projectAllocationID} — {p.projectTitle} ({p.studentName || 'Student'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label htmlFor="priority" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Priority <span className="text-danger">*</span>
                </label>
                <div className="col-sm-3">
                  <select
                    className="form-select spms-input shadow-none"
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Priority --</option>
                    {prioritiesList.map(p => (
                      <option key={p.taskPriorityID} value={p.taskPriorityID}>{p.taskPriorityName}</option>
                    ))}
                  </select>
                </div>
                <label htmlFor="status" className="col-sm-2 col-form-label fw-semibold text-secondary text-sm-end">
                  Status <span className="text-danger">*</span>
                </label>
                <div className="col-sm-4">
                  <select
                    className="form-select spms-input shadow-none"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Status --</option>
                    {statusesList.map(s => (
                      <option key={s.taskStatusID} value={s.taskStatusID}>{s.taskStatusName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Assigned Score
                </label>
                <div className="col-sm-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control spms-input shadow-none"
                    value={assignedScore}
                    onChange={(e) => setAssignedScore(e.target.value)}
                  />
                </div>
                <label className="col-sm-2 col-form-label fw-semibold text-secondary text-sm-end">
                  Earned Score
                </label>
                <div className="col-sm-4">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control spms-input shadow-none"
                    value={earnedScore}
                    onChange={(e) => setEarnedScore(e.target.value)}
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
              </div>

              <h6 className="fw-bold text-dark mb-3 mt-2 pb-2 border-bottom">Timeline</h6>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Assigned Date <span className="text-danger">*</span>
                </label>
                <div className="col-sm-3">
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={assignedDate}
                    onChange={(e) => setAssignedDate(e.target.value)}
                    required
                  />
                </div>
                <label className="col-sm-2 col-form-label fw-semibold text-secondary text-sm-end">
                  Start Date
                </label>
                <div className="col-sm-4">
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Due Date <span className="text-danger">*</span>
                </label>
                <div className="col-sm-3">
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <label className="col-sm-2 col-form-label fw-semibold text-secondary text-sm-end">
                  Follow-up Date
                </label>
                <div className="col-sm-4">
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Completed Date
                </label>
                <div className="col-sm-3">
                  <input
                    type="date"
                    className="form-control spms-input shadow-none"
                    value={completedDate}
                    onChange={(e) => setCompletedDate(e.target.value)}
                  />
                </div>
              </div>

              <h6 className="fw-bold text-dark mb-3 mt-2 pb-2 border-bottom">Remarks</h6>

              <div className="row mb-4">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Faculty Remarks
                </label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control spms-input shadow-none"
                    rows="2"
                    maxLength={1000}
                    placeholder="Optional faculty remarks..."
                    value={facultyRemarks}
                    onChange={(e) => setFacultyRemarks(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="row mb-4">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Student Remarks
                </label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control spms-input shadow-none"
                    rows="2"
                    maxLength={1000}
                    placeholder="Optional student remarks..."
                    value={studentRemarks}
                    onChange={(e) => setStudentRemarks(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 d-flex gap-2">
                  <button type="submit" className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm" disabled={saving}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                    </svg>
                    {saving ? 'Saving...' : 'Save Task'}
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
          .spms-input::placeholder { color: #94A3B8; font-size: 0.9rem; }
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

export default AddTask;
