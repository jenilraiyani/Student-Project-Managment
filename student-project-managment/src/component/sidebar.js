import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../page/context/UserContext';

const Sidebar = () => {
  const { userType, currentUser } = useContext(UserContext);
  const role = (userType || '').toLowerCase();
  const isAdmin = role === 'admin';
  const isFaculty = role === 'faculty';
  const isStudent = role === 'student';

  return (
    <>
      <div className="spms-sidebar d-none d-md-flex">

        <div className="sidebar-brand" style={{ fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
          <div className="sidebar-brand-icon" style={{ backgroundColor: 'transparent', width: '32px', height: '32px' }}>
            <img src="/logo.png" alt="ProjectSphere Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          ProjectSphere
        </div>

        <div className="sidebar-menu">
          <div className="menu-label">Main</div>

          <Link to="/" className="sidebar-link">
            <i className="bi bi-display"></i> Dashboard
          </Link>

          {isAdmin && (
            <>
              <div className="menu-label">Admin Modules</div>

              <Link to="/manage-role" className="sidebar-link">
                <i className="bi bi-shield-check"></i> Manage Roles
              </Link>
              <Link to="/manage-user-type" className="sidebar-link">
                <i className="bi bi-shield-check"></i> Manage User Type
              </Link>
              <Link to="/manage-user" className="sidebar-link">
                <i className="bi bi-people"></i> Manage Users
              </Link>
              <Link to="/manage-user-role" className="sidebar-link">
                <i className="bi bi-key"></i> Role & Permissions
              </Link>
              <Link to="/manage-priority" className="sidebar-link">
                <i className="bi bi-flag"></i> Manage Priority
              </Link>
              <Link to="/manage-status" className="sidebar-link">
                <i className="bi bi-check2-circle"></i> Manage Status
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <div className="menu-label">Project Management</div>

              <Link to="/manage-project" className="sidebar-link">
                <i className="bi bi-briefcase"></i> Manage Projects
              </Link>
              <Link to="/manage-task" className="sidebar-link">
                <i className="bi bi-list-task"></i> Manage Tasks
              </Link>
              <Link to="/manage-allocation" className="sidebar-link">
                <i className="bi bi-people"></i> Project Allocations
              </Link>
              <Link to="/score-remark" className="sidebar-link">
                <i className="bi bi-star"></i> Score & Remark
              </Link>
              <Link to="/report" className="sidebar-link">
                <i className="bi bi-file-earmark-bar-graph"></i> Report
              </Link>
            </>
          )}

          {isFaculty && (
            <>
              <div className="menu-label">Faculty Modules</div>

              <Link to="/faculty-projects" className="sidebar-link">
                <i className="bi bi-briefcase"></i> My Projects
              </Link>
              <Link to="/faculty-tasks" className="sidebar-link">
                <i className="bi bi-list-task"></i> My Tasks
              </Link>
              <Link to="/add-task" className="sidebar-link">
                <i className="bi bi-plus-circle"></i> Assign Task
              </Link>
              <Link to="/score-remark" className="sidebar-link">
                <i className="bi bi-star"></i> Score & Remark
              </Link>
              <Link to="/report" className="sidebar-link">
                <i className="bi bi-file-earmark-bar-graph"></i> Report
              </Link>
            </>
          )}

          {isStudent && (
            <>
              <div className="menu-label">My Academics</div>

              <Link to="/my-projects" className="sidebar-link">
                <i className="bi bi-briefcase"></i> My Projects
              </Link>
              <Link to="/my-tasks" className="sidebar-link">
                <i className="bi bi-list-task"></i> My Tasks
              </Link>
            </>
          )}

          <div className="menu-label">Settings</div>
          <div>
            <Link to="/profile-page" className="sidebar-link">
              <i className="bi bi-person"></i> Profile
            </Link>
          </div>

        </div>

        <div className="sidebar-user-widget">
          <div className="profile-avatar">{currentUser?.avatar}</div>
          <div className="profile-info">
            <span className="profile-name">{currentUser?.name}</span>
            <span className="profile-role">@{userType?.toLowerCase()}</span>
          </div>
          <i className="bi bi-chevron-right ms-auto text-muted" style={{ fontSize: '0.8rem' }}></i>
        </div>
      </div>

      <style>
        {`
          .spms-sidebar {
            background-color: #1A1D27; /* Dark Slate/Navy */
            min-height: 100vh;
            width: 260px;
            flex-shrink: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
          }

          .sidebar-brand {
            padding: 20px;
            color: #FFFFFF;
            font-size: 1.5rem;
            font-weight: 800;
            display: flex;
            align-items: center;
          }

          .sidebar-brand-icon {
            color: #6B5CA5; /* Purple Accent */
            margin-right: 10px;
            font-size: 1.8rem;
          }

          .sidebar-menu {
            flex-grow: 1;
            padding: 10px 15px;
            overflow-y: auto;
            
            /* Firefox Scrollbar */
            scrollbar-width: thin;
            scrollbar-color: #2A2F42 transparent;
          }

          /* Webkit (Chrome/Edge/Safari) Custom Scrollbar */
          .sidebar-menu::-webkit-scrollbar {
            width: 6px;
          }
          
          .sidebar-menu::-webkit-scrollbar-track {
            background: transparent; 
          }
          
          .sidebar-menu::-webkit-scrollbar-thumb {
            background-color: #2A2F42; /* Lighter Slate for scrollbar */
            border-radius: 10px;
          }

          .sidebar-menu::-webkit-scrollbar-thumb:hover {
            background-color: #353b52; 
          }

          .menu-label {
            color: #8A92A6; /* Inactive Text / Muted Gray */
            font-size: 0.70rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 25px 0 10px 10px;
            font-weight: 700;
          }

          .sidebar-link {
            color: #8A92A6; /* Inactive Text */
            padding: 12px 15px;
            text-decoration: none;
            display: flex;
            align-items: center;
            border-radius: 6px;
            margin-bottom: 4px;
            transition: all 0.2s ease;
            font-weight: 500;
            font-size: 0.9rem;
          }

          .sidebar-link i {
            margin-right: 15px;
            font-size: 1.1rem;
          }

          /* Hover and Active States */
          .sidebar-link:hover, .sidebar-link.active {
            background-color: #2A2F42; /* Lighter Slate */
            color: #FFFFFF; /* Solid White */
          }

          /* Bottom User Profile Widget */
          .sidebar-user-widget {
            padding: 12px;
            margin: 15px;
            background-color: #2A2F42; /* Lighter Slate */
            border-radius: 8px;
            display: flex;
            align-items: center;
            color: #FFFFFF;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .sidebar-user-widget:hover {
            background-color: #353b52;
          }

          .profile-avatar {
            width: 35px;
            height: 35px;
            border-radius: 6px;
            background-color: #6B5CA5; /* Purple Accent */
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            margin-right: 12px;
            font-size: 0.9rem;
          }

          .profile-info {
            display: flex;
            flex-direction: column;
          }

          .profile-name {
            font-size: 0.85rem;
            font-weight: 600;
          }

          .profile-role {
            font-size: 0.75rem;
            color: #8A92A6;
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;