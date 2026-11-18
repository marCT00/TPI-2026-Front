import { useCallback, useEffect, useMemo, useState } from 'react';
import useToast from '../../shared/ui/organisms/toast/useToast';
import { loginAdmin, loginPatient } from '../services/authService';
import {
  buildSession,
  loadActiveSession,
  persistSession,
  removeSession,
} from '../helpers/session';
import { ROLES, getHomePath } from '../helpers/roles';
import AuthContext from './AuthContext';

const createRoleMismatchError = () => {
  const error = new Error('El usuario no tiene el rol requerido');

  error.apiError = {
    status: 403,
    errorCode: 'AUTHORIZATION_FAILED',
    message: null,
    details: [],
  };

  return error;
};

// Expone a la UI solo los datos del usuario, nunca el token (ISP).
const toPublicUser = (session) => {
  if (!session) {
    return null;
  }

  const { email, dni, fullName, userId } = session;

  return { email, dni, fullName, userId };
};

function AuthProvider({ children }) {
  const [session, setSession] = useState(loadActiveSession);
  const { showToast } = useToast();

  const signout = useCallback(() => {
    removeSession();
    setSession(null);
  }, []);

  const startSession = useCallback((loginResponse, credentials, expected) => {
    const newSession = buildSession(loginResponse, credentials);

    if (newSession.role !== expected) {
      throw createRoleMismatchError();
    }

    persistSession(newSession);
    setSession(newSession);

    return newSession;
  }, []);

  const signinAdmin = useCallback(
    async ({ email, password }) => {
      const response = await loginAdmin({ email, password });

      return startSession(response, { email }, ROLES.ADMIN);
    },
    [startSession]
  );

  const signinPatient = useCallback(
    async ({ email, dni }) => {
      const response = await loginPatient({ email, dni });

      return startSession(
        response,
        { email, dni: String(dni).trim() },
        ROLES.PATIENT
      );
    },
    [startSession]
  );

  // Cierra la sesión automáticamente cuando vence el JWT (claim exp).
  useEffect(() => {
    if (!session?.expiresAt) {
      return undefined;
    }

    const timer = setTimeout(
      () => {
        signout();
        showToast({
          variant: 'warning',
          title: 'Sesión expirada',
          message: 'Por seguridad, volvé a iniciar sesión.',
        });
      },
      Math.max(session.expiresAt - Date.now(), 0)
    );

    return () => clearTimeout(timer);
  }, [session, signout, showToast]);

  const value = useMemo(() => {
    const role = session?.role ?? null;

    return {
      user: toPublicUser(session),
      role,
      isAuthenticated: Boolean(session),
      isAdmin: role === ROLES.ADMIN,
      isPatient: role === ROLES.PATIENT,
      homePath: getHomePath(role),
      signinAdmin,
      signinPatient,
      signout,
    };
  }, [session, signinAdmin, signinPatient, signout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
