// Mismas reglas que valida el backend (consigna pág. 13).
const NAME_LIMITS = { min: 3, max: 100 };
const DESCRIPTION_LIMITS = { min: 10, max: 100 };

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

const descriptionRules = {
  setValueAs: trimValue,
  required: 'La descripción es obligatoria',
  minLength: {
    value: DESCRIPTION_LIMITS.min,
    message: `La descripción debe tener al menos ${DESCRIPTION_LIMITS.min} caracteres`,
  },
  maxLength: {
    value: DESCRIPTION_LIMITS.max,
    message: `La descripción no puede superar los ${DESCRIPTION_LIMITS.max} caracteres`,
  },
};

export { NAME_LIMITS, DESCRIPTION_LIMITS, nameRules, descriptionRules };
