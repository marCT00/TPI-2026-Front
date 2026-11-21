// Mismos límites que valida el backend (DoctorService).
const NAME_LIMITS = { min: 3, max: 100 };
const LICENSE_LIMITS = { max: 50 };

const trimValue = (value) => String(value ?? '').trim();

const nameRules = {
  setValueAs: trimValue,
  required: 'El nombre es obligatorio',
  minLength: {
    value: NAME_LIMITS.min,
    message: `El nombre debe tener al menos ${NAME_LIMITS.min} caracteres`,
  },
  maxLength: {
    value: NAME_LIMITS.max,
    message: `El nombre no puede superar los ${NAME_LIMITS.max} caracteres`,
  },
};

const licenseRules = {
  setValueAs: trimValue,
  required: 'El número de licencia es obligatorio',
  maxLength: {
    value: LICENSE_LIMITS.max,
    message: `La licencia no puede superar los ${LICENSE_LIMITS.max} caracteres`,
  },
};

const specialityRules = {
  required: 'Seleccioná una especialidad',
};

export {
  NAME_LIMITS,
  LICENSE_LIMITS,
  nameRules,
  licenseRules,
  specialityRules,
};
