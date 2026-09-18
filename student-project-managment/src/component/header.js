import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../page/context/UserContext';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, userType } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('spms_token');
    localStorage.removeItem('spms_userType');
    localStorage.removeItem('spms_role');
    navigate('/login');
  };

  return (
    <>
      <header className="spms-header d-flex justify-content-between align-items-center w-100">
        <div className="search-container d-none d-lg-flex align-items-center">
          <i className="bi bi-search search-icon"></i>
          <input type="text" className="search-input" placeholder="Search projects, tasks, users..." />
        </div>

        <div className="d-flex align-items-center ms-auto">
          <button className="icon-btn" type="button" title="Notifications">
            <i className="bi bi-bell"></i>
            <span className="notification-dot"></span>
          </button>

          <div className="d-flex align-items-center ms-3 ps-3 border-start">
            <div className="header-avatar d-flex align-items-center justify-content-center fw-bold text-white" style={{ backgroundColor: '#6B5CA5' }}>
              {currentUser?.avatar}
            </div>
            <div className="ms-2 d-none d-sm-block">
              <div className="header-name">{currentUser?.name}</div>
              <div className="header-email">{userType} · ProjectSphere</div>
            </div>
            <button className="btn btn-sm spms-btn-secondary ms-3 py-1 px-3" onClick={handleLogout} type="button">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <style>{`
        .spms-header {
          background-color: #FFFFFF;
          height: 65px;
          padding: 0 25px;
          border-bottom: 1px solid #E2E8F0;
          flex-shrink: 0;
        }
        .search-container {
          background-color: #F1F5F9;
          border-radius: 8px;
          padding: 8px 15px;
          width: 360px;
          border: 1px solid #E2E8F0;
        }
        .search-icon { color: #64748B; font-size: 1rem; }
        .search-input {
          border: none;
          background: transparent;
          color: #1E293B;
          padding-left: 10px;
          font-size: 0.9rem;
          width: 100%;
          outline: none;
        }
        .search-input::placeholder { color: #64748B; }
        .icon-btn {
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 1.15rem;
          position: relative;
          cursor: pointer;
          padding: 6px;
        }
        .notification-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 8px;
          height: 8px;
          background-color: #6B5CA5;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
        }
        .header-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          font-size: 0.9rem;
        }
        .header-name { color: #1E293B; font-size: 0.85rem; font-weight: 700; line-height: 1.2; }
        .header-email { color: #64748B; font-size: 0.75rem; }
      `}</style>
    </>
  );
};

export default Header;
