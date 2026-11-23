// Reglas de react-hook-form alineadas con las validaciones del TPI (pág. 12-13).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DNI_PATTERN = /^\d{7,8}$/;

const emailRules = {
  required: 'El correo electrónico es obligatorio',
  pattern: {
    value: EMAIL_PATTERN,
    message: 'Ingresá un correo electrónico válido',
  },
};

const adminPasswordRules = {
  required: 'La contraseña es obligatoria',
  minLength: {
    value: 8,
    message: 'La contraseña debe tener al menos 8 caracteres',
  },
};

const dniRules = {
  required: 'El DNI es obligatorio',
  setValueAs: (value) => String(value ?? '').trim(),
  pattern: {
    value: DNI_PATTERN,
    message: 'El DNI debe tener 7 u 10 dígitos, sin puntos',
  },
};

export { emailRules, adminPasswordRules, dniRules };
