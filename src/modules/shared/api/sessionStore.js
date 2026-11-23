// Única fuente de verdad para persistir la sesión en el navegador.
//
// Se usa sessionStorage en lugar de localStorage: el token vive solo mientras
// la pestaña esté abierta y no queda guardado en disco entre sesiones del
// navegador, lo que acota la ventana de exposición del JWT. (Sigue siendo
// legible por JS; la protección completa contra XSS requiere una cookie
// httpOnly emitida por el backend.)
const SESSION_KEY = 'medportal.session';
const LEGACY_TOKEN_KEY = 'token';

const storage = window.sessionStorage;

// Versiones anteriores guardaban la sesión en localStorage: se borra para que
// ningún token viejo quede persistido.
try {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
} catch {
  // Si el storage no está disponible no hay nada que limpiar.
}

const readSession = () => {
  try {
    const raw = storage.getItem(SESSION_KEY);

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeSession = (session) => {
  storage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => {
  storage.removeItem(SESSION_KEY);
  storage.removeItem(LEGACY_TOKEN_KEY);
};

const getToken = () => readSession()?.token ?? null;

export { readSession, writeSession, clearSession, getToken };
