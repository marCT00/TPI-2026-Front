import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import { canAccessPath } from '../helpers/roles';

// Envuelve las pantallas de login. Cuando hay sesión (por ejemplo, justo
// después de un login exitoso) redirige a la ruta que el usuario intentaba
// abrir, si su rol puede verla, o al home de su rol.
function GuestRoute({ children }) {
  const { isAuthenticated, role, homePath } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from;
    const target = from && canAccessPath(role, from) ? from : homePath;

    return <Navigate to={target} replace />;
  }

  return children;
}

export default GuestRoute;
