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

// Prefijo de URL de cada área privada. Las rutas que no coinciden con ninguno
// pertenecen al área del paciente. Agregar un rol nuevo = sumar una entrada acá.
const AREA_PREFIX_BY_ROLE = {
  [ROLES.ADMIN]: '/admin',
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

// Rol dueño de una ruta según su prefijo de área.
const getRoleForPath = (path = '') =>
  Object.keys(AREA_PREFIX_BY_ROLE).find((role) =>
    path.startsWith(AREA_PREFIX_BY_ROLE[role])
  ) ?? ROLES.PATIENT;

const canAccessPath = (role, path) =>
  Boolean(path) && !isLoginPath(path) && getRoleForPath(path) === role;

export {
  ROLES,
  normalizeRole,
  getHomePath,
  getLoginPath,
  getRoleForPath,
  canAccessPath,
};
