import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPriority = () => {
  const navigate = useNavigate();
  
  const [taskPriorityName, setTaskPriorityName] = useState('');
  const [taskPriortyCssClass, setTaskPriortyCssClass] = useState('primary');

  const handleSave = async (e) => {
    e.preventDefault();

    const newPriority = {
      taskPriorityName: taskPriorityName,
      taskPriortyCssClass: taskPriortyCssClass
    };

    try {
      const response = await fetch('https://localhost:7089/api/TaskPriority', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`,  'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPriority)
      });

      if (response.ok) {
        navigate(-1);
      } else {
        console.error('Failed to save the priority');
        alert('Failed to save the priority. Please try again.');
      }
    } catch (error) {
      console.error('Error Saving Priority:', error);
      alert('An error occurred while communicating with the server.');
    }
  };

  const getColorForClass = (selectedClass) => {
    const colorMap = {
      'primary': { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.2)' },
      'success': { bg: 'rgba(32, 201, 151, 0.1)', text: '#20C997', border: 'rgba(32, 201, 151, 0.2)' },
      'warning': { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.2)' },
      'danger':  { bg: 'rgba(239, 68, 68, 0.1)',  text: '#EF4444', border: 'rgba(239, 68, 68, 0.2)' },
      'info':    { bg: 'rgba(6, 182, 212, 0.1)',  text: '#06B6D4', border: 'rgba(6, 182, 212, 0.2)' },
      'dark':    { bg: 'rgba(30, 41, 59, 0.1)',   text: '#1E293B', border: 'rgba(30, 41, 59, 0.2)' },
      'purple':  { bg: 'rgba(107, 92, 165, 0.1)', text: '#6B5CA5', border: 'rgba(107, 92, 165, 0.2)' }
    };
    return colorMap[selectedClass] || colorMap['primary'];
  };

  const currentColors = getColorForClass(taskPriortyCssClass);

  return (
    <>
      <div className="container-fluid p-0">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Add Priority</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Master Configuration</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Priorities</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Add</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card spms-premium-card border-0">
          <div className="card-body p-4 p-md-5">
            
            <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Priority Details</h6>

            <form onSubmit={handleSave}>
              
              <div className="row mb-4 align-items-center">
                <label htmlFor="priorityName" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Priority Name <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9 col-lg-6">
                  <input 
                    type="text" 
                    className="form-control spms-input shadow-none" 
                    id="priorityName" 
                    placeholder="e.g., High, Medium, Urgent" 
                    value={taskPriorityName}
                    onChange={(e) => setTaskPriorityName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <label htmlFor="cssClass" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Visual Theme (CSS Class) <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9 col-lg-6">
                  <select 
                    className="form-select spms-input shadow-none" 
                    id="cssClass"
                    value={taskPriortyCssClass}
                    onChange={(e) => setTaskPriortyCssClass(e.target.value)}
                    required
                  >
                    <option value="danger">Danger (Red - Ideal for High/Urgent)</option>
                    <option value="warning">Warning (Orange - Ideal for Medium)</option>
                    <option value="primary">Primary (Blue - Ideal for Normal/Low)</option>
                    <option value="success">Success (Green - Ideal for Lowest)</option>
                    <option value="info">Info (Cyan - Optional)</option>
                    <option value="dark">Dark (Black - Critical)</option>
                    <option value="purple">Purple (Brand Theme Color)</option>
                  </select>
                </div>
              </div>

              <div className="row mb-5 align-items-center">
                <label className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Live Preview
                </label>
                <div className="col-sm-9 col-lg-6">
                  <div className="p-3 bg-light rounded-3 border d-flex align-items-center" style={{ borderColor: '#F1F5F9' }}>
                    <span className="text-secondary small fw-medium me-4">How it will look in tables:</span>
                    <span 
                      className="priority-badge-preview"
                      style={{ 
                        backgroundColor: currentColors.bg, 
                        color: currentColors.text, 
                        borderColor: currentColors.border 
                      }}
                    >
                      {taskPriorityName || 'Priority Name'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 d-flex gap-2">
                  <button type="submit" className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                    Save Priority
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn spms-btn-secondary d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => navigate(-1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                    Back
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      </div>

      <style>
        {`
          .spms-premium-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important;
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

          .spms-input::placeholder {
            color: #94A3B8;
            font-size: 0.9rem;
          }

          .spms-input:focus {
            background-color: #FFFFFF;
            border-color: #6B5CA5;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }

          .priority-badge-preview {
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid transparent;
            display: inline-block;
          }

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

          .spms-btn-primary:hover {
            background-color: #55488c;
            color: #FFFFFF;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(107, 92, 165, 0.2);
          }

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

          .col-form-label {
            font-size: 0.95rem;
          }
        `}
      </style>
    </>
  );
};

export default AddPriority;
