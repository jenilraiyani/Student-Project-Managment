import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddUserType = () => {
  const navigate = useNavigate();
  const [userTypeName, setUserTypeName] = useState('');
  const [description, setDescription] = useState('');

  // Async function to handle the API call
  const handleSave = async (e) => {
    e.preventDefault();
    
    const newUserType = {
      userTypeName: userTypeName,
      description: description
    };

    try {
      const response = await fetch('https://student-project-managment.onrender.com/api/UserType', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`,  'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserType)
      });

      if (response.ok) {
        // If successfully saved to the database, go back to the previous page
        navigate(-1); 
      } else {
        console.error("Failed to save the user type");
        alert("Failed to save the user type. Please try again.");
      }
    } catch (error) {
      console.error("Error Saving User Type:", error);
      alert("An error occurred while communicating with the server.");
    }
  };

  return (
    <>
      <div className="container-fluid p-0">
        
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Add User Type</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">User Types</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Add</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Form Card */}
        <div className="card spms-premium-card border-0">
          <div className="card-body p-4 p-md-5">
            
            <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">User Type Details</h6>

            <form onSubmit={handleSave}>
              
              {/* Name Input */}
              <div className="row mb-4 align-items-center">
                <label htmlFor="userTypeName" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  User Type Name
                </label>
                <div className="col-sm-9">
                  <input 
                    type="text" 
                    className="form-control spms-input shadow-none" 
                    id="userTypeName" 
                    placeholder="Enter user type name (e.g., Admin, Student)" 
                    value={userTypeName}
                    onChange={(e) => setUserTypeName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="row mb-5">
                <label htmlFor="description" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Description
                </label>
                <div className="col-sm-9">
                  <textarea 
                    className="form-control spms-input shadow-none" 
                    id="description" 
                    rows="4" 
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 d-flex gap-2">
                  <button type="submit" className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                    Save
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

      {/* =========================================
          STYLE TAG
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

          .spms-input::placeholder {
            color: #94A3B8;
            font-size: 0.9rem;
          }

          .spms-input:focus {
            background-color: #FFFFFF;
            border-color: #6B5CA5;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }

          /* Primary Save Button */
          .spms-btn-primary {
            background-color: #6B5CA5; /* Purple Accent */
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

          /* Secondary Back Button */
          .spms-btn-secondary {
            background-color: #64748B; /* Slate Gray */
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

          /* Label Styling */
          .col-form-label {
            font-size: 0.95rem;
          }
        `}
      </style>
    </>
  );
};

export default AddUserType;
