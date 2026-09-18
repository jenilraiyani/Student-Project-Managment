import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const readRoleFromStorage = () => {
  const stored = localStorage.getItem('spms_userType');
  if (stored) return stored;

  const token = localStorage.getItem('spms_token');
  if (!token) return '';

  const decoded = parseJwt(token);
  if (!decoded) return '';

  return (
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    decoded.role ||
    decoded.roleName ||
    ''
  );
};

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => readRoleFromStorage());
  const [availableRoles, setAvailableRoles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('spms_available_roles') || '[]');
    } catch {
      return [];
    }
  });
  const [currentUser, setCurrentUser] = useState({
    userId: '',
    name: 'Loading...',
    email: '',
    avatar: '?'
  });

  useEffect(() => {
    const token = localStorage.getItem('spms_token');
    if (!token) return;

    const decoded = parseJwt(token);
    if (!decoded) return;

    const role =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded.role ||
      decoded.roleName ||
      localStorage.getItem('spms_userType') ||
      '';
    const userId = decoded.userId || '';

    if (role) {
      setUserType(role);
      localStorage.setItem('spms_userType', role);
    }

    if (userId) {
      setCurrentUser(prev => ({ ...prev, userId }));
      fetch(`https://localhost:7089/api/User/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => (res.ok ? res.json() : null))
        .then(result => {
          if (result) {
            const udata = result.data || result.Data || {};
            setCurrentUser({
              userId,
              name: udata.fullName || udata.FullName || 'User',
              email: udata.email || udata.Email || '',
              avatar: (udata.fullName || udata.FullName || 'U').charAt(0).toUpperCase()
            });
          }
        })
        .catch(err => console.error('Error loading user profile', err));
    }
  }, []);

  const contextValue = {
    userType,
    setUserType,
    currentUser,
    setCurrentUser,
    availableRoles,
    setAvailableRoles
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
