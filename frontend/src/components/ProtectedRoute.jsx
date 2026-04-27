import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (adminOnly) {
    if (!isAuthenticated) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }

    return children;
  }

  // Keep guest access for user-only pages so existing blur-based UX remains unchanged.
  if (userOnly && isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (!isAuthenticated && !userOnly) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
