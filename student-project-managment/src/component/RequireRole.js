import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../page/context/UserContext';

const getHomePathForRole = (roleName) => {
  const role = (roleName || '').toLowerCase();
  if (role === 'student') return '/my-projects';
  if (role === 'faculty') return '/faculty-projects';
  return '/';
};

/**
 * Protects a page by allowed userType values from UserContext.
 * If current role is not allowed → go to previous page (or role home).
 */
const RequireRole = ({ roles = [], children }) => {
  const { userType } = useContext(UserContext);
  const navigate = useNavigate();

  const role = (userType || '').toLowerCase().trim();
  const allowed = (roles || []).map(r => String(r).toLowerCase().trim());
  const isReady = role.length > 0;
  const isAllowed = isReady && allowed.includes(role);

  useEffect(() => {
    if (!isReady) return;
    if (isAllowed) return;

    const sameOriginRef =
      document.referrer &&
      document.referrer.startsWith(window.location.origin);

    if (sameOriginRef && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(getHomePathForRole(role), { replace: true });
    }
  }, [isReady, isAllowed, role, navigate]);

  if (!isReady) {
    return <div className="p-4 text-center text-muted">Checking access...</div>;
  }

  if (!isAllowed) {
    return <div className="p-4 text-center text-muted">Redirecting...</div>;
  }

  return children;
};

export default RequireRole;
