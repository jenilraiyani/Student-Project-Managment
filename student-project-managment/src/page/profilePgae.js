import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './context/UserContext';

const Profile = () => {
  const { currentUser } = useContext(UserContext);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    mobile: '',
    role: ''
  });

  useEffect(() => {
    if (currentUser && currentUser.userId) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`https://localhost:7089/api/User/${currentUser.userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('spms_token')}` }
          });
          if (response.ok) {
            const result = await response.json();
            const udata = result.data || result.Data || {};
            setProfile({
              fullName: udata.fullName || udata.FullName || 'User',
              email: udata.email || udata.Email || '',
              mobile: udata.mobileNumber || udata.MobileNumber || 'Not Provided',
              role: udata.userTypeName || udata.UserTypeName || 'Unknown Role'
            });
          }
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      };
      fetchProfile();
    }
  }, [currentUser]);

  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  return (
    <>
      <div className="container-fluid p-0">

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>My Profile</h4>
          </div>
        </div>

        <div className="row g-4">

          {/* Left Column: Profile Card */}
          <div className="col-12 col-lg-4">
            <div className="card spms-premium-card border-0 overflow-hidden">
              <div className="profile-cover"></div>
              <div className="card-body text-center px-4 pb-4">
                <div className="profile-avatar-wrapper">
                  <div className="profile mx-auto mb-3">{(profile.fullName.charAt(0) || 'U').toUpperCase()}</div>
                </div>
                <h5 className="fw-bold text-dark mb-1">{profile.fullName}</h5>
                <span className="badge bg-light text-primary border border-primary px-3 py-2 mb-4" style={{ fontSize: '0.75rem' }}>
                  {profile.role}
                </span>

                <div className="text-start mt-3 border-top pt-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 text-primary"><i className="bi bi-envelope"></i></div>
                    <div>
                      <p className="text-muted small mb-0">Email</p>
                      <p className="fw-semibold text-dark mb-0">{profile.email}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary"><i className="bi bi-phone"></i></div>
                    <div>
                      <p className="text-muted small mb-0">Mobile</p>
                      <p className="fw-semibold text-dark mb-0">{profile.mobile}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="col-12 col-lg-8">

            {/* Edit Profile */}
            <div className="card spms-premium-card border-0 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Edit Personal Details</h6>
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label small fw-bold text-secondary">Full Name</label>
                      <input type="text" className="form-control spms-input shadow-none py-2" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label small fw-bold text-secondary">Email Address</label>
                      <input type="email" className="form-control spms-input shadow-none py-2" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label className="form-label small fw-bold text-secondary">Mobile Number</label>
                      <input type="text" className="form-control spms-input shadow-none py-2" value={profile.mobile} onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} />
                    </div>
                  </div>
                  <button type="button" className="btn spms-btn-primary mt-4 px-4">Save Changes</button>
                </form>
              </div>
            </div>

            {/* Change Password */}
            <div className="card spms-premium-card border-0">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Security Settings</h6>
                <form>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-bold text-secondary">Current Password</label>
                      <input type="password" className="form-control spms-input shadow-none py-2" placeholder="••••••••" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-bold text-secondary">New Password</label>
                      <input type="password" className="form-control spms-input shadow-none py-2" placeholder="••••••••" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-bold text-secondary">Confirm Password</label>
                      <input type="password" className="form-control spms-input shadow-none py-2" placeholder="••••••••" />
                    </div>
                  </div>
                  <button type="button" className="btn spms-btn-secondary mt-3 px-4">Update Password</button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>
        {`
          .spms-premium-card {
            border-radius: 16px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
            border-top: 4px solid #6B5CA5 !important;
          }

          .profile-cover {
            height: 100px;
            background: linear-gradient(135deg, #6B5CA5 0%, #8b7ad2 100%);
          }

          .profile-avatar-wrapper {
            margin-top: -50px;
          }

          .profile {
            width: 80px;
            height: 80px;
            background-color: #FFFFFF;
            color: #6B5CA5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            border: 4px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }

          .spms-input {
            border-radius: 10px;
            border: 1px solid #E2E8F0;
            background-color: #F8FAFC;
            transition: all 0.2s;
          }

          .spms-input:focus {
            background-color: #FFFFFF;
            border-color: #6B5CA5;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }

          .spms-btn-primary {
            background-color: #6B5CA5;
            color: #FFFFFF;
            border-radius: 8px;
            font-weight: 600;
          }

          .spms-btn-secondary {
            background-color: #64748B;
            color: #FFFFFF;
            border-radius: 8px;
            font-weight: 600;
          }
        `}
      </style>
    </>
  );
};

export default Profile;