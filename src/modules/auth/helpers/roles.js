const ROLES = {
  ADMIN: 'ADMINISTRADOR',
  PATIENT: 'PACIENTE',
};

// El backend puede devolver "Administrador", "ADMINISTRADOR" o incluso
// "Administrator" (roles.json); todos se normalizan al valor del contrato.
const ROLE_ALIASES = {
  ADMINISTRADOR: ROLES.ADMIN,
  ADMINISTRATOR: ROLES.ADMIN,
  PACIENTE: ROLES.PATIENT,
  PATIENT: ROLES.PATIENT,
};

const HOME_BY_ROLE = {
  [ROLES.ADMIN]: '/admin/home',
  [ROLES.PATIENT]: '/',
};

const LOGIN_BY_ROLE = {
  [ROLES.ADMIN]: '/admin/login',
  [ROLES.PATIENT]: '/login',
};

const normalizeRole = (role) => {
  const key = String(role ?? '')
    .trim()
    .toUpperCase();

  return ROLE_ALIASES[key] ?? null;
};

const getHomePath = (role) => HOME_BY_ROLE[role] ?? '/login';

const getLoginPath = (role) => LOGIN_BY_ROLE[role] ?? '/login';

const isLoginPath = (path) => Object.values(LOGIN_BY_ROLE).includes(path);

const canAccessPath = (role, path) => {
  if (!path || isLoginPath(path)) {
    return false;
  }

  const isAdminArea = path.startsWith('/admin');

  return role === ROLES.ADMIN ? isAdminArea : !isAdminArea;
};

export { ROLES, normalizeRole, getHomePath, getLoginPath, canAccessPath };
