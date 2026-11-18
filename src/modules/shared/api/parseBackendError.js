// Normaliza el contrato de error del backend { errorCode, message, details }.
// Acepta también PascalCase (ErrorCode, Message, Details), que es como lo
// serializa hoy ExceptionHandlingMiddleware.

const MESSAGES_BY_CODE = {
  AUTHENTICATION_FAILED: 'Las credenciales ingresadas no son correctas.',
  AUTHORIZATION_FAILED: 'No tenés permisos para realizar esta acción.',
  INVALID_DNI: 'El DNI debe tener 7 u 8 dígitos numéricos.',
  REGISTER_USER_CONFLICT: 'Ya existe un usuario registrado con esos datos.',
  RATE_LIMIT_EXCEEDED:
    'Realizaste demasiados intentos. Esperá un momento y volvé a intentar.',
  UNHANDLED_ERROR: 'Ocurrió un error inesperado. Intentá nuevamente.',
};

const MESSAGES_BY_STATUS = {
  0: 'No se pudo conectar con el servidor. Verificá tu conexión o que el backend esté en ejecución.',
  401: 'Tu sesión no es válida. Volvé a iniciar sesión.',
  403: 'No tenés permisos para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  429: MESSAGES_BY_CODE.RATE_LIMIT_EXCEEDED,
  500: MESSAGES_BY_CODE.UNHANDLED_ERROR,
};

const normalizeDetails = (details) => {
  if (!details) {
    return [];
  }

  return Array.isArray(details) ? details : [details];
};

const parseBackendError = (error) => {
  const response = error?.response;
  const status = response?.status ?? 0;
  const data =
    response?.data && typeof response.data === 'object' ? response.data : {};
  const errorCode =
    data.errorCode ??
    data.ErrorCode ??
    (status === 429 ? 'RATE_LIMIT_EXCEEDED' : null);

  return {
    status,
    errorCode,
    message: data.message ?? data.Message ?? data.title ?? null,
    details: normalizeDetails(data.details ?? data.Details ?? data.errors),
  };
};

// overrides permite a cada pantalla personalizar el texto por errorCode o
// por status HTTP sin tocar este módulo (OCP).
const getErrorMessage = (error, overrides = {}) => {
  const apiError = error?.apiError ?? parseBackendError(error);
  const { status, errorCode, message } = apiError;

  return (
    (errorCode && overrides[errorCode]) ||
    overrides[status] ||
    (errorCode && MESSAGES_BY_CODE[errorCode]) ||
    message ||
    MESSAGES_BY_STATUS[status] ||
    MESSAGES_BY_STATUS[500]
  );
};

// Atajo para las pantallas que necesitan decidir según el errorCode o status.
const getApiError = (error) => error?.apiError ?? parseBackendError(error);

export { parseBackendError, getErrorMessage, getApiError };
