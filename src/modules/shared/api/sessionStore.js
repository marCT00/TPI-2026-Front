// Única fuente de verdad para persistir la sesión en el navegador.
const SESSION_KEY = 'medportal.session';
const LEGACY_TOKEN_KEY = 'token';

const readSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

const getToken = () => readSession()?.token ?? null;

export { readSession, writeSession, clearSession, getToken };
