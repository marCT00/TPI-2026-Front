import axios from 'axios';
import { clearSession, getToken } from './sessionStore';
import { parseBackendError } from './parseBackendError';

const AUTH_ENDPOINT_PREFIX = 'api/auth/';

const instance = axios.create({
  baseURL: import.meta.env.DEV ? '/' : import.meta.env.VITE_BACKEND_URL,
});

instance.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// En los endpoints de login un 401 significa "credenciales incorrectas":
// no hay sesión que cerrar ni a dónde redirigir.
const isAuthRequest = (config) =>
  (config?.url ?? '').replace(/^\//, '').startsWith(AUTH_ENDPOINT_PREFIX);

// La capa shared no conoce roles ni rutas (DIP): solo avisa que la sesión dejó
// de ser válida. Qué hacer después lo decide quien registre el handler
// (AuthProvider).
let unauthorizedHandler = null;

const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
};

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    error.apiError = parseBackendError(error);

    if (error.apiError.status === 401 && !isAuthRequest(error.config)) {
      // Varias requests en paralelo pueden volver con 401: solo la primera
      // (la que todavía encuentra sesión guardada) dispara el handler.
      const hadSession = Boolean(getToken());

      clearSession();

      if (hadSession) {
        unauthorizedHandler?.();
      }
    }

    return Promise.reject(error);
  }
);

export { instance, setUnauthorizedHandler };
