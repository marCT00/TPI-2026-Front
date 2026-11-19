// Mismo criterio que IsDniValid del backend: solo dígitos, entre 7 y 10.
const DNI_LIMITS = { min: 7, max: 10 };

const patientDniRules = {
  setValueAs: (value) => String(value ?? '').trim(),
  pattern: {
    value: /^\d*$/,
    message: 'El DNI solo puede contener números',
  },
  validate: (value) =>
    !value ||
    (value.length >= DNI_LIMITS.min && value.length <= DNI_LIMITS.max) ||
    `El DNI debe tener entre ${DNI_LIMITS.min} y ${DNI_LIMITS.max} dígitos`,
};

export { DNI_LIMITS, patientDniRules };
