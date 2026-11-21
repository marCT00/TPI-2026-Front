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

const redirectToLogin = () => {
  const { pathname } = window.location;
  const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/login';

  if (pathname !== loginPath) {
    window.location.assign(loginPath);
  }
};

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    error.apiError = parseBackendError(error);

    if (error.apiError.status === 401 && !isAuthRequest(error.config)) {
      clearSession();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export { instance };
