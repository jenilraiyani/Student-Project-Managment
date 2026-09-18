import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AssignRole = () => {
  const navigate = useNavigate();

  const [availableUsers, setAvailableUsers] = useState([
    { id: '', name: '-- Select a User --', email: '', avatar: '' }
  ]);
  const [availableRoles, setAvailableRoles] = useState([
    { id: '', name: '-- Select a Role --', cssClass: '' }
  ]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          fetch('https://student-project-managment.onrender.com/api/User/dropdown', { headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` } }),
          fetch('https://student-project-managment.onrender.com/api/Role/dropdown', { headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` } })
        ]);

        if (usersRes.ok && rolesRes.ok) {
          const usersJson = await usersRes.json();
          const rolesJson = await rolesRes.json();

          const usersData = usersJson.data || usersJson.Data || [];
          const formattedUsers = usersData.map(u => ({
            id: u.userID,
            name: u.fullName,
            email: `User #${u.userID}`,
            avatar: '#6B5CA5'
          }));

          const rolesData = rolesJson.data || rolesJson.Data || [];
          const formattedRoles = rolesData.map(r => {
            const lower = (r.roleName || '').toLowerCase();
            let cssClass = 'role-student';
            if (lower.includes('admin')) cssClass = 'role-admin';
            else if (lower.includes('faculty')) cssClass = 'role-faculty';

            return {
              id: r.roleID,
              name: r.roleName,
              cssClass: cssClass
            };
          });

          setAvailableUsers([{ id: '', name: '-- Select a User --', email: '', avatar: '' }, ...formattedUsers]);
          setAvailableRoles([{ id: '', name: '-- Select a Role --', cssClass: '' }, ...formattedRoles]);
        }
      } catch (err) { console.error(err); }
    };
    fetchDropdowns();
  }, []);

  // Form State
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Derived State for Live Preview
  const currentUser = availableUsers.find(u => u.id.toString() === selectedUserId.toString());
  const currentRole = availableRoles.find(r => r.id.toString() === selectedRoleId.toString());

  // Submit Handler
  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://student-project-managment.onrender.com/api/UserRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('spms_token')}`
        },
        body: JSON.stringify({ userID: parseInt(selectedUserId), roleID: parseInt(selectedRoleId) })
      });
      if (response.ok) {
        navigate(-1);
      } else {
        alert('Failed to assign user role.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while assigning user role.');
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
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Assign User Role</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Master Configuration</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">User Roles</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Assign</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row g-4">

          {/* =========================================
              LEFT COLUMN: Configuration Form
              ========================================= */}
          <div className="col-12 col-xl-8">
            <div className="card spms-premium-card border-0 h-100">
              <div className="card-body p-4 p-md-5">

                <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Assignment Configuration</h6>

                <form onSubmit={handleSaveAssignment}>

                  {/* User Selection */}
                  <div className="row mb-4 align-items-center">
                    <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                      Select User <span className="text-danger">*</span>
                    </label>
                    <div className="col-sm-9">
                      <select
                        className="form-select spms-input shadow-none"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        required
                      >
                        {availableUsers.map(user => (
                          <option key={user.id} value={user.id} disabled={user.id === ''}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="row mb-5 align-items-center">
                    <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                      Assign Role <span className="text-danger">*</span>
                    </label>
                    <div className="col-sm-9">
                      <select
                        className="form-select spms-input shadow-none"
                        value={selectedRoleId}
                        onChange={(e) => setSelectedRoleId(e.target.value)}
                        required
                      >
                        {availableRoles.map(role => (
                          <option key={role.id} value={role.id} disabled={role.id === ''}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <div className="form-text small text-muted mt-2">
                        Assigning a new role will immediately update the user's system permissions.
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-9 d-flex gap-2">
                      <button
                        type="submit"
                        className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm"
                        disabled={!selectedUserId || !selectedRoleId}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                        </svg>
                        Confirm Assignment
                      </button>

                      <button
                        type="button"
                        className="btn spms-btn-secondary d-flex align-items-center gap-2 shadow-sm"
                        onClick={() => navigate(-1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>

                </form>

              </div>
            </div>
          </div>

          {/* =========================================
              RIGHT COLUMN: Live Summary Preview
              ========================================= */}
          <div className="col-12 col-xl-4">
            <div className="card spms-premium-card border-0 h-100 bg-light" style={{ borderColor: '#F1F5F9' }}>
              <div className="card-body p-4 text-center d-flex flex-column justify-content-center">

                <h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                  Assignment Summary Preview
                </h6>

                {currentUser && currentUser.id !== '' ? (
                  <div className="preview-container p-4 bg-white rounded-4 shadow-sm border">
                    {/* User Avatar & Info */}
                    <div className="d-flex flex-column align-items-center mb-4">
                      <div className="preview-avatar mb-3 shadow-sm" style={{ backgroundColor: currentUser.avatar }}>
                        {currentUser.name.charAt(0)}
                      </div>
                      <h5 className="fw-bold text-dark mb-1">{currentUser.name}</h5>
                      <span className="text-secondary small fw-medium">{currentUser.email}</span>
                    </div>

                    {/* Arrow Divider */}
                    <div className="text-muted mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#CBD5E1" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                      </svg>
                    </div>

                    {/* Role Badge */}
                    <div className="role-assignment-box">
                      <p className="text-muted small fw-semibold text-uppercase mb-2" style={{ fontSize: '0.7rem' }}>Will be assigned as</p>
                      {currentRole && currentRole.id !== '' ? (
                        <span className={`role-badge ${currentRole.cssClass} fs-6 px-4 py-2`}>
                          {currentRole.name}
                        </span>
                      ) : (
                        <span className="badge bg-light text-secondary border px-3 py-2">Select a role...</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted p-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#CBD5E1" className="mb-3" viewBox="0 0 16 16">
                      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                    <h6 className="fw-semibold text-dark">No User Selected</h6>
                    <p className="small mb-0">Select a user and role to see the assignment preview.</p>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================
          2. STYLE TAG
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

          /* Input Fields */
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

          /* Primary Save Button */
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

          .spms-btn-primary:hover:not(:disabled) {
            background-color: #55488c;
            color: #FFFFFF;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(107, 92, 165, 0.2);
          }

          .spms-btn-primary:disabled {
            background-color: #94A3B8;
            cursor: not-allowed;
          }

          /* Secondary Back Button */
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
            box-shadow: 0 4px 12px rgba(100, 116, 139, 0.2);
          }

          /* Role Badges (Matches List Page) */
          .role-badge {
            padding: 6px 16px;
            border-radius: 20px; /* Pill shape */
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid transparent;
            display: inline-block;
          }

          .role-badge.role-admin { background-color: rgba(107, 92, 165, 0.1); color: #6B5CA5; border-color: rgba(107, 92, 165, 0.2); }
          .role-badge.role-faculty { background-color: rgba(59, 130, 246, 0.1); color: #3B82F6; border-color: rgba(59, 130, 246, 0.2); }
          .role-badge.role-student { background-color: rgba(32, 201, 151, 0.1); color: #17a57a; border-color: rgba(32, 201, 151, 0.2); }

          /* Preview Avatar */
          .preview-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 2rem;
            font-weight: bold;
          }
        `}
      </style>
    </>
  );
};

export default AssignRole;
