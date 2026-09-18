import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const navigate = useNavigate();


  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Active');

  const [roles, setRoles] = useState([]);

  React.useEffect(() => {
    fetch('https://student-project-managment.onrender.com/api/UserType', { headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`,  } })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setRoles(data.data || data.Data || []);
        } else if (Array.isArray(data)) {
          setRoles(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const newUser = {
      fullName,
      email,
      password,
      mobileNumber: mobile,
      userTypeId: parseInt(role, 10),
      isActive: status === 'Active',
      isDeleted: false
    };

    try {
      const response = await fetch('https://student-project-managment.onrender.com/api/User', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}`,  'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        navigate(-1);
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      console.error("Error saving user", error);
      alert("Error saving user");
    }
  };

  return (
    <>

      <div className="container-fluid p-0">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Add User</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Users</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Add</li>
              </ol>
            </nav>
          </div>
        </div>


        <div className="card spms-premium-card border-0">
          <div className="card-body p-4 p-md-5">

            <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">User Details</h6>

            <form onSubmit={handleSave}>


              <div className="row mb-4 align-items-center">
                <label htmlFor="fullName" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Full Name
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control spms-input shadow-none"
                    id="fullName"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label htmlFor="email" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Email
                </label>
                <div className="col-sm-9">
                  <input
                    type="email"
                    className="form-control spms-input shadow-none"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label htmlFor="password" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Password
                </label>
                <div className="col-sm-4 mb-3 mb-sm-0">
                  <input
                    type="password"
                    className="form-control spms-input shadow-none"
                    id="password"
                    placeholder="Enter login password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <label htmlFor="mobile" className="col-sm-1 col-form-label fw-semibold text-secondary text-sm-end px-0">
                  Mobile
                </label>
                <div className="col-sm-4">
                  <input
                    type="tel"
                    className="form-control spms-input shadow-none"
                    id="mobile"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label htmlFor="role" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Role
                </label>
                <div className="col-sm-9">
                  <select
                    className="form-select spms-input shadow-none"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Role --</option>
                    {roles.map((r) => (
                      <option key={r.userTypeID || r.userTypeId} value={r.userTypeID || r.userTypeId}>
                        {r.userTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>


              <div className="row mb-5 align-items-center">
                <label htmlFor="status" className="col-sm-3 col-form-label fw-semibold text-secondary">
                  Status
                </label>
                <div className="col-sm-9">
                  <div className="form-check form-switch d-flex align-items-center spms-switch p-0 m-0">
                    <input
                      className="form-check-input m-0 shadow-none"
                      type="checkbox"
                      role="switch"
                      id="status"
                      checked={status === 'Active'}
                      onChange={(e) => setStatus(e.target.checked ? 'Active' : 'Inactive')}
                      style={{ cursor: 'pointer' }}
                    />
                    <label className="form-check-label ms-3 text-dark fw-medium" htmlFor="status" style={{ cursor: 'pointer', paddingTop: '1px' }}>
                      {status}
                    </label>
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 d-flex gap-2">
                  <button type="submit" className="btn spms-btn-primary d-flex align-items-center gap-2 shadow-sm">

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                    </svg>
                    Save
                  </button>

                  <button
                    type="button"
                    className="btn spms-btn-secondary d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => navigate(-1)}
                  >

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
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

          /* Custom Switch Styling */
          .spms-switch .form-check-input {
            width: 2.8em;
            height: 1.4em;
            border: 1px solid #E2E8F0;
            background-color: #CBD5E1;
            transition: all 0.2s ease-in-out;
          }
          
          .spms-switch .form-check-input:checked {
            background-color: #6B5CA5;
            border-color: #6B5CA5;
          }

          .spms-switch .form-check-input:focus {
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

export default AddUser;
