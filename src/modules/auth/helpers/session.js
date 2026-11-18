import {
  clearSession,
  readSession,
  writeSession,
} from '../../shared/api/sessionStore';
import { CLAIMS, decodeJwtPayload } from './jwt';
import { normalizeRole } from './roles';

// Arma el objeto de sesión a partir de la respuesta { token, role } del login
// y de los datos que el usuario ingresó (email, dni), ya validados por el backend.
const buildSession = ({ token, role }, { email = '', dni = null } = {}) => {
  const payload = decodeJwtPayload(token) ?? {};

  return {
    token,
    role: normalizeRole(role ?? payload[CLAIMS.ROLE]),
    userId: payload.sub ?? null,
    email: payload[CLAIMS.NAME] ?? email,
    dni,
    fullName: null,
    expiresAt: payload.exp ? payload.exp * 1000 : null,
  };
};

const isSessionValid = (session, now = Date.now()) =>
  Boolean(session?.token && session.role) &&
  (!session.expiresAt || session.expiresAt > now);

const loadActiveSession = () => {
  const session = readSession();

  if (isSessionValid(session)) {
    return session;
  }

  clearSession();

  return null;
};

export {
  buildSession,
  isSessionValid,
  loadActiveSession,
  writeSession as persistSession,
  clearSession as removeSession,
};
