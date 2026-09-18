import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageUserRole = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserRole, setEditingUserRole] = useState({ id: 0, userID: 0, roleID: '', user: '' });

  useEffect(() => {
    fetchUserRoles();
    fetchRolesDropdown();
  }, []);

  const fetchRolesDropdown = async () => {
    try {
      const res = await fetch('https://student-project-managment.onrender.com/api/Role/dropdown', { headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` } });
      if (res.ok) {
        const json = await res.json();
        setAvailableRoles(json.data || json.Data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const response = await fetch('https://student-project-managment.onrender.com/api/UserRole', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }
      });
      if (response.ok) {
        const json = await response.json();
        const items = json.data || json.Data || [];
        const formatted = items.map(item => {
          const roleNormalized = (item.roleName || '').toLowerCase();
          let rClass = 'role-student';
          let avatarColor = '#20C997'; // default green

          if (roleNormalized.includes('admin') || roleNormalized.includes('hod')) {
            rClass = 'role-admin';
            avatarColor = '#6B5CA5';
          } else if (roleNormalized.includes('faculty') || roleNormalized.includes('guide')) {
            rClass = 'role-faculty';
            avatarColor = '#3B82F6';
          }

          return {
            id: item.rolePermissionID,
            user: item.userName || 'Unknown User',
            email: '',
            role: item.roleName,
            roleClass: rClass,
            assignedDate: 'System Default',
            avatarColor: avatarColor,
            userID: item.userID,
            roleID: item.roleID
          };
        });
        setUserRoles(formatted);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this role assignment?")) return;

    try {
      const response = await fetch(`https://student-project-managment.onrender.com/api/UserRole/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }
      });

      if (response.ok) {
        setUserRoles(userRoles.filter(ur => ur.id !== id));
      } else {
        alert("Failed to delete user role. It might be in use.");
      }
    } catch (error) {
      console.error('Error deleting user role:', error);
    }
  };

  const handleEditClick = (ur) => {
    setEditingUserRole({ id: ur.id, userID: ur.userID, roleID: ur.roleID, user: ur.user });
    setIsEditModalOpen(true);
  };

  const submitEdit = async () => {
    try {
      const response = await fetch(`https://student-project-managment.onrender.com/api/UserRole/${editingUserRole.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rolePermissionID: editingUserRole.id,
          roleID: parseInt(editingUserRole.roleID),
          userID: editingUserRole.userID
        })
      });
      if (response.ok) {
        fetchUserRoles(); // Re-fetch to update the table instantly
        setIsEditModalOpen(false);
      } else {
        alert("Failed to update user role.");
      }
    } catch (e) { console.error(e); }
  };

  // Search filter logic
  const filteredUserRoles = userRoles.filter(item =>
    (item.user && item.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.role && item.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {/* =========================================
          1. UI CODE
          ========================================= */}
      <div className="container-fluid p-0">

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Role-User Management</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Master Configuration</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">User Roles</li>
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
              placeholder="Search by user, email, or role..."
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
          <button className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate('/assign_role')}>
            {/* Plus Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Assign Role
          </button>
        </div>

        {/* User-Role Table Card */}
        <div className="card spms-premium-card border-0">
          <div className="card-body p-4">

            <div className="table-responsive">
              <table className="table table-hover align-middle spms-table mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '10%' }}>S.N.</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '45%' }}>User Details</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '30%' }}>Assigned Role</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase text-center" style={{ width: '15%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserRoles.length > 0 ? (
                    filteredUserRoles.map((item, index) => (
                      <tr key={item.id} className="spms-table-row">
                        <td className="fw-semibold text-secondary">
                          {index + 1}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle me-3 text-white fw-bold shadow-sm" style={{ backgroundColor: item.avatarColor, width: '36px', height: '36px', fontSize: '0.9rem' }}>
                              {item.user.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>{item.user}</div>
                              <div className="text-secondary small fw-medium">{item.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge ${item.roleClass}`}>
                            {item.role}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-light text-primary me-2 action-btn"
                            title="Edit Assignment"
                            onClick={() => handleEditClick(item)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                            </svg>
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger action-btn"
                            title="Remove Role"
                            onClick={() => handleDelete(item.id)}
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
                      <td colSpan="4" className="text-center py-5">
                        <div className="text-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#CBD5E1" className="bi bi-search mb-3" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                          </svg>
                          <h6 className="mt-3 fw-semibold text-dark">No User-Role Assignments Found</h6>
                          <p className="mb-0 fs-7">We couldn't find any assignments matching "{searchTerm}".</p>
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
                <h5 className="fw-bold text-dark mb-0">Edit Role Assignment</h5>
                <span className="text-muted small">Update role for {editingUserRole.user}</span>
              </div>
              <button type="button" className="btn-close shadow-none" onClick={() => setIsEditModalOpen(false)}></button>
            </div>

            <div className="card-body px-4 pb-4">
              <div className="mb-4 mt-2">
                <label className="form-label fw-bold text-secondary small">
                  Re-assign Role <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select spms-input shadow-none"
                  value={editingUserRole.roleID}
                  onChange={(e) => setEditingUserRole({ ...editingUserRole, roleID: e.target.value })}
                  required
                >
                  <option value="" disabled>-- Select a Role --</option>
                  {availableRoles.map(role => (
                    <option key={role.roleID} value={role.roleID}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-light fw-semibold px-4" onClick={() => setIsEditModalOpen(false)} style={{ color: '#64748B' }}>
                  Cancel
                </button>
                <button type="button" className="btn spms-btn-primary px-4 shadow-sm" onClick={submitEdit}>
                  Update Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

          /* Role Badges */
          .role-badge {
            padding: 5px 14px;
            border-radius: 20px; /* Pill shape for roles */
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid transparent;
            display: inline-block;
          }

          .role-badge.role-admin { background-color: rgba(107, 92, 165, 0.1); color: #6B5CA5; border-color: rgba(107, 92, 165, 0.2); }
          .role-badge.role-faculty { background-color: rgba(59, 130, 246, 0.1); color: #3B82F6; border-color: rgba(59, 130, 246, 0.2); }
          .role-badge.role-student { background-color: rgba(32, 201, 151, 0.1); color: #17a57a; border-color: rgba(32, 201, 151, 0.2); }

          /* Avatar Circle */
          .avatar-circle {
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          /* Action Buttons */
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

          /* Primary Button */
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
            max-width: 450px;
            animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .spms-input {
            border-radius: 8px;
            border: 1px solid #E2E8F0;
            background-color: #F8FAFC;
            font-size: 0.95rem;
            color: #1E293B;
            transition: all 0.2s;
          }
          
          .spms-input:focus {
            background-color: #FFFFFF;
            border-color: #6B5CA5;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
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

export default ManageUserRole;
