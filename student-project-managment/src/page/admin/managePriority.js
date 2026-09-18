import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagePriority = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState({
    taskPriorityID: '',
    taskPriorityName: '',
    taskPriortyCssClass: 'primary'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPriorities();
  }, []);

  // --- GET API ---
  const fetchPriorities = async () => {
    try {
      const response = await fetch('https://localhost:7089/api/TaskPriority', { headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`, } });
      if (response.ok) {
        const jsonResponse = await response.json();
        const dataArray = jsonResponse.data || jsonResponse.Data || (Array.isArray(jsonResponse) ? jsonResponse : []);
        setPriorities(dataArray);
      } else {
        console.error('Failed to fetch priorities');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // --- DELETE API ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this priority?')) return;

    try {
      const response = await fetch(`https://localhost:7089/api/TaskPriority/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }
      });

      if (response.ok) {
        setPriorities(priorities.filter(p => p.taskPriorityID !== id));
      } else {
        console.error('Failed to delete priority');
        alert('Failed to delete the priority. It might be in use.');
      }
    } catch (error) {
      console.error('Error deleting priority:', error);
    }
  };

  const handleEditClick = (priority) => {
    setEditingPriority({ ...priority });
    setIsEditModalOpen(true);
  };

  // --- PUT API ---
  const submitEdit = async () => {
    try {
      const response = await fetch(`https://localhost:7089/api/TaskPriority/${editingPriority.taskPriorityID}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('spms_token')}`, 'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingPriority)
      });

      if (response.ok) {
        setPriorities(
          priorities.map(p =>
            p.taskPriorityID === editingPriority.taskPriorityID ? editingPriority : p
          )
        );
        setIsEditModalOpen(false);
      } else {
        console.error('Failed to update priority');
        alert('Failed to update the priority.');
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const getColorForClass = (cssClass) => {
    const colorMap = {
      'primary': { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.2)' },
      'success': { bg: 'rgba(32, 201, 151, 0.1)', text: '#20C997', border: 'rgba(32, 201, 151, 0.2)' },
      'warning': { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.2)' },
      'danger': { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.2)' },
      'info': { bg: 'rgba(6, 182, 212, 0.1)', text: '#06B6D4', border: 'rgba(6, 182, 212, 0.2)' },
      'dark': { bg: 'rgba(30, 41, 59, 0.1)', text: '#1E293B', border: 'rgba(30, 41, 59, 0.2)' },
      'purple': { bg: 'rgba(107, 92, 165, 0.1)', text: '#6B5CA5', border: 'rgba(107, 92, 165, 0.2)' }
    };
    return colorMap[cssClass] || colorMap['primary'];
  };

  const filteredPriorities = priorities.filter(item =>
    (item.taskPriorityName && item.taskPriorityName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.taskPriortyCssClass && item.taskPriortyCssClass.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="container-fluid p-0">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Manage Priorities</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Admin Modules</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Priorities</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <div className="search-box position-relative" style={{ width: '100%', maxWidth: '350px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" viewBox="0 0 16 16" style={{ zIndex: 10 }}>
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            <input
              type="text"
              className="form-control ps-5 shadow-none border-0 shadow-sm bg-white"
              placeholder="Search priorities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate('/add-priority')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Add Priority
          </button>
        </div>

        <div className="card spms-premium-card border-0">
          <div className="card-body p-4">

            <div className="table-responsive">
              <table className="table table-hover align-middle spms-table mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '15%' }}>S.N.</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '35%' }}>Priority Name</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '30%' }}>CSS Class / Preview</th>
                    <th scope="col" className="text-muted fw-bold text-uppercase text-center" style={{ width: '20%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPriorities.length > 0 ? (
                    filteredPriorities.map((item, index) => {
                      const colors = getColorForClass(item.taskPriortyCssClass);
                      return (
                        <tr key={item.taskPriorityID} className="spms-table-row">
                          <td className="fw-semibold text-secondary">{index + 1}</td>
                          <td>
                            <span className="fw-bold text-dark">{item.taskPriorityName}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <span className="text-secondary small fw-medium font-monospace">{item.taskPriortyCssClass}</span>
                              <span
                                className="priority-badge-preview"
                                style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
                              >
                                {item.taskPriorityName}
                              </span>
                            </div>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-light text-primary me-2 action-btn" title="Edit" onClick={() => handleEditClick(item)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                              </svg>
                            </button>
                            <button className="btn btn-sm btn-light text-danger action-btn" title="Delete" onClick={() => handleDelete(item.taskPriorityID)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="text-muted">
                          <h6 className="mt-3 fw-semibold text-dark">No Priorities Found</h6>
                          <p className="mb-0 fs-7">Try adjusting your search query.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {isEditModalOpen && (
          <div className="spms-modal-overlay">
            <div className="spms-modal-content card spms-premium-card border-0">

              <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0">Edit Priority</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setIsEditModalOpen(false)}></button>
              </div>

              <div className="card-body px-4 pb-4">
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary small">
                    Priority Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control spms-input shadow-none"
                    placeholder="e.g., High, Medium, Urgent"
                    value={editingPriority.taskPriorityName}
                    onChange={(e) => setEditingPriority({ ...editingPriority, taskPriorityName: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary small">
                    Priority CSS Class <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select spms-input shadow-none"
                    value={editingPriority.taskPriortyCssClass}
                    onChange={(e) => setEditingPriority({ ...editingPriority, taskPriortyCssClass: e.target.value })}
                    required
                  >
                    <option value="danger">Danger (Red - High/Urgent)</option>
                    <option value="warning">Warning (Orange - Medium)</option>
                    <option value="primary">Primary (Blue - Normal)</option>
                    <option value="success">Success (Green - Low)</option>
                    <option value="info">Info (Cyan - Optional)</option>
                    <option value="dark">Dark (Black - Critical)</option>
                    <option value="purple">Purple (Brand Color)</option>
                  </select>
                </div>

                <div className="p-3 bg-light rounded-3 mb-4 border d-flex align-items-center justify-content-between" style={{ borderColor: '#F1F5F9' }}>
                  <span className="text-secondary small fw-medium">Live Badge Preview:</span>
                  <span
                    className="priority-badge-preview"
                    style={{
                      backgroundColor: getColorForClass(editingPriority.taskPriortyCssClass).bg,
                      color: getColorForClass(editingPriority.taskPriortyCssClass).text,
                      borderColor: getColorForClass(editingPriority.taskPriortyCssClass).border
                    }}
                  >
                    {editingPriority.taskPriorityName || 'Preview'}
                  </span>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button type="button" className="btn btn-light fw-semibold px-4" onClick={() => setIsEditModalOpen(false)} style={{ color: '#64748B' }}>
                    Cancel
                  </button>
                  <button type="button" className="btn spms-btn-primary px-4 shadow-sm" onClick={submitEdit}>
                    Update Priority
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>
        {`
          .spms-premium-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important;
          }

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

          .search-box .form-control {
            border-radius: 8px;
            padding-top: 10px;
            padding-bottom: 10px;
            font-size: 0.9rem;
            transition: all 0.2s;
          }
          .search-box .form-control:focus {
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }

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
            font-size: 0.95rem;
          }
          .spms-table-row { transition: background-color 0.2s; }
          .spms-table-row:hover { background-color: #F8FAFC !important; }
          .spms-table tbody tr:last-child td { border-bottom: none; }

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

          .priority-badge-preview {
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 0.70rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid transparent;
            display: inline-block;
          }

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

          .spms-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            z-index: 1050;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .spms-modal-content {
            width: 100%;
            max-width: 450px;
            animation: modalFadeIn 0.3s ease;
          }
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default ManagePriority;
