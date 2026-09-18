import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';


const Login = () => {
  const navigate = useNavigate();

  // Consume context to set the user role globally
  const { setUserType, setCurrentUser } = useContext(UserContext);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Helper function to decode JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // Updated Form submission handler to extract role from JWT
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7089/api/User/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token || data.Token;
        localStorage.setItem('spms_token', token);

        // Extract role dynamically from JWT
        const decodedToken = parseJwt(token);
        const roleClaim = decodedToken ? (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role) : null;
        const assignedRole = roleClaim || 'Student'; // fallback
        const userId = decodedToken ? decodedToken.userId : null;

        if (userId) {
          try {
            const userRes = await fetch(`https://localhost:7089/api/User/${userId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (userRes.ok) {
              const result = await userRes.json();
              const udata = result.data || result.Data || {};
              setCurrentUser({
                userId,
                name: udata.fullName || udata.FullName || 'User',
                email: udata.email || udata.Email || '',
                avatar: (udata.fullName || udata.FullName || 'U').charAt(0).toUpperCase()
              });
            } else {
              setCurrentUser(prev => ({ ...prev, userId }));
            }
          } catch (err) {
            console.error("Error fetching user details", err);
            setCurrentUser(prev => ({ ...prev, userId }));
          }
        }

        setUserType(assignedRole);
        navigate('/');
      } else {
        alert("Invalid email or password!");
      }
    } catch (err) {
      console.error("Login failed", err);
      alert("An error occurred during login.");
    }
  };

  return (
    <>
      <div className="login-wrapper d-flex min-vh-100 overflow-hidden bg-white">

        {/* Left Side - Modern Branding Panel */}
        <div className="col-lg-5 col-xl-6 d-none d-lg-flex flex-column justify-content-between position-relative spms-branding-panel p-5">
          <div className="position-relative z-index-2">
            <h3 className="fw-bolder text-white d-flex align-items-center gap-2 mb-1" style={{ letterSpacing: '-0.5px' }}>
              <div className="rounded d-flex align-items-center justify-content-center shadow-sm bg-white" style={{ width: '40px', height: '40px' }}>
                <img src="/logo.png" alt="ProjectSphere Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
              </div>
              <span className="ms-1">ProjectSphere</span>
            </h3>
            <p className="text-white-50 fw-medium small mb-0 ms-1" style={{ letterSpacing: '1px' }}>STUDENT PROJECT MANAGEMENT</p>
          </div>

          <div className="position-relative z-index-2 mb-5 pb-5 spms-animate-slide-up">
            <h1 className="display-4 fw-bolder text-white mb-4" style={{ letterSpacing: '-1.5px', lineHeight: '1.1' }}>
              Streamline your <br /> academic workflow.
            </h1>
            <p className="text-white-50 fs-6 mb-0" style={{ maxWidth: '420px', lineHeight: '1.6' }}>
              A premium, intuitive platform designed to bring students, faculty, and administrators together in one highly secure ecosystem.
            </p>
          </div>

          <div className="position-relative z-index-2 d-flex gap-3 align-items-center">

          </div>

          {/* Abstract glowing shapes */}
          <div className="bg-glow glow-1"></div>
          <div className="bg-glow glow-2"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-12 col-lg-7 col-xl-6 d-flex flex-column justify-content-center position-relative">
          {/* Mobile simple header */}
          <div className="d-lg-none d-flex align-items-center p-4 border-bottom bg-light">
            <div className="bg-white rounded p-1 text-white me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <img src="/logo.png" alt="ProjectSphere Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
            </div>
            <h5 className="fw-bolder mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>ProjectSphere</h5>
          </div>

          <div className="w-100 mx-auto px-4 px-sm-5 py-5 spms-animate-fade-in" style={{ maxWidth: '520px' }}>
            <div className="mb-5 pb-2">
              <h2 className="fw-bolder text-dark mb-2" style={{ letterSpacing: '-1px', fontSize: '2.2rem' }}>Welcome Back</h2>
              <p className="text-secondary fw-medium fs-6">Please enter your credentials to sign in.</p>
            </div>

            <form>
              {/* Email Field */}
              <div className="mb-4">
                <label className="form-label text-muted fw-bold small mb-2 text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-muted ps-3 pe-2 spms-input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" /></svg>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0 ps-1 py-3 shadow-none spms-premium-input"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-end mb-2">
                  <label className="form-label text-muted fw-bold small mb-0 text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Password</label>
                  <a href="#" className="text-decoration-none small fw-bold spms-link">Forgot Password?</a>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-muted ps-3 pe-2 spms-input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /></svg>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-1 py-3 shadow-none spms-premium-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-5 pt-2">
                <button
                  type="submit"
                  onClick={handleLogin}
                  className="btn spms-btn-primary w-100 py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 fs-6 position-relative overflow-hidden"
                >
                  <span className="position-relative z-1">Sign In</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="btn-icon transition-transform position-relative z-1">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="text-center mt-5 pt-4">
              <p className="text-black-50 fw-medium small mb-0">© 2026 Student Project Management System</p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          /* Full Page Setup */
          .login-wrapper {
            font-family: 'Inter', 'Segoe UI', sans-serif;
          }
          
          .z-index-2 {
            z-index: 2;
          }

          /* Left Panel Branding */
          .spms-branding-panel {
            background-color: #121021;
            background-image: 
              radial-gradient(circle at 15% 50%, rgba(107, 92, 165, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 85% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
          }

          .bg-glow {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            z-index: 0;
            pointer-events: none;
          }

          .glow-1 {
            width: 400px;
            height: 400px;
            background-color: #6B5CA5;
            bottom: -150px;
            left: -150px;
          }

          .glow-2 {
            width: 300px;
            height: 300px;
            background-color: #3B82F6;
            top: -50px;
            right: -100px;
          }

          /* Animations */
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          .spms-animate-slide-up {
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }

          .spms-animate-fade-in {
            animation: fadeIn 0.8s ease forwards;
            animation-delay: 0.2s;
            opacity: 0;
          }

          /* Form Inputs */
          .input-group {
            border-radius: 12px;
            border: 1px solid #E2E8F0;
            background-color: #FFFFFF;
            transition: all 0.3s ease;
          }
          
          .input-group:focus-within {
            border-color: #6B5CA5;
            box-shadow: 0 0 0 4px rgba(107, 92, 165, 0.15);
            background-color: #F8FAFC;
          }

          .spms-premium-input {
            background-color: transparent !important;
            font-size: 1rem;
            color: #1E293B;
            font-weight: 500;
          }

          .spms-premium-input::placeholder {
            color: #CBD5E1;
            font-weight: 400;
          }

          .input-group:focus-within .spms-input-icon {
            color: #6B5CA5 !important;
          }

          /* General Link */
          .spms-link {
            color: #6B5CA5;
            transition: color 0.2s;
          }

          .spms-link:hover {
            color: #4c407c;
            text-decoration: underline !important;
          }

          /* Button Styles */
          .spms-btn-primary {
            background: linear-gradient(135deg, #6B5CA5 0%, #4c407c 100%);
            border: none;
            color: #FFFFFF;
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .spms-btn-primary::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s;
          }

          .spms-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(107, 92, 165, 0.3) !important;
            color: #FFF;
          }

          .spms-btn-primary:hover::before {
            opacity: 1;
          }

          .spms-btn-primary:hover .btn-icon {
            transform: translateX(4px);
          }
        `}
      </style>
    </>
  );
};

export default Login;