import React, { useContext } from 'react';

// ============================================================================
// NOTE: Replace this with your actual Context import path
// import { UserContext } from '../context/UserContext';
// ============================================================================

// Mocking Context for demonstration purposes
const UserContext = React.createContext({ userType: 'Student' }); // Change to 'Admin', 'Faculty', or 'Student' to test

const Dashboard = () => {
  // Consume your context here
  const { userType } = useContext(UserContext);

  // Render the appropriate dashboard based on userType
  const renderDashboard = () => {
    switch (userType) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Faculty':
        return <FacultyDashboard />;
      case 'Student':
        return <StudentDashboard />;
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
const AdminDashboard = () => {
  const kpiData = [
    { id: 1, title: 'Total Students', count: '1,245', iconColor: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', 
      svg: <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/> 
    },
    { id: 2, title: 'Total Faculty', count: '84', iconColor: '#6B5CA5', bgColor: 'rgba(107, 92, 165, 0.1)', 
      svg: <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7 1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/> 
    },
    { id: 3, title: 'Active Projects', count: '312', iconColor: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)', 
      svg: <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v2h3a2 2 0 0 1 2 2v2h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1V4.5a2 2 0 0 1 2-2h3v-2A.5.5 0 0 1 8 0zM2 4.5V6h12V4.5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zM13 7H3v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7z"/> 
    },
    { id: 4, title: 'Completed Projects', count: '890', iconColor: '#20C997', bgColor: 'rgba(32, 201, 151, 0.1)', 
      svg: <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/> 
    }
  ];

  const recentProjects = [
    { id: 1, title: 'AI Chatbot Integration', student: 'Priya Sharma', status: 'In Progress', date: '15 Aug 2026', badgeClass: 'badge-inprogress' },
    { id: 2, title: 'E-commerce React App', student: 'Rohan Mehta', status: 'Pending', date: '30 Nov 2026', badgeClass: 'badge-pending' },
    { id: 3, title: 'Hospital Management API', student: 'Ananya Desai', status: 'Completed', date: '10 Jul 2026', badgeClass: 'badge-completed' },
    { id: 4, title: 'Blockchain Voting System', student: 'Karan Patel', status: 'In Progress', date: '25 Sep 2026', badgeClass: 'badge-inprogress' }
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'Library Management DB', days: '2 Days Left', date: '06 Jul 2026', color: '#dc3545' },
    { id: 2, title: 'IoT Weather Station', days: '5 Days Left', date: '09 Jul 2026', color: '#F59E0B' },
    { id: 3, title: 'React Native Social App', days: '1 Week Left', date: '11 Jul 2026', color: '#6B5CA5' }
  ];

  const recentTasks = [
    { id: 1, title: 'Design Database Schema', project: 'E-commerce React App', assignedTo: 'Rohan Mehta', priority: 'High', status: 'In Progress', badgeClass: 'priority-high' },
    { id: 2, title: 'Implement JWT Auth', project: 'Hospital Management API', assignedTo: 'Ananya Desai', priority: 'High', status: 'Pending', badgeClass: 'priority-high' },
    { id: 3, title: 'Create UI Wireframes', project: 'AI Chatbot Integration', assignedTo: 'Priya Sharma', priority: 'Medium', status: 'Completed', badgeClass: 'priority-medium' },
    { id: 4, title: 'Setup CI/CD Pipeline', project: 'Blockchain Voting System', assignedTo: 'Karan Patel', priority: 'Low', status: 'Pending', badgeClass: 'priority-low' }
  ];

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
                  <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>65%</span>
                </div>
                <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: '65%', backgroundColor: '#20C997' }}></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>In Progress</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>25%</span>
                </div>
                <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: '25%', backgroundColor: '#6B5CA5' }}></div>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>Pending Approval</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>10%</span>
                </div>
                <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: '10%', backgroundColor: '#F59E0B' }}></div>
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
const FacultyDashboard = () => {
  const kpiData = [
    { id: 1, title: 'My Active Projects', count: '4', subtitle: 'currently supervising', iconColor: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', 
      svg: <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v2h3a2 2 0 0 1 2 2v2h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1V4.5a2 2 0 0 1 2-2h3v-2A.5.5 0 0 1 8 0zM2 4.5V6h12V4.5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zM13 7H3v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7z"/> 
    },
    { id: 2, title: 'My Students', count: '12', subtitle: 'assigned to my projects', iconColor: '#20C997', bgColor: 'rgba(32, 201, 151, 0.1)', 
      svg: <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/> 
    },
    { id: 3, title: 'Pending Evaluations', count: '5', subtitle: 'tasks to be graded', iconColor: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)', 
      svg: <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/> 
    }
  ];

  const myProjects = [
    { id: 1, title: 'E-commerce Platform', students: 'Priya S., Rohan M.', progress: 75, date: '01 Mar 2025' },
    { id: 2, title: 'Mobile App Development', students: 'Aditi V.', progress: 40, date: '30 Jun 2025' }
  ];

  const tasksToEvaluate = [
    { id: 1, title: 'Write SRS Document', project: 'Mobile App', student: 'Aditi Verma', submittedDate: '10 Sep 2024' },
    { id: 2, title: 'Implement Payment Gateway', project: 'E-commerce', student: 'Rohan Mehta', submittedDate: '11 Sep 2024' }
  ];

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
          <button className="btn btn-outline-primary spms-btn-outline d-flex align-items-center gap-2 shadow-sm bg-white">
            Assign New Task
          </button>
          <button className="btn spms-btn-primary shadow-sm d-flex align-items-center gap-2">
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
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold text-dark mb-0">My Supervised Projects</h6>
            </div>
            <div className="card-body p-4 pt-3">
              <table className="table align-middle spms-table mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-muted fw-bold text-uppercase pb-3">Project</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase pb-3">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {myProjects.map(p => (
                    <tr key={p.id}>
                      <td><span className="fw-semibold text-dark">{p.title}</span></td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress w-100 me-2" style={{ height: '6px', borderRadius: '4px' }}>
                            <div className="progress-bar" style={{ width: `${p.progress}%`, backgroundColor: p.progress > 50 ? '#20C997' : '#6B5CA5' }}></div>
                          </div>
                          <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{p.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                {tasksToEvaluate.map(t => (
                  <li key={t.id} className="list-group-item px-0 py-3 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{t.title}</h6>
                      <span className="text-secondary small">{t.student} ({t.project})</span>
                    </div>
                    <button className="btn btn-sm spms-btn-outline">Evaluate</button>
                  </li>
                ))}
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
const StudentDashboard = () => {
  const kpiData = [
    { id: 1, title: 'My Projects', count: '2', iconColor: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', 
      svg: <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v2h3a2 2 0 0 1 2 2v2h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1V4.5a2 2 0 0 1 2-2h3v-2A.5.5 0 0 1 8 0zM2 4.5V6h12V4.5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zM13 7H3v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7z"/> 
    },
    { id: 2, title: 'Pending Tasks', count: '3', iconColor: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)', 
      svg: <path d="M8 4.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .25.433l3 1.5a.5.5 0 0 0 .447-.894l-2.697-1.348V5a.5.5 0 0 0-.5-.5z"/> 
    },
    { id: 3, title: 'Completed Tasks', count: '14', iconColor: '#20C997', bgColor: 'rgba(32, 201, 151, 0.1)', 
      svg: <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/> 
    }
  ];

  const myTasks = [
    { id: 1, title: 'Design Database Schema', project: 'E-commerce React App', priority: 'High', status: 'In Progress', dueDate: '15 Aug 2026', badgeClass: 'badge-inprogress', priorityClass: 'priority-high' },
    { id: 2, title: 'Write SRS Document', project: 'Hospital Management', priority: 'Medium', status: 'Pending', dueDate: '18 Aug 2026', badgeClass: 'badge-pending', priorityClass: 'priority-medium' },
    { id: 3, title: 'Setup GitHub Repo', project: 'E-commerce React App', priority: 'Low', status: 'Completed', dueDate: '10 Aug 2026', badgeClass: 'badge-completed', priorityClass: 'priority-low' }
  ];

  const recentEvaluations = [
    { id: 1, title: 'Create UI Wireframes', project: 'Hospital Management', earned: 9.5, assigned: 10, remarks: 'Excellent attention to detail.', date: '05 Aug 2026' },
    { id: 2, title: 'Project Proposal', project: 'E-commerce React App', earned: 18, assigned: 20, remarks: 'Good logic, needs better formatting.', date: '01 Aug 2026' }
  ];

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
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold text-dark mb-0">My Current Tasks</h6>
            </div>
            <div className="card-body p-4 pt-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle spms-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '35%' }}>Task & Project</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '20%' }}>Priority</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3" style={{ width: '25%' }}>Status</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase pb-3 text-end" style={{ width: '20%' }}>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTasks.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{task.title}</div>
                          <div className="text-secondary small">{task.project}</div>
                        </td>
                        <td><span className={`task-priority-badge ${task.priorityClass}`}>{task.priority}</span></td>
                        <td><span className={`spms-badge ${task.badgeClass}`}>{task.status}</span></td>
                        <td className="text-secondary text-end small fw-medium">{task.dueDate}</td>
                      </tr>
                    ))}
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
                {recentEvaluations.map(e => (
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
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
