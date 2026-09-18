import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './component/layout';
import RequireRole from './component/RequireRole';
import Dashboard from './page/admin/dashboard';
import ManageRoles from './page/admin/manageRole';
import AddRole from './page/admin/addRole';
import ManageUsers from './page/admin/manageUser';
import AddUser from './page/admin/addUser';
import ManageProject from './page/admin/manageProject';
import AddProject from './page/admin/addProject';
import ManageTask from './page/admin/manageTask';
import AddTask from './page/admin/addTask';
import ManageAllocation from './page/admin/manageAllocation';
import AddAllocation from './page/admin/addAllocation';
import Login from './page/login';
import Profile from './page/profilePgae';
import Reports from './page/admin/reportPage';
import ManageUserRole from './page/admin/manageUserRole';
import ScoresAndRemarks from './page/admin/scoreAndRemarkPage';
import ProjectDetails from './page/admin/projectDetailPgae';
import TaskDetails from './page/admin/taskDetailPage';
import ManagePriority from './page/admin/managePriority';
import AddPriority from './page/admin/addPriority';
import ManageStatus from './page/admin/manageStatus';
import AddStatus from './page/admin/addStatus';
import FacultyDashboard from './page/faculty/dashboard';
import AssignRole from './page/admin/assingRole';
import { UserProvider } from './page/context/UserContext';
import ManageUserType from './page/admin/manageUserType';
import AddUserType from './page/admin/addUserzTypePage';
import StudentMyProjects from './page/student/myProjects';
import StudentMyTasks from './page/student/myTasks';
import FacultyMyProjects from './page/faculty/myProjects';
import FacultyMyTasks from './page/faculty/myTasks';

const originalFetch = window.fetch;
window.fetch = async function () {
  const response = await originalFetch.apply(this, arguments);
  if (response.status === 401) {
    if (window.location.pathname !== '/login') {
      alert('Your session has expired or you are unauthorized. Please log in again.');
      localStorage.removeItem('spms_token');
      localStorage.removeItem('spms_userType');
      localStorage.removeItem('spms_role');
      localStorage.removeItem('spms_available_roles');
      window.location.href = '/login';
    }
  }
  return response;
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('spms_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const R = ({ roles, children }) => (
  <RequireRole roles={roles}>{children}</RequireRole>
);

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/faculty" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<R roles={['faculty']}><FacultyDashboard /></R>} />
          </Route>

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* All roles */}
            <Route index element={<R roles={['admin', 'faculty', 'student']}><Dashboard /></R>} />
            <Route path="profile-page" element={<R roles={['admin', 'faculty', 'student']}><Profile /></R>} />
            <Route path="project-detail" element={<R roles={['admin', 'faculty', 'student']}><ProjectDetails /></R>} />
            <Route path="task-detail" element={<R roles={['admin', 'faculty', 'student']}><TaskDetails /></R>} />

            {/* Admin only */}
            <Route path="manage-role" element={<R roles={['admin']}><ManageRoles /></R>} />
            <Route path="add-role" element={<R roles={['admin']}><AddRole /></R>} />
            <Route path="manage-user" element={<R roles={['admin']}><ManageUsers /></R>} />
            <Route path="add-user" element={<R roles={['admin']}><AddUser /></R>} />
            <Route path="manage-project" element={<R roles={['admin']}><ManageProject /></R>} />
            <Route path="add-project" element={<R roles={['admin']}><AddProject /></R>} />
            <Route path="manage-task" element={<R roles={['admin']}><ManageTask /></R>} />
            <Route path="manage-allocation" element={<R roles={['admin']}><ManageAllocation /></R>} />
            <Route path="add-allocation" element={<R roles={['admin']}><AddAllocation /></R>} />
            <Route path="manage-user-role" element={<R roles={['admin']}><ManageUserRole /></R>} />
            <Route path="assign_role" element={<R roles={['admin']}><AssignRole /></R>} />
            <Route path="manage-user-type" element={<R roles={['admin']}><ManageUserType /></R>} />
            <Route path="add-user-type" element={<R roles={['admin']}><AddUserType /></R>} />
            <Route path="manage-priority" element={<R roles={['admin']}><ManagePriority /></R>} />
            <Route path="add-priority" element={<R roles={['admin']}><AddPriority /></R>} />
            <Route path="manage-status" element={<R roles={['admin']}><ManageStatus /></R>} />
            <Route path="add-status" element={<R roles={['admin']}><AddStatus /></R>} />

            {/* Admin + Faculty */}
            <Route path="add-task" element={<R roles={['admin', 'faculty']}><AddTask /></R>} />
            <Route path="report" element={<R roles={['admin', 'faculty']}><Reports /></R>} />
            <Route path="score-remark" element={<R roles={['admin', 'faculty']}><ScoresAndRemarks /></R>} />

            {/* Student only */}
            <Route path="my-projects" element={<R roles={['student']}><StudentMyProjects /></R>} />
            <Route path="my-tasks" element={<R roles={['student']}><StudentMyTasks /></R>} />

            {/* Faculty only */}
            <Route path="faculty-projects" element={<R roles={['faculty']}><FacultyMyProjects /></R>} />
            <Route path="faculty-tasks" element={<R roles={['faculty']}><FacultyMyTasks /></R>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
