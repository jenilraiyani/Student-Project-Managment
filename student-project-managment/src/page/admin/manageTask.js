import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageTask = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState({ 
    id: 0, title: '', description: '', priority: 1, status: 1, allocId: 0, dueDate: '',
    progressPercentage: 0, assignedScore: 0, earnedScore: 0,
    assignedDate: '', startDate: '', completedDate: '', nextFollowUpDate: '',
    facultyRemarks: '', studentRemarks: ''
  });

  const [prioritiesList, setPrioritiesList] = useState([]);
  const [statusesList, setStatusesList] = useState([]);
  const [allocationsList, setAllocationsList] = useState([]);

  React.useEffect(() => {
    fetchTasks();
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const h = { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` };
      const [prioRes, statRes] = await Promise.all([
        fetch('https://localhost:7089/api/TaskPriority/dropdown', { headers: h }),
        fetch('https://localhost:7089/api/TaskStatus/dropdown', { headers: h })
      ]);
      if (prioRes.ok) { let j = await prioRes.json(); setPrioritiesList(j.data || j.Data || []); }
      if (statRes.ok) { let j = await statRes.json(); setStatusesList(j.data || j.Data || []); }
    } catch (e) { }
  };

  const fetchTasks = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` };
      const [taskRes, allocRes] = await Promise.all([
        fetch('https://localhost:7089/api/Task', { headers }),
        fetch('https://localhost:7089/api/ProjectAllocation', { headers })
      ]);

      if (taskRes.ok) {
        const taskJson = await taskRes.json();
        const allocJson = allocRes.ok ? await allocRes.json() : { data: [] };

        const items = taskJson.data || taskJson.Data || [];
        const allocs = allocJson.data || allocJson.Data || [];
        setAllocationsList(allocs);

        const formatted = items.map(item => {
          const matchedAlloc = allocs.find(a => a.projectAllocationID === item.projectAllocationID);
          return {
            id: item.taskID,
            title: item.taskTitle,
            project: matchedAlloc ? matchedAlloc.projectTitle : 'N/A',
            priority: item.taskPriorityName || 'Medium',
            status: item.taskStatusName || 'Pending',
            assignedTo: matchedAlloc ? matchedAlloc.studentName : '-',
            dueDate: item.taskDueDate ? new Date(item.taskDueDate).toLocaleDateString() : 'N/A',
            avatarColor: '#6B5CA5',
            description: item.taskDescription,
            taskPriorityID: item.taskPriorityID,
            taskStatusID: item.taskStatusID,
            projectAllocationID: item.projectAllocationID
          };
        });
        setTasks(formatted);
      }
    } catch (e) {
      console.error('Error fetching tasks', e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await fetch(`https://localhost:7089/api/Task/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }
      });
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      } else {
        alert("Failed to delete task.");
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditClick = async (task) => {
    try {
      const response = await fetch(`https://localhost:7089/api/Task/${task.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }
      });
      if (response.ok) {
        const json = await response.json();
        const freshTask = json.data || json.Data || task;
        setEditingTask({
          id: freshTask.taskID || task.id,
          title: freshTask.taskTitle || task.title,
          description: freshTask.taskDescription || task.description,
          priority: freshTask.taskPriorityID || task.priority,
          status: freshTask.taskStatusID || task.status,
          allocId: freshTask.projectAllocationID || task.projectAllocationID || 0,
          dueDate: freshTask.taskDueDate || task.dueDate,
          progressPercentage: freshTask.progressPercentage || 0,
          assignedScore: freshTask.assignedScore || task.assignedScore || 0,
          earnedScore: freshTask.earnedScore || task.earnedScore || 0,
          assignedDate: freshTask.taskAssignedDate || task.assignedDate || '',
          startDate: freshTask.taskStartDate || task.startDate || '',
          completedDate: freshTask.taskCompletedDate || task.completedDate || '',
          nextFollowUpDate: freshTask.nextFollowUpDate || task.nextFollowUpDate || '',
          facultyRemarks: freshTask.facultyRemarks || task.facultyRemarks || '',
          studentRemarks: freshTask.studentRemarks || task.studentRemarks || ''
        });
      } else {
        setEditingTask({ id: task.id, title: task.title, description: task.description, priority: task.priority, status: task.status, allocId: task.projectAllocationID || 0, dueDate: task.dueDate, progressPercentage: 0 });
      }
    } catch (e) {
      setEditingTask({ id: task.id, title: task.title, description: task.description, priority: task.priority, status: task.status, allocId: task.projectAllocationID || 0, dueDate: task.dueDate, progressPercentage: 0 });
    }
    setIsEditModalOpen(true);
  };

  const submitEdit = async () => {
    try {
      const response = await fetch(`https://localhost:7089/api/Task/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskID: editingTask.id,
          taskTitle: editingTask.title,
          taskDescription: editingTask.description,
          projectAllocationID: editingTask.allocId,
          taskPriorityID: parseInt(editingTask.priority),
          taskStatusID: parseInt(editingTask.status),
          taskDueDate: editingTask.dueDate || null,
          progressPercentage: editingTask.progressPercentage || 0,
          assignedScore: editingTask.assignedScore || 0,
          earnedScore: editingTask.earnedScore || 0,
          taskAssignedDate: editingTask.assignedDate || null,
          taskStartDate: editingTask.startDate || null,
          taskCompletedDate: editingTask.completedDate || null,
          nextFollowUpDate: editingTask.nextFollowUpDate || null,
          facultyRemarks: editingTask.facultyRemarks || '',
          studentRemarks: editingTask.studentRemarks || ''
        })
      });
      if (response.ok) {
        fetchTasks();
        setIsEditModalOpen(false);
      } else {
        alert("Failed to update task.");
      }
    } catch (e) { console.error('Error updating task:', e); }
  };

  // Search filter logic
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to get priority badge classes
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  // Helper to get status badge classes
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-inprogress';
      case 'Pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  return (
    <>
      {/* =========================================
          1. UI CODE
          ========================================= */}
      <div className="container-fluid p-0">

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Manage Tasks</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Project Management</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Tasks</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Top Action Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <div className="search-box position-relative" style={{ width: '100%', maxWidth: '350px' }}>
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              viewBox="0 0 16 16"
              style={{ zIndex: 10 }}
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>

            <input
              type="text"
              className="form-control ps-5 shadow-none border-0 shadow-sm"
              placeholder="Search tasks by title, project, or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <i
                className="bi bi-x-circle-fill position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                style={{ cursor: 'pointer', fontSize: '0.9rem', zIndex: 10 }}
                onClick={() => setSearchTerm('')}
              ></i>
            )}
          </div>
          <button className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate('/add-task')}>
            {/* Plus Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Add New Task
          </button>
        </div>

        {/* Task Table Card */}
        <div className="card spms-premium-card border-0">
          <div className="card-body p-4">

            <div className="table-responsive">
              <table className="table table-hover align-middle spms-table mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '22%' }}>Task Title</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '18%' }}>Project Name</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '10%' }}>Priority</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '12%' }}>Status</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '13%' }}>Due Date</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase text-center" style={{ width: '10%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <tr key={task.id} className="spms-table-row">
                        <td>
                          <span
                            className="fw-bold text-dark"
                            style={{ fontSize: '0.95rem', cursor: 'pointer', color: '#6B5CA5' }}
                            onClick={() => navigate(`/task-detail?id=${task.id}`)}
                            title="View task details"
                          >
                            {task.title}
                          </span>
                        </td>
                        <td>
                          <span className="text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>{task.project}</span>
                        </td>
                        <td>
                          <span className={`task-badge ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`task-badge ${getStatusClass(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center text-secondary small fw-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                            </svg>
                            {task.dueDate}
                          </div>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-light text-primary me-2 action-btn"
                            title="Edit Task"
                            onClick={(e) => { e.stopPropagation(); handleEditClick(task); }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                            </svg>
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger action-btn"
                            title="Delete Task"
                            onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
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
                    /* Empty State UI */
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="text-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#CBD5E1" className="bi bi-search mb-3" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                          </svg>
                          <h6 className="mt-3 fw-semibold text-dark">No Tasks Found</h6>
                          <p className="mb-0 fs-7">We couldn't find any tasks matching "{searchTerm}".</p>
                        </div>
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
                <h5 className="fw-bold text-dark mb-0">Edit Task</h5>
                <span className="text-muted small">Update status and details</span>
              </div>
              <button type="button" className="btn-close shadow-none" onClick={() => setIsEditModalOpen(false)}></button>
            </div>
            <div className="card-body px-4 pb-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="row">
                <div className="col-md-6 pe-md-4 border-end-md">
                  <h6 className="fw-bold text-primary mb-3 mt-2 border-bottom pb-2" style={{ color: '#6B5CA5' }}>Core Details</h6>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Task Title <span className="text-danger">*</span></label>
                    <input type="text" className="form-control spms-input shadow-none" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Description</label>
                    <textarea className="form-control spms-input shadow-none" rows="2" value={editingTask.description || ''} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Project Allocation</label>
                    <select className="form-select spms-input shadow-none" value={editingTask.allocId} onChange={(e) => setEditingTask({ ...editingTask, allocId: parseInt(e.target.value) || 0 })}>
                      <option value={0}>-- Select Allocation --</option>
                      {allocationsList.map(a => <option key={a.projectAllocationID} value={a.projectAllocationID}>{a.projectTitle} - {a.studentName}</option>)}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label fw-bold text-secondary small">Priority</label>
                      <select className="form-select spms-input shadow-none" value={editingTask.priority} onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}>
                        {prioritiesList.map(p => <option key={p.taskPriorityID} value={p.taskPriorityID}>{p.taskPriorityName}</option>)}
                      </select>
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label fw-bold text-secondary small">Status</label>
                      <select className="form-select spms-input shadow-none" value={editingTask.status} onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}>
                        {statusesList.map(s => <option key={s.taskStatusID} value={s.taskStatusID}>{s.taskStatusName}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary small">Progress Percentage (%)</label>
                    <input type="number" className="form-control spms-input shadow-none" min="0" max="100" value={editingTask.progressPercentage || 0} onChange={(e) => setEditingTask({ ...editingTask, progressPercentage: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>

                <div className="col-md-6 ps-md-4">
                  <h6 className="fw-bold text-primary mb-3 mt-2 border-bottom pb-2" style={{ color: '#6B5CA5' }}>Dates & Scores</h6>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label fw-bold text-secondary small">Assigned Date</label>
                      <input type="date" className="form-control spms-input shadow-none" value={editingTask.assignedDate ? editingTask.assignedDate.split('T')[0] : ''} onChange={(e) => setEditingTask({ ...editingTask, assignedDate: e.target.value })} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label fw-bold text-secondary small">Start Date</label>
                      <input type="date" className="form-control spms-input shadow-none" value={editingTask.startDate ? editingTask.startDate.split('T')[0] : ''} onChange={(e) => setEditingTask({ ...editingTask, startDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label fw-bold text-secondary small">Due Date</label>
                      <input type="date" className="form-control spms-input shadow-none" value={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label fw-bold text-secondary small">Completed Date</label>
                      <input type="date" className="form-control spms-input shadow-none" value={editingTask.completedDate ? editingTask.completedDate.split('T')[0] : ''} onChange={(e) => setEditingTask({ ...editingTask, completedDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Next Follow-up Date</label>
                    <input type="date" className="form-control spms-input shadow-none" value={editingTask.nextFollowUpDate ? editingTask.nextFollowUpDate.split('T')[0] : ''} onChange={(e) => setEditingTask({ ...editingTask, nextFollowUpDate: e.target.value })} />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label fw-bold text-secondary small">Assigned Score</label>
                      <input type="number" className="form-control spms-input shadow-none" value={editingTask.assignedScore || 0} onChange={(e) => setEditingTask({ ...editingTask, assignedScore: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label fw-bold text-secondary small">Earned Score</label>
                      <input type="number" className="form-control spms-input shadow-none" value={editingTask.earnedScore || 0} onChange={(e) => setEditingTask({ ...editingTask, earnedScore: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6 pe-md-4 mb-3">
                  <label className="form-label fw-bold text-secondary small">Faculty Remarks</label>
                  <textarea className="form-control spms-input shadow-none" rows="2" value={editingTask.facultyRemarks || ''} onChange={(e) => setEditingTask({ ...editingTask, facultyRemarks: e.target.value })}></textarea>
                </div>
                <div className="col-md-6 ps-md-4 mb-3">
                  <label className="form-label fw-bold text-secondary small">Student Remarks</label>
                  <textarea className="form-control spms-input shadow-none" rows="2" value={editingTask.studentRemarks || ''} onChange={(e) => setEditingTask({ ...editingTask, studentRemarks: e.target.value })}></textarea>
                </div>
              </div>
            </div>
            <div className="card-footer bg-white border-top-0 px-4 pb-4 pt-0 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-light fw-semibold px-4" onClick={() => setIsEditModalOpen(false)} style={{ color: '#64748B' }}>Cancel</button>
              <button type="button" className="btn spms-btn-primary px-4 shadow-sm" onClick={submitEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          2. STYLE TAG (Placed after UI code)
          ========================================= */}
      <style>
        {`
          /* Premium Card Styling */
          .spms-premium-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important; /* Purple Accent */
          }

          /* Table Styling */
          .spms-table th {
            font-size: 0.75rem;
            letter-spacing: 0.8px;
            border-bottom: 2px solid #F1F5F9;
            padding-bottom: 15px;
            color: #64748B !important;
          }

          .spms-table td {
            padding: 16px 10px;
            border-bottom: 1px solid #F1F5F9;
            vertical-align: middle;
          }
          
          .spms-table-row {
            transition: background-color 0.2s;
          }

          .spms-table-row:hover {
            background-color: #F8FAFC !important;
          }
          
          .spms-table tbody tr:last-child td {
            border-bottom: none;
          }

          /* Task Badges */
          .task-badge {
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border: 1px solid transparent;
            display: inline-block;
          }

          /* Priority Badge Colors */
          .task-badge.priority-high { background-color: rgba(239, 68, 68, 0.1); color: #EF4444; border-color: rgba(239, 68, 68, 0.2); }
          .task-badge.priority-medium { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; border-color: rgba(245, 158, 11, 0.2); }
          .task-badge.priority-low { background-color: rgba(59, 130, 246, 0.1); color: #3B82F6; border-color: rgba(59, 130, 246, 0.2); }

          /* Status Badge Colors */
          .task-badge.status-completed { background-color: rgba(32, 201, 151, 0.1); color: #17a57a; border-color: rgba(32, 201, 151, 0.2); }
          .task-badge.status-inprogress { background-color: rgba(107, 92, 165, 0.1); color: #6B5CA5; border-color: rgba(107, 92, 165, 0.2); }
          .task-badge.status-pending { background-color: rgba(138, 146, 166, 0.1); color: #64748B; border-color: rgba(138, 146, 166, 0.2); }

          /* Assigned Avatar */
          .avatar-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.80rem;
          }

          /* Action Buttons inside Table */
          .action-btn {
            border-radius: 8px;
            border: 1px solid transparent;
            background-color: #F1F5F9;
            width: 34px;
            height: 34px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            transition: all 0.2s ease;
          }

          .action-btn:hover {
            background-color: #E2E8F0;
            border-color: #CBD5E1;
            transform: scale(1.05);
          }

          .action-btn svg {
            margin: 0;
          }

          /* Primary Add Button */
          .spms-btn-primary {
            background-color: #6B5CA5;
            color: #FFFFFF;
            font-weight: 600;
            padding: 10px 20px;
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

          /* Search Box */
          .search-box .form-control {
            border-radius: 8px;
            background-color: #FFFFFF;
            font-size: 0.9rem;
            padding-top: 10px;
            padding-bottom: 10px;
            transition: all 0.2s;
          }

          .search-box .form-control:focus {
            background-color: #FFFFFF;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }

          /* Custom Edit Modal Styling */
          .spms-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1050;
          }
          
          .spms-modal-content {
            width: 100%;
            max-width: 800px;
            animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @media (min-width: 768px) {
            .border-end-md {
              border-right: 1px solid #F1F5F9;
            }
          }

          @keyframes slideUpFade {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default ManageTask;