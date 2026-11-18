import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hook/useAuth';

// Sin sesión → login correspondiente (recordando a dónde quería ir).
// Con sesión pero rol no permitido → home de su propio rol.
function ProtectedRoute({ allowedRoles, redirectTo = '/login', children }) {
  const { isAuthenticated, role, homePath } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={homePath} replace />;
  }

  return children;
}

export default ProtectedRoute;
