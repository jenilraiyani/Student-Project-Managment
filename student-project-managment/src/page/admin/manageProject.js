import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageProject = () => {
    // State for search functionality
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState({ id: 0, title: '', description: '' });

    React.useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('https://student-project-managment.onrender.com/api/ProjectMaster', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }
            });
            if (response.ok) {
                const json = await response.json();
                const items = json.data || json.Data || [];
                const formatted = items.map(item => {
                    return {
                        id: item.projectID,
                        title: item.projectTitle,
                        description: item.description,
                        status: 'Not Assigned', // Fallback
                        startDate: '-',
                        endDate: '-',
                        assignedTo: '-',
                        faculty: '-',
                        badgeClass: 'badge-pending',
                        projectID: item.projectID
                    };
                });
                setProjects(formatted);
            }
        } catch (e) {
            console.error('Error fetching projects:', e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const response = await fetch(`https://student-project-managment.onrender.com/api/ProjectMaster/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }
            });
            if (response.ok) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert("Failed to delete project.");
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleEditClick = (project) => {
        setEditingProject({ id: project.id, title: project.title, description: project.description });
        setIsEditModalOpen(true);
    };

    const submitEdit = async () => {
        try {
            const response = await fetch(`https://student-project-managment.onrender.com/api/ProjectMaster/${editingProject.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectID: editingProject.id,
                    projectTitle: editingProject.title,
                    description: editingProject.description
                })
            });
            if (response.ok) {
                fetchProjects();
                setIsEditModalOpen(false);
            } else {
                alert("Failed to update project.");
            }
        } catch (e) { console.error('Error updating project:', e); }
    };

    // Filter logic for the search bar
    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Manage Projects</h4>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Project Management</a></li>
                                <li className="breadcrumb-item active fw-semibold" aria-current="page">Projects</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Top Action Bar (Outside the Card) */}
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
                            placeholder="Search projects..."
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
                    <button className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate('/add-project')}>
                        {/* Plus Icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                        </svg>
                        Add New Project
                    </button>
                </div>

                {/* Main Premium Card for Table */}
                <div className="card spms-premium-card border-0">
                    <div className="card-body p-4">

                        {/* Projects Data Table */}
                        <div className="table-responsive">
                            <table className="table table-hover align-middle spms-table mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '10%' }}>S.N.</th>
                                        <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '30%' }}>Project Title</th>
                                        <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '45%' }}>Description</th>
                                        <th scope="col" className="text-muted fw-bold text-uppercase text-center" style={{ width: '15%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProjects.length > 0 ? (
                                        filteredProjects.map((project, index) => (
                                            <tr key={project.id} className="spms-table-row" onClick={() => navigate(`/project-detail?id=${project.id}`)} style={{ cursor: 'pointer' }}>
                                                <td className="fw-semibold text-secondary">
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    <span className="fw-semibold text-dark" style={{ color: '#6B5CA5' }}>{project.title}</span>
                                                </td>
                                                <td>
                                                    <span className="text-secondary small fw-medium">{project.description || 'No description provided.'}</span>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-sm btn-light text-primary me-2 action-btn"
                                                        title="Edit Project"
                                                        onClick={(e) => { e.stopPropagation(); handleEditClick(project); }}
                                                    >
                                                        {/* Edit/Pencil Icon SVG */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-light text-danger action-btn"
                                                        title="Delete Project"
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                                                    >
                                                        {/* Trash Icon SVG */}
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
                                                    <h6 className="mt-3 fw-semibold text-dark">No Projects Found</h6>
                                                    <p className="mb-0 fs-7">We couldn't find any projects matching "{searchTerm}".</p>
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
                                <h5 className="fw-bold text-dark mb-0">Edit Project Details</h5>
                                <span className="text-muted small">Update title and description</span>
                            </div>
                            <button type="button" className="btn-close shadow-none" onClick={() => setIsEditModalOpen(false)}></button>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <div className="mb-3 mt-2">
                                <label className="form-label fw-bold text-secondary small">Project Title <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control spms-input shadow-none"
                                    value={editingProject.title}
                                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small">Description <span className="text-danger">*</span></label>
                                <textarea
                                    className="form-control spms-input shadow-none"
                                    rows="4"
                                    value={editingProject.description}
                                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-2">
                                <button type="button" className="btn btn-light fw-semibold px-4" onClick={() => setIsEditModalOpen(false)} style={{ color: '#64748B' }}>Cancel</button>
                                <button type="button" className="btn spms-btn-primary px-4 shadow-sm" onClick={submitEdit}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================
          2. STYLE TAG (Placed after UI code)
          ========================================= */}
            <style>
                {`
          /* Premium Card Styling */
          .spms-premium-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important; /* Purple Accent from theme */
          }

          /* Primary Button */
          .spms-btn-primary {
            background-color: #6B5CA5; /* Purple Accent */
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
            position: relative;
          }

          .search-box .form-control:focus {
            background-color: #FFFFFF;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
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
            font-size: 0.9rem;
            padding: 18px 10px;
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

          /* Professional Status Badges */
          .spms-badge {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-block;
            letter-spacing: 0.3px;
          }

          .badge-completed {
            background-color: rgba(32, 201, 151, 0.1);
            color: #17a57a;
            border: 1px solid rgba(32, 201, 151, 0.2);
          }

          .badge-inprogress {
            background-color: rgba(107, 92, 165, 0.1);
            color: #6B5CA5;
            border: 1px solid rgba(107, 92, 165, 0.2);
          }

          .badge-pending {
            background-color: rgba(245, 158, 11, 0.1);
            color: #D97706;
            border: 1px solid rgba(245, 158, 11, 0.2);
          }

          /* Avatar Circle for Assigned Users */
          .avatar-circle {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            border: 1px solid rgba(107, 92, 165, 0.2);
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

export default ManageProject;
