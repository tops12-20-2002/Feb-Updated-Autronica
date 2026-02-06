import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

function RoleProtectedRoute({ children, allowedRoles = [] }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Determine effective role from selectedRole (chosen at role select) or from user's role
  const selectedRole = localStorage.getItem('selectedRole');
  const effectiveRole = selectedRole || user.role;

  // Check if effective role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
    // Redirect to appropriate dashboard based on effective role
    if (effectiveRole === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/mechanic-dashboard" replace />;
    }
  }

  return children;
}

export default RoleProtectedRoute;

