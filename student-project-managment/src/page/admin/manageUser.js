import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // State to hold fetched users from the API
  const [users, setUsers] = useState([]);

  // --- FIXED: State for Edit Modal now includes all required API fields ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({ 
    userID: '', 
    fullName: '', 
    userCode: '', 
    email: '', 
    password: '', 
    mobileNumber: '', 
    profilePicturePath: '', 
    isActive: true, 
    isDeleted: false, 
    userTypeId: '' 
  });

  // Fetch users from the API on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- GET API ---
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://student-project-managment.onrender.com/api/User', { headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`,  } });
      if (response.ok) {
        const jsonResponse = await response.json();
        setUsers(jsonResponse.data || jsonResponse.Data || (Array.isArray(jsonResponse) ? jsonResponse : []));
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // --- DELETE API ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this User?")) return;

    try {
      const response = await fetch(`https://student-project-managment.onrender.com/api/User/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }});

      if (response.ok) {
        // Instantly remove from UI
        setUsers(users.filter(user => user.userID !== id));
      } else {
        console.error('Failed to delete user');
        alert("Failed to delete the user. They might be linked to other records.");
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // --- PUT API (EDIT) - Opens Modal ---
  const handleEditClick = (user) => {
    // FIXED: Ensure all fields expected by the .NET API are populated to prevent errors
    setEditingUser({ 
      userID: user.userID,
      fullName: user.fullName || '',
      userCode: user.userCode || '',
      email: user.email || '',
      password: user.password || '', // Send back whatever was retrieved or an empty string
      mobileNumber: user.mobileNumber || '',
      profilePicturePath: user.profilePicturePath || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
      isDeleted: user.isDeleted !== undefined ? user.isDeleted : false,
      userTypeId: user.userTypeId || user.userTypeID || 1 // Fallback so it's not null
    });
    setIsEditModalOpen(true);
  };

  // --- PUT API (EDIT) - Submits Data ---
  const submitEdit = async () => {
    try {
      const response = await fetch(`https://student-project-managment.onrender.com/api/User/${editingUser.userID}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`,  'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingUser)
      });

      if (response.ok) {
        // Instantly update UI with new details
        setUsers(users.map(u => u.userID === editingUser.userID ? editingUser : u));
        setIsEditModalOpen(false); // Close Modal
      } else {
        console.error('Failed to update user');
        alert("Failed to update the user details.");
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Search filter logic
  const filteredUsers = users.filter(user => 
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.userTypeName && user.userTypeName.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Manage Users</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Admin Modules</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Users</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Top Action Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <div className="search-box position-relative" style={{ width: '100%', maxWidth: '350px' }}>
            {/* Search Icon SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              fill="currentColor" 
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
              viewBox="0 0 16 16"
              style={{ zIndex: 10 }}
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>

            <input 
              type="text" 
              className="form-control ps-5 shadow-none border-0 shadow-sm" 
              placeholder="Search by name, email, or role..." 
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
          <button className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={()=>navigate('/add-user')}>
            {/* Plus Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </svg>
            Add New User
          </button>
        </div>

        {/* User Cards Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div className="col" key={user.userID}>
                <div className="card spms-user-card h-100 border-0 position-relative">
                  
                  {/* Beautiful Card Background Banner */}
                  <div className="card-banner"></div>

                  {/* Status Badge overlay on banner */}
                  <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 2 }}>
                    <span className={`spms-status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="card-body p-4 text-center d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
                    
                    {/* Profile Picture overlapping the banner */}
                    <div className="mb-3 position-relative d-inline-block mx-auto" style={{ marginTop: '10px' }}>
                      <img 
                        src={user.profilePicturePath || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=6B5CA5&color=fff`} 
                        alt={user.fullName} 
                        className="rounded-circle shadow-sm profile-img"
                      />
                      <span className={`position-absolute bottom-0 end-0 p-1 border border-2 border-white rounded-circle ${user.isActive ? 'bg-success' : 'bg-secondary'}`} style={{ width: '16px', height: '16px', right: '4px', bottom: '4px' }}></span>
                    </div>

                    {/* User Info */}
                    <h5 className="fw-bold text-dark mb-1">{user.fullName}</h5>
                    <p className="text-muted small mb-4 text-uppercase fw-bold tracking-wider">{user.userTypeName || 'No Role'}</p>
                    
                    {/* Professional Contact List */}
                    <div className="contact-list text-start mb-4 mt-auto px-2">
                      <div className="d-flex align-items-center mb-3">
                        <div className="contact-icon-box shadow-sm me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                          </svg>
                        </div>
                        <span className="text-secondary small fw-medium text-truncate">{user.email}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="contact-icon-box shadow-sm me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                          </svg>
                        </div>
                        <span className="text-secondary small fw-medium">{user.mobileNumber}</span>
                      </div>
                    </div>

                    {/* Modern Action Buttons */}
                    <div className="d-flex justify-content-center gap-2 mt-auto border-top pt-4">
                      
                      {/* --- Edit Button --- */}
                      <button 
                        className="btn flex-fill spms-btn-soft-primary py-2 rounded-3 d-flex justify-content-center align-items-center gap-2"
                        onClick={() => handleEditClick(user)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                        Edit
                      </button>
                      
                      {/* --- Delete Button --- */}
                      <button 
                        className="btn flex-fill spms-btn-soft-danger py-2 rounded-3 d-flex justify-content-center align-items-center gap-2"
                        onClick={() => handleDelete(user.userID)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                        </svg>
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-12 text-center py-5">
              <div className="card border-0 shadow-sm rounded-4 w-100 py-5 bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#CBD5E1" className="mb-3 mx-auto" viewBox="0 0 16 16">
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                </svg>
                <h6 className="mt-2 fw-bold text-dark">No Users Found</h6>
                <p className="text-muted fs-7 mb-0">Try adjusting your search criteria.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          2. EDIT MODAL OVERLAY
          ========================================= */}
      {isEditModalOpen && (
        <div className="spms-modal-overlay">
          <div className="card spms-premium-card border-0 p-4 spms-modal-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-dark mb-0">Edit User Details</h5>
              <button 
                type="button" 
                className="btn-close shadow-none" 
                onClick={() => setIsEditModalOpen(false)}
              ></button>
            </div>
            
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold small mb-1">Full Name</label>
              <input 
                type="text" 
                className="form-control spms-input shadow-none" 
                value={editingUser.fullName} 
                onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold small mb-1">Email Address</label>
              <input 
                type="email" 
                className="form-control spms-input shadow-none" 
                value={editingUser.email} 
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold small mb-1">Mobile Number</label>
              <input 
                type="text" 
                className="form-control spms-input shadow-none" 
                value={editingUser.mobileNumber} 
                onChange={(e) => setEditingUser({...editingUser, mobileNumber: e.target.value})}
              />
            </div>

            <div className="mb-4 form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="activeStatusSwitch"
                checked={editingUser.isActive}
                onChange={(e) => setEditingUser({...editingUser, isActive: e.target.checked})}
              />
              <label className="form-check-label text-secondary fw-semibold small" htmlFor="activeStatusSwitch">
                Active Account Status
              </label>
            </div>
            
            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-light text-secondary fw-semibold px-4 border" 
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn spms-btn-primary px-4" 
                onClick={submitEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          3. STYLE TAG (Placed after UI code)
          ========================================= */}
      <style>
        {`
          /* FIX: Ensure Header does not shrink globally when this page loads */
          .spms-header {
            flex-shrink: 0 !important;
          }

          /* Beautiful Card Styling */
          .spms-user-card {
            border-radius: 16px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
            transition: all 0.3s ease;
          }

          .spms-user-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          }

          /* Modern Top Banner */
          .card-banner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 90px;
            background: linear-gradient(135deg, rgba(107, 92, 165, 0.1) 0%, rgba(107, 92, 165, 0.02) 100%);
            border-radius: 16px 16px 0 0;
            border-bottom: 1px solid rgba(107, 92, 165, 0.05);
          }

          .profile-img {
            width: 86px;
            height: 86px;
            object-fit: cover;
            border: 4px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          }

          .tracking-wider {
            letter-spacing: 1.2px;
          }

          /* Status Badges */
          .spms-status-badge {
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 0.70rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }

          .spms-status-badge.active {
            background-color: #FFFFFF;
            color: #17a57a;
            border: 1px solid rgba(32, 201, 151, 0.2);
          }

          .spms-status-badge.inactive {
            background-color: #FFFFFF;
            color: #64748B;
            border: 1px solid rgba(138, 146, 166, 0.2);
          }

          /* Clean Contact List */
          .contact-list {
            background: transparent;
          }

          .contact-icon-box {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background-color: #F8FAFC;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6B5CA5;
            border: 1px solid #F1F5F9;
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

          /* Modern Soft Buttons */
          .spms-btn-soft-primary {
            background-color: rgba(107, 92, 165, 0.08);
            color: #6B5CA5;
            font-weight: 600;
            font-size: 0.85rem;
            border: 1px solid transparent;
            transition: all 0.2s ease;
          }

          .spms-btn-soft-primary:hover {
            background-color: #6B5CA5;
            color: #FFFFFF;
            box-shadow: 0 4px 10px rgba(107, 92, 165, 0.2) !important;
          }

          .spms-btn-soft-danger {
            background-color: rgba(220, 53, 69, 0.08);
            color: #dc3545;
            font-weight: 600;
            font-size: 0.85rem;
            border: 1px solid transparent;
            transition: all 0.2s ease;
          }

          .spms-btn-soft-danger:hover {
            background-color: #dc3545;
            color: #FFFFFF;
            box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2) !important;
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

          /* --- Modal Styles --- */
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

export default ManageUsers;
