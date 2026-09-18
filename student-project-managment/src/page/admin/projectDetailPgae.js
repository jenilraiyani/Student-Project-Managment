import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get('id');

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusSummary, setStatusSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetail();
  }, [projectIdParam]);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('spms_token')}`
  });

  const fetchProjectDetail = async () => {
    setLoading(true);
    try {
      const [masterRes, allocRes, taskRes, statusRes] = await Promise.all([
        projectIdParam
          ? fetch(`https://localhost:7089/api/ProjectMaster/${projectIdParam}`, { headers: authHeaders() })
          : Promise.resolve(null),
        fetch('https://localhost:7089/api/ProjectAllocation', { headers: authHeaders() }),
        fetch('https://localhost:7089/api/Task', { headers: authHeaders() }),
        fetch('https://localhost:7089/api/TaskStatus', { headers: authHeaders() })
      ]);

      let master = null;
      if (masterRes && masterRes.ok) {
        const masterJson = await masterRes.json();
        master = masterJson.data || masterJson.Data || null;
      }

      let allocs = [];
      if (allocRes.ok) {
        const allocJson = await allocRes.json();
        allocs = allocJson.data || allocJson.Data || [];
      }

      let allTasks = [];
      if (taskRes.ok) {
        const taskJson = await taskRes.json();
        allTasks = taskJson.data || taskJson.Data || [];
      }

      let statusList = [];
      if (statusRes && statusRes.ok) {
        const statusJson = await statusRes.json();
        statusList = statusJson.data || statusJson.Data || [];
      }

      // Prefer allocations for selected project; otherwise first allocation
      let matchedAllocs = projectIdParam
        ? allocs.filter(a => String(a.projectID) === String(projectIdParam))
        : allocs;

      if (!matchedAllocs.length && allocs.length && !projectIdParam) {
        matchedAllocs = [allocs[0]];
      }

      const primary = matchedAllocs[0] || null;
      const allocIds = new Set(matchedAllocs.map(a => a.projectAllocationID));

      const projectTasks = allTasks.filter(t => allocIds.has(t.projectAllocationID));

      // Live counts from Task API (not stored allocation fields)
      const liveTotalTasks = projectTasks.length;
      const liveCompletedTasks = projectTasks.filter(t =>
        (t.taskStatusName || '').toLowerCase().includes('complete')
      ).length;

      let st = 'Not Started';
      const avgTaskProgress = liveTotalTasks
        ? Math.round(projectTasks.reduce((s, t) => s + (Number(t.progressPercentage) || 0), 0) / liveTotalTasks)
        : 0;
      const progress = liveTotalTasks > 0
        ? avgTaskProgress
        : (primary?.progressPercentage || 0);
      if (liveCompletedTasks > 0 && liveCompletedTasks === liveTotalTasks) st = 'Completed';
      else if (liveTotalTasks > 0 || progress > 0) st = 'In Progress';

      const students = matchedAllocs.map(a => ({
        id: a.studentID,
        name: a.studentName || 'Unassigned',
        avatarColor: '#20C997'
      }));

      const uniqueStudents = students.filter(
        (s, i, arr) => arr.findIndex(x => x.id === s.id) === i
      );

      setProject({
        projectId: master?.projectID || primary?.projectID || projectIdParam || 0,
        projectTitle: master?.projectTitle || primary?.projectTitle || 'Unknown Project',
        description: master?.description || 'No description provided for this project.',
        status: st,
        startDate: primary?.projectStartDate ? new Date(primary.projectStartDate).toLocaleDateString() : 'N/A',
        endDate: primary?.projectEndDate ? new Date(primary.projectEndDate).toLocaleDateString() : 'N/A',
        assignedDate: primary?.assignedDate ? new Date(primary.assignedDate).toLocaleDateString() : 'N/A',
        faculty: {
          name: primary?.facultyName || 'Unassigned',
          email: 'faculty@spms.com',
          avatarColor: '#6B5CA5'
        },
        students: uniqueStudents.length ? uniqueStudents : [{ id: 0, name: 'Unassigned', avatarColor: '#20C997' }],
        totalTasks: liveTotalTasks,
        completedTasks: liveCompletedTasks,
        progressPercentage: progress
      });

      setTasks(projectTasks.map(t => ({
        id: t.taskID,
        title: t.taskTitle,
        status: t.taskStatusName || 'Pending',
        priority: t.taskPriorityName || 'Medium',
        dueDate: t.taskDueDate ? new Date(t.taskDueDate).toLocaleDateString() : 'N/A',
        progress: t.progressPercentage || 0
      })));

      // Dynamic status-wise counts from Task + TaskStatus APIs
      const summary = statusList.map(s => {
        const name = s.taskStatusName || 'Unknown';
        const count = projectTasks.filter(t =>
          (t.taskStatusID === s.taskStatusID) ||
          ((t.taskStatusName || '').toLowerCase() === name.toLowerCase())
        ).length;
        return {
          id: s.taskStatusID,
          name,
          count,
          cssClass: s.taskStatusCssClass || ''
        };
      });

      // Include any task statuses not present in master list
      projectTasks.forEach(t => {
        const name = t.taskStatusName || 'Unknown';
        const exists = summary.some(s =>
          s.id === t.taskStatusID || s.name.toLowerCase() === name.toLowerCase()
        );
        if (!exists) {
          summary.push({
            id: t.taskStatusID || name,
            name,
            count: projectTasks.filter(x =>
              x.taskStatusID === t.taskStatusID ||
              (x.taskStatusName || '').toLowerCase() === name.toLowerCase()
            ).length,
            cssClass: t.taskStatusCssClass || ''
          });
        }
      });

      setStatusSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading details...</div>;
  if (!project) return <div className="p-4 text-center">No projects found.</div>;

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

  return (
    <>
      <div className="container-fluid p-0">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Project Details</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Projects</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">{project.projectTitle}</li>
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
            <div className="card spms-premium-card border-0 mb-4">
              <div className="card-body p-4 p-md-5">

                <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
                  <div>
                    <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                      Project ID: PROJ-{String(project.projectId).padStart(4, '0')}
                    </span>
                    <h3 className="fw-bold text-dark mt-1 mb-0">{project.projectTitle}</h3>
                  </div>
                  <span className={`spms-detail-badge ${getStatusClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="mb-5">
                  <h6 className="fw-bold text-dark mb-3">Project Description</h6>
                  <p className="text-secondary lh-lg mb-0" style={{ fontSize: '0.95rem' }}>
                    {project.description}
                  </p>
                </div>

                <div className="bg-light rounded-4 p-4 mb-5 border" style={{ borderColor: '#F1F5F9' }}>
                  <h6 className="fw-bold text-dark mb-3">Project Timeline</h6>
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <div className="d-flex align-items-center mb-1">
                        <span className="text-muted small fw-semibold text-uppercase">Start Date</span>
                      </div>
                      <div className="fw-bold text-dark">{project.startDate}</div>
                    </div>
                    <div className="col-sm-4">
                      <div className="d-flex align-items-center mb-1">
                        <span className="text-muted small fw-semibold text-uppercase">End Date</span>
                      </div>
                      <div className="fw-bold text-dark">{project.endDate}</div>
                    </div>
                    <div className="col-sm-4">
                      <div className="d-flex align-items-center mb-1">
                        <span className="text-muted small fw-semibold text-uppercase">Assigned On</span>
                      </div>
                      <div className="fw-bold text-dark">{project.assignedDate}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between align-items-end mb-2">
                    <h6 className="fw-bold text-dark mb-0">Overall Progress</h6>
                    <span className="fw-bold text-primary fs-5">{project.progressPercentage}%</span>
                  </div>
                  <div className="progress" style={{ height: '10px', borderRadius: '10px', backgroundColor: '#E2E8F0' }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${project.progressPercentage}%`, backgroundColor: '#6B5CA5' }}
                      aria-valuenow={project.progressPercentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Assigned Tasks */}
            <div className="card spms-premium-card border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold text-dark mb-0">Assigned Tasks</h6>
                  <span className="badge bg-light text-dark border px-3 py-2">{tasks.length} Tasks</span>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle spms-table mb-0">
                    <thead>
                      <tr>
                        <th className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>Task Name</th>
                        <th className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>Priority</th>
                        <th className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>Status</th>
                        <th className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>Due Date</th>
                        <th className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.length > 0 ? (
                        tasks.map(task => (
                          <tr key={task.id} className="spms-table-row">
                            <td>
                              <span
                                className="fw-bold text-dark task-name-link"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/task-detail?id=${task.id}`)}
                                title="View task details"
                              >
                                {task.title}
                              </span>
                            </td>
                            <td>
                              <span className={`spms-mini-badge ${getPriorityClass(task.priority)}`}>{task.priority}</span>
                            </td>
                            <td>
                              <span className={`spms-mini-badge ${getStatusClass(task.status)}`}>{task.status}</span>
                            </td>
                            <td className="text-secondary small fw-medium">{task.dueDate}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress flex-grow-1" style={{ height: '6px', borderRadius: '6px', backgroundColor: '#E2E8F0', minWidth: '60px' }}>
                                  <div className="progress-bar" style={{ width: `${task.progress}%`, backgroundColor: '#6B5CA5' }}></div>
                                </div>
                                <span className="small fw-semibold text-secondary">{task.progress}%</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No tasks assigned to this project yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">

            <div className="card spms-premium-card border-0 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Supervising Faculty</h6>
                <div className="d-flex align-items-center">
                  <div className="spms-detail-avatar me-3 shadow-sm" style={{ backgroundColor: project.faculty.avatarColor, width: '48px', height: '48px', fontSize: '1.2rem' }}>
                    {project.faculty.name.charAt(0)}
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">{project.faculty.name}</h6>
                    <p className="text-secondary small mb-0">{project.faculty.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card spms-premium-card border-0 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Assigned Students</h6>
                <div className="d-flex flex-column gap-3">
                  {project.students.map((student) => (
                    <div key={student.id} className="d-flex align-items-center p-2 rounded-3" style={{ backgroundColor: '#F8FAFC' }}>
                      <div className="spms-detail-avatar me-3 shadow-sm" style={{ backgroundColor: student.avatarColor, width: '38px', height: '38px', fontSize: '1rem' }}>
                        {student.name.charAt(0)}
                      </div>
                      <span className="fw-semibold text-dark">{student.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card spms-premium-card border-0">
              <div className="card-body p-4">
                <h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Task Summary</h6>

                <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <span className="fw-semibold text-secondary">Total Tasks</span>
                  <span className="badge bg-light text-dark border px-3 py-2 fs-6">{project.totalTasks}</span>
                </div>

                {statusSummary.length > 0 ? (
                  statusSummary.map((item, index) => {
                    const isLast = index === statusSummary.length - 1;
                    const s = (item.name || '').toLowerCase();
                    let badgeClass = 'bg-light text-dark border';
                    if (s.includes('complete')) badgeClass = 'bg-light text-success border border-success';
                    else if (s.includes('progress')) badgeClass = 'bg-light border';
                    else if (s.includes('pending') || s.includes('open')) badgeClass = 'bg-light text-warning border border-warning';
                    else if (s.includes('reject') || s.includes('hold') || s.includes('cancel')) badgeClass = 'bg-light text-danger border border-danger';

                    return (
                      <div
                        key={item.id}
                        className={`d-flex justify-content-between align-items-center ${isLast ? '' : 'mb-3 pb-3 border-bottom'}`}
                      >
                        <span className="fw-semibold text-secondary">{item.name}</span>
                        <span
                          className={`badge px-3 py-2 fs-6 ${badgeClass}`}
                          style={s.includes('progress') ? { color: '#6B5CA5', borderColor: 'rgba(107,92,165,0.3)' } : undefined}
                        >
                          {item.count}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-muted small">No status data found.</div>
                )}
              </div>
            </div>

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

          .spms-detail-badge, .spms-mini-badge {
            padding: 6px 16px;
            border-radius: 8px;
            font-size: 0.80rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid transparent;
            display: inline-block;
          }
          .spms-mini-badge { padding: 4px 10px; font-size: 0.70rem; }

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

          .spms-table th {
            border-bottom: 2px solid #F1F5F9;
            padding-bottom: 12px;
          }
          .spms-table td {
            padding: 14px 10px;
            border-bottom: 1px solid #F1F5F9;
          }
          .spms-table-row:hover { background-color: #F8FAFC !important; }

          .task-name-link:hover {
            color: #6B5CA5 !important;
            text-decoration: underline;
          }
        `}
      </style>
    </>
  );
};

export default ProjectDetails;
