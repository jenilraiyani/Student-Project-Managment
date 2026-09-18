import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Dashboard = () => {
  const { userType, currentUser } = useContext(UserContext);
  const [data, setData] = React.useState(null);
  const [roleData, setRoleData] = React.useState({ allocs: [], tasks: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };
        const [dashRes, allocRes, taskRes] = await Promise.all([
          fetch('https://localhost:7089/api/Dashboard', { headers }),
          fetch('https://localhost:7089/api/ProjectAllocation', { headers }),
          fetch('https://localhost:7089/api/Task', { headers })
        ]);

        if (dashRes.ok) {
          const result = await dashRes.json();
          setData(result);
        }

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
        setRoleData({ allocs, tasks });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const renderDashboard = () => {
    if (loading) return <div className="p-5 text-center text-muted">Loading Dashboard...</div>;

    const role = (userType || '').toLowerCase();
    switch (role) {
      case 'admin':
        if (!data) return <div className="p-5 text-center text-danger">Failed to load data</div>;
        return <AdminDashboard data={data} />;
      case 'faculty':
        return <FacultyDashboard data={data} roleData={roleData} currentUser={currentUser} />;
      case 'student':
        return <StudentDashboard data={data} roleData={roleData} currentUser={currentUser} />;
      default:
        return <div className="p-5 text-center text-muted">Invalid User Type or Loading...</div>;
    }
  };

  return (
    <>
      {renderDashboard()}

      {/* =========================================
          GLOBAL STYLE TAG (Applies to all dashboards)
          ========================================= */}
      <style>
        {`
          /* Professional Keyframe Animations */
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .spms-animate-up {
            opacity: 0; /* Elements start hidden */
            animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Premium Card Styling */
          .spms-premium-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important; /* Purple Accent */
          }

          /* KPI Card Styling */
          .spms-kpi-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .spms-kpi-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
          }

          .kpi-icon-box {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Primary Button */
          .spms-btn-primary {
            background-color: #6B5CA5; /* Purple Accent */
            color: #FFFFFF;
            font-weight: 600;
            padding: 8px 18px;
            border-radius: 8px;
            border: none;
            transition: all 0.3s ease;
            font-size: 0.85rem;
          }

          .spms-btn-primary:hover {
            background-color: #55488c;
            color: #FFFFFF;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(107, 92, 165, 0.2);
          }

          /* Outline Button */
          .spms-btn-outline {
            color: #6B5CA5;
            border: 1px solid rgba(107, 92, 165, 0.3);
            font-weight: 600;
            padding: 8px 18px;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-size: 0.85rem;
          }
          .spms-btn-outline:hover {
            background-color: #F8FAFC;
            border-color: #6B5CA5;
          }

          /* Table Styling */
          .spms-table th {
            font-size: 0.70rem;
            letter-spacing: 0.8px;
            border-bottom: 2px solid #F1F5F9;
            color: #64748B !important;
          }

          .spms-table td {
            font-size: 0.95rem;
            padding: 12px 10px;
            border-bottom: 1px solid #F1F5F9;
            vertical-align: middle;
          }
          
          .spms-table tbody tr:last-child td {
            border-bottom: none;
          }

          /* Professional Status Badges */
          .spms-badge {
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 0.70rem;
            font-weight: 700;
            display: inline-block;
            letter-spacing: 0.3px;
            text-transform: uppercase;
          }

          .badge-completed { background-color: rgba(32, 201, 151, 0.1); color: #17a57a; border: 1px solid rgba(32, 201, 151, 0.2); }
          .badge-inprogress { background-color: rgba(107, 92, 165, 0.1); color: #6B5CA5; border: 1px solid rgba(107, 92, 165, 0.2); }
          .badge-pending { background-color: rgba(245, 158, 11, 0.1); color: #D97706; border: 1px solid rgba(245, 158, 11, 0.2); }
          
          /* Priority Badges */
          .task-priority-badge {
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 0.70rem;
            font-weight: 700;
            display: inline-block;
            letter-spacing: 0.3px;
            text-transform: uppercase;
          }
          
          .priority-high { background-color: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2); }
          .priority-medium { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.2); }
          .priority-low { background-color: rgba(59, 130, 246, 0.1); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.2); }

          /* Avatar Circle */
          .avatar-circle {
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(107, 92, 165, 0.2);
          }
        `}
      </style>
    </>
  );
};

// ============================================================================
// 1. ADMIN DASHBOARD
// ============================================================================
const AdminDashboard = ({ data }) => {
  const apiData = data || {};
  const projectProgress = apiData.projectProgress || apiData.ProjectProgress || [];
  const upcomingTasks = apiData.upcomingTasks || apiData.UpcomingTasks || [];
  const overdueTasks = apiData.overdueTasks || apiData.OverdueTasks || [];
  const taskStatus = apiData.taskStatusSummary || apiData.TaskStatusSummary || [];

  const getPending = (p) => p.pendingTasks !== undefined ? p.pendingTasks : (p.PendingTasks || 0);
  const getCompleted = (p) => p.completedTasks !== undefined ? p.completedTasks : (p.CompletedTasks || 0);

  const completedProjects = projectProgress.filter(p => getPending(p) === 0 && getCompleted(p) > 0).length || 0;
  const inProgressProjectsCount = projectProgress.filter(p => getPending(p) > 0).length || 0;

  // calculate percentages for project status panel
  const totalP = projectProgress.length;
  const completedPct = totalP > 0 ? Math.round((completedProjects / totalP) * 100) : 0;
  const inProgressPct = totalP > 0 ? Math.round((inProgressProjectsCount / totalP) * 100) : 0;

  const kpiData = [
    {
      id: 1, title: 'Total Students', count: apiData.totalStudents || apiData.TotalStudents || 0, iconColor: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)',
      svg: <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    },
    {
      id: 2, title: 'Total Faculty', count: apiData.totalFaculty || apiData.TotalFaculty || 0, iconColor: '#6B5CA5', bgColor: 'rgba(107, 92, 165, 0.1)',
      svg: <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7 1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
    },
    {
      id: 3, title: 'Active Projects', count: apiData.totalProjects || apiData.TotalProjects || 0, iconColor: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)',
      svg: <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v2h3a2 2 0 0 1 2 2v2h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1V4.5a2 2 0 0 1 2-2h3v-2A.5.5 0 0 1 8 0zM2 4.5V6h12V4.5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zM13 7H3v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7z" />
    },
    {
      id: 4, title: 'Completed Projects', count: completedProjects, iconColor: '#20C997', bgColor: 'rgba(32, 201, 151, 0.1)',
      svg: <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
    }
  ];

  const overdueProjs = apiData.overdueProjects || apiData.OverdueProjects || [];

  const recentProjects = overdueProjs.slice(0, 4).map((p, index) => ({
    id: index,
    title: p.projectTitle || p.ProjectTitle,
    student: p.student || p.Student || 'Unassigned',
    status: p.progressPercentage === 100 ? 'Completed' : 'In Progress',
    date: new Date(p.projectEndDate || p.ProjectEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    badgeClass: p.progressPercentage === 100 ? 'badge-completed' : 'badge-inprogress'
  }));

  const upcomingDeadlines = upcomingTasks.slice(0, 4).map((t, index) => ({
    id: index,
    title: t.taskTitle || t.TaskTitle,
    days: `${t.remainingDays || t.RemainingDays || 0} Days Left`,
    date: new Date(t.taskDueDate || t.TaskDueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    color: (t.remainingDays || t.RemainingDays || 0) < 3 ? '#dc3545' : '#F59E0B'
  }));

  const recentTasks = (apiData.studentTasks || apiData.StudentTasks || []).slice(0, 4).map((t, index) => ({
    id: index,
    title: `Task Assignment`,
    project: t.studentName || t.StudentName,
    assignedTo: t.studentName || t.StudentName,
    priority: 'Medium',
    status: 'In Progress',
    badgeClass: 'priority-medium'
  }));

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4 spms-animate-up" style={{ animationDelay: '0.1s' }}>
        <div>
          <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Admin Dashboard</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
              <li className="breadcrumb-item active fw-semibold" aria-current="page">Dashboard</li>
            </ol>
          </nav>
        </div>
        <div>
          <button className="btn spms-btn-primary shadow-sm d-flex align-items-center gap-2">
            Generate Report
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4 mb-4">
        {kpiData.map((kpi, index) => (
          <div className="col spms-animate-up" style={{ animationDelay: `${0.2 + (index * 0.1)}s` }} key={kpi.id}>
            <div className="card spms-kpi-card h-100 border-0 shadow-sm">
              <div className="card-body d-flex align-items-center p-4">
                <div className="kpi-icon-box me-3" style={{ backgroundColor: kpi.bgColor, color: kpi.iconColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">{kpi.svg}</svg>
                </div>
                <div>
                  <h6 className="text-muted fw-semibold mb-1 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>{kpi.title}</h6>
                  <h3 className="fw-bold mb-0 text-dark">{kpi.count}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Projects Overview */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8 spms-animate-up" style={{ animationDelay: '0.6s' }}>
          <div className="card spms-premium-card border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">Recent Projects Assigned</h6>
              <a href="#" className="text-decoration-none text-primary fw-semibold" style={{ fontSize: '0.85rem' }}>View All</a>
            </div>
            <div className="card-body p-4 pt-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle spms-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '40%' }}>Project Name</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '25%' }}>Student</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '20%' }}>Status</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3 text-end" style={{ width: '15%' }}>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project.id}>
                        <td><span className="fw-semibold text-dark">{project.title}</span></td>
                        <td className="text-secondary fw-medium">
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle me-2 bg-light text-primary fw-bold" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>
                              {project.student.charAt(0)}
                            </div>
                            <span style={{ fontSize: '0.9rem' }}>{project.student}</span>
                          </div>
                        </td>
                        <td><span className={`spms-badge ${project.badgeClass}`}>{project.status}</span></td>
                        <td className="text-secondary text-end small fw-medium">{project.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Project Status Panel */}
        <div className="col-12 col-xl-4 spms-animate-up" style={{ animationDelay: '0.7s' }}>
          <div className="card spms-premium-card border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold text-dark mb-0">Project Status Overview</h6>
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>Completed</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{completedPct}%</span>
                </div>
                <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: `${completedPct}%`, backgroundColor: '#20C997' }}></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>In Progress</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{inProgressPct}%</span>
                </div>
                <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: `${inProgressPct}%`, backgroundColor: '#6B5CA5' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Deadlines & Tasks */}
      <div className="row g-4">
        <div className="col-12 col-xl-6 spms-animate-up" style={{ animationDelay: '0.8s' }}>
          <div className="card spms-premium-card border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">Upcoming Deadlines</h6>
            </div>
            <div className="card-body p-4 pt-1">
              <ul className="list-group list-group-flush">
                {upcomingDeadlines.map((item) => (
                  <li key={item.id} className="list-group-item px-0 py-3 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: '#F1F5F9' }}>
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></div>
                      <div>
                        <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{item.title}</h6>
                        <span className="text-secondary small">{item.date}</span>
                      </div>
                    </div>
                    <span className="badge rounded-pill fw-semibold px-3 py-2" style={{ backgroundColor: `${item.color}15`, color: item.color, fontSize: '0.75rem' }}>{item.days}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6 spms-animate-up" style={{ animationDelay: '0.9s' }}>
          <div className="card spms-premium-card border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">Recent Tasks Assigned</h6>
              <a href="#" className="text-decoration-none text-primary fw-semibold" style={{ fontSize: '0.85rem' }}>View All</a>
            </div>
            <div className="card-body p-4 pt-2">
              <div className="table-responsive">
                <table className="table table-hover align-middle spms-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '30%' }}>Task</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '25%' }}>Project</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '20%' }}>Assigned To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map((task) => (
                      <tr key={task.id}>
                        <td><span className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{task.title}</span></td>
                        <td className="text-secondary" style={{ fontSize: '0.8rem' }}>{task.project}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle me-2 bg-light text-primary fw-bold" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>
                              {task.assignedTo.charAt(0)}
                            </div>
                            <span style={{ fontSize: '0.8rem' }}>{task.assignedTo}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. FACULTY DASHBOARD
// ============================================================================
const FacultyDashboard = ({ data, roleData, currentUser }) => {
  const navigate = useNavigate();
  const myId = Number(currentUser?.userId);
  const allocs = (roleData?.allocs || []).filter(a => Number(a.facultyID) === myId);
  const allocIds = new Set(allocs.map(a => a.projectAllocationID));
  const myTasks = (roleData?.tasks || []).filter(t => allocIds.has(t.projectAllocationID));

  const avgProgress = allocs.length
    ? Math.round(allocs.reduce((s, a) => {
        const tks = myTasks.filter(t => t.projectAllocationID === a.projectAllocationID);
        if (!tks.length) return s + (Number(a.progressPercentage) || 0);
        return s + Math.round(tks.reduce((x, t) => x + (Number(t.progressPercentage) || 0), 0) / tks.length);
      }, 0) / allocs.length)
    : 0;

  const uniqueStudents = new Set(allocs.map(a => a.studentID)).size;

  const kpiData = [
    {
      id: 1, title: 'My Active Projects', count: allocs.length, subtitle: 'currently supervising', iconColor: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)',
      svg: <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v2h3a2 2 0 0 1 2 2v2h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1V4.5a2 2 0 0 1 2-2h3v-2A.5.5 0 0 1 8 0zM2 4.5V6h12V4.5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zM13 7H3v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7z" />
    },
    {
      id: 2, title: 'My Students', count: uniqueStudents, subtitle: 'assigned to my projects', iconColor: '#20C997', bgColor: 'rgba(32, 201, 151, 0.1)',
      svg: <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    },
    {
      id: 3, title: 'Average Progress', count: `${avgProgress}%`, subtitle: 'overall completion', iconColor: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)',
      svg: <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
    }
  ];

  const myProjects = allocs.slice(0, 5).map((a) => {
    const tks = myTasks.filter(t => t.projectAllocationID === a.projectAllocationID);
    const progress = tks.length
      ? Math.round(tks.reduce((s, t) => s + (Number(t.progressPercentage) || 0), 0) / tks.length)
      : Number(a.progressPercentage) || 0;
    return {
      id: a.projectAllocationID,
      projectId: a.projectID,
      title: a.projectTitle,
      students: a.studentName || 'Unknown',
      progress
    };
  });

  const tasksToEvaluate = myTasks
    .filter(t => !t.earnedScore || Number(t.earnedScore) === 0)
    .slice(0, 4)
    .map(t => {
      const alloc = allocs.find(a => a.projectAllocationID === t.projectAllocationID);
      return {
        id: t.taskID,
        title: t.taskTitle,
        project: alloc?.projectTitle || 'Project',
        student: alloc?.studentName || 'Unknown'
      };
    });

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4 spms-animate-up" style={{ animationDelay: '0.1s' }}>
        <div>
          <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Faculty Dashboard</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
              <li className="breadcrumb-item active fw-semibold" aria-current="page">Dashboard</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary spms-btn-outline d-flex align-items-center gap-2 shadow-sm bg-white" onClick={() => navigate('/add-task')}>
            Assign New Task
          </button>
          <button className="btn spms-btn-primary shadow-sm d-flex align-items-center gap-2" onClick={() => navigate('/report')}>
            My Reports
          </button>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
        {kpiData.map((kpi, index) => (
          <div className="col spms-animate-up" style={{ animationDelay: `${0.2 + (index * 0.1)}s` }} key={kpi.id}>
            <div className="card spms-kpi-card h-100 border-0 shadow-sm">
              <div className="card-body p-4 d-flex align-items-center">
                <div className="kpi-icon-box me-3" style={{ backgroundColor: kpi.bgColor, color: kpi.iconColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">{kpi.svg}</svg>
                </div>
                <div>
                  <h6 className="text-muted fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>{kpi.title}</h6>
                  <h3 className="fw-bold mb-0 text-dark d-inline-block me-2">{kpi.count}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-7 spms-animate-up" style={{ animationDelay: '0.6s' }}>
          <div className="card spms-premium-card border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between">
              <h6 className="fw-bold text-dark mb-0">My Supervised Projects</h6>
              <button className="btn btn-sm spms-btn-outline" onClick={() => navigate('/faculty-projects')}>View All</button>
            </div>
            <div className="card-body p-4 pt-3">
              <table className="table align-middle spms-table mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-muted fw-bold text-uppercase pb-3">Project</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase pb-3">Student</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase pb-3">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {myProjects.length > 0 ? myProjects.map(p => (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/project-detail?id=${p.projectId}`)}>
                      <td><span className="fw-semibold text-dark">{p.title}</span></td>
                      <td className="text-secondary small">{p.students}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress w-100 me-2" style={{ height: '6px', borderRadius: '4px' }}>
                            <div className="progress-bar" style={{ width: `${p.progress}%`, backgroundColor: p.progress > 50 ? '#20C997' : '#6B5CA5' }}></div>
                          </div>
                          <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{p.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="text-center text-muted py-3">No supervised projects.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5 spms-animate-up" style={{ animationDelay: '0.7s' }}>
          <div className="card spms-premium-card border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold text-dark mb-0">Tasks Requiring Evaluation</h6>
            </div>
            <div className="card-body p-4 pt-3">
              <ul className="list-group list-group-flush">
                {tasksToEvaluate.length > 0 ? tasksToEvaluate.map(t => (
                  <li key={t.id} className="list-group-item px-0 py-3 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{t.title}</h6>
                      <span className="text-secondary small">{t.student} ({t.project})</span>
                    </div>
                    <button className="btn btn-sm spms-btn-outline" onClick={() => navigate('/score-remark')}>Evaluate</button>
                  </li>
                )) : (
                  <li className="list-group-item px-0 text-muted">No pending evaluations.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. STUDENT DASHBOARD (New - Based on Schema)
// ============================================================================
const StudentDashboard = ({ data, roleData, currentUser }) => {
  const navigate = useNavigate();
  const myId = Number(currentUser?.userId);
  const allocs = (roleData?.allocs || []).filter(a => Number(a.studentID) === myId);
  const allocIds = new Set(allocs.map(a => a.projectAllocationID));
  const myAllTasks = (roleData?.tasks || []).filter(t => allocIds.has(t.projectAllocationID));

  const pendingTasks = myAllTasks.filter(t => !(t.taskStatusName || '').toLowerCase().includes('complete')).length;
  const completedTasks = myAllTasks.filter(t => (t.taskStatusName || '').toLowerCase().includes('complete')).length;

  const kpiData = [
    {
      id: 1, title: 'My Projects', count: allocs.length, iconColor: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)',
      svg: <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v2h3a2 2 0 0 1 2 2v2h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1V4.5a2 2 0 0 1 2-2h3v-2A.5.5 0 0 1 8 0zM2 4.5V6h12V4.5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zM13 7H3v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7z" />
    },
    {
      id: 2, title: 'Pending Tasks', count: pendingTasks, iconColor: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)',
      svg: <path d="M8 4.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .25.433l3 1.5a.5.5 0 0 0 .447-.894l-2.697-1.348V5a.5.5 0 0 0-.5-.5z" />
    },
    {
      id: 3, title: 'Completed Tasks', count: completedTasks, iconColor: '#20C997', bgColor: 'rgba(32, 201, 151, 0.1)',
      svg: <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
    }
  ];

  const myTasks = myAllTasks.slice(0, 5).map((t) => {
    const alloc = allocs.find(a => a.projectAllocationID === t.projectAllocationID);
    const status = t.taskStatusName || 'Pending';
    const s = status.toLowerCase();
    return {
      id: t.taskID,
      title: t.taskTitle,
      project: alloc?.projectTitle || 'Project',
      priority: t.taskPriorityName || 'Medium',
      status,
      dueDate: t.taskDueDate ? new Date(t.taskDueDate).toLocaleDateString('en-GB') : 'N/A',
      badgeClass: s.includes('complete') ? 'badge-completed' : s.includes('progress') ? 'badge-inprogress' : 'badge-pending',
      priorityClass: (t.taskPriorityName || '').toLowerCase().includes('high') ? 'priority-high' : (t.taskPriorityName || '').toLowerCase().includes('low') ? 'priority-low' : 'priority-medium'
    };
  });

  const recentEvaluations = myAllTasks
    .filter(t => Number(t.earnedScore) > 0 || (t.facultyRemarks && t.facultyRemarks.trim()))
    .slice(0, 4)
    .map(t => {
      const alloc = allocs.find(a => a.projectAllocationID === t.projectAllocationID);
      return {
        id: t.taskID,
        title: t.taskTitle,
        project: alloc?.projectTitle || 'Project',
        earned: t.earnedScore || 0,
        assigned: t.assignedScore || 100,
        remarks: t.facultyRemarks || 'No remarks'
      };
    });

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4 spms-animate-up" style={{ animationDelay: '0.1s' }}>
        <div>
          <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Student Dashboard</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
              <li className="breadcrumb-item active fw-semibold" aria-current="page">My Dashboard</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn spms-btn-outline shadow-sm bg-white" onClick={() => navigate('/my-projects')}>My Projects</button>
          <button className="btn spms-btn-primary shadow-sm" onClick={() => navigate('/my-tasks')}>My Tasks</button>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
        {kpiData.map((kpi, index) => (
          <div className="col spms-animate-up" style={{ animationDelay: `${0.2 + (index * 0.1)}s` }} key={kpi.id}>
            <div className="card spms-kpi-card h-100 border-0 shadow-sm">
              <div className="card-body p-4 d-flex align-items-center">
                <div className="kpi-icon-box me-3" style={{ backgroundColor: kpi.bgColor, color: kpi.iconColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">{kpi.svg}</svg>
                </div>
                <div>
                  <h6 className="text-muted fw-semibold mb-1 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>{kpi.title}</h6>
                  <h3 className="fw-bold mb-0 text-dark d-inline-block me-2">{kpi.count}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-7 spms-animate-up" style={{ animationDelay: '0.6s' }}>
          <div className="card spms-premium-card border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between">
              <h6 className="fw-bold text-dark mb-0">My Current Tasks</h6>
              <button className="btn btn-sm spms-btn-outline" onClick={() => navigate('/my-tasks')}>View All</button>
            </div>
            <div className="card-body p-4 pt-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle spms-table mb-0">
                  <thead>
                    <tr>
                      <th className="text-muted fw-bold text-uppercase pb-3" style={{ width: '35%' }}>Task & Project</th>
                      <th className="text-muted fw-bold text-uppercase pb-3" style={{ width: '20%' }}>Priority</th>
                      <th className="text-muted fw-bold text-uppercase pb-3" style={{ width: '25%' }}>Status</th>
                      <th className="text-muted fw-bold text-uppercase pb-3 text-end" style={{ width: '20%' }}>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTasks.length > 0 ? myTasks.map((task) => (
                      <tr key={task.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/task-detail?id=${task.id}`)}>
                        <td>
                          <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{task.title}</div>
                          <div className="text-secondary small">{task.project}</div>
                        </td>
                        <td><span className={`task-priority-badge ${task.priorityClass}`}>{task.priority}</span></td>
                        <td><span className={`spms-badge ${task.badgeClass}`}>{task.status}</span></td>
                        <td className="text-secondary text-end small fw-medium">{task.dueDate}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="text-center text-muted py-3">No tasks assigned yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5 spms-animate-up" style={{ animationDelay: '0.7s' }}>
          <div className="card spms-premium-card border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold text-dark mb-0">Recent Evaluations & Scores</h6>
            </div>
            <div className="card-body p-4 pt-3">
              <ul className="list-group list-group-flush">
                {recentEvaluations.length > 0 ? recentEvaluations.map(e => (
                  <li key={e.id} className="list-group-item px-0 py-3 border-bottom d-flex flex-column" style={{ borderColor: '#F1F5F9' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{e.title}</h6>
                        <span className="text-secondary small">{e.project}</span>
                      </div>
                      <span className="badge bg-light text-success border border-success px-3 py-2 fs-6">
                        {e.earned} / {e.assigned}
                      </span>
                    </div>
                    <p className="text-muted small mb-0 mt-1 fst-italic">"{e.remarks}"</p>
                  </li>
                )) : (
                  <li className="list-group-item px-0 text-muted">No evaluations yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;