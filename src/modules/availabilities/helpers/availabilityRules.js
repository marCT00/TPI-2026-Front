import { normalizeDayKey } from '../services/availabilitiesService';

// RN02: Los turnos se gestionan en bloques de 30 minutos.
const SLOT_DURATION_MINUTES = 30;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const WEEK_DAYS = [
  {
    key: 'LUNES',
    label: 'Lunes',
    defaultEnabled: true,
    defaultStartTime: '08:00',
    defaultEndTime: '16:00',
  },
  {
    key: 'MARTES',
    label: 'Martes',
    defaultEnabled: true,
    defaultStartTime: '08:00',
    defaultEndTime: '16:00',
  },
  {
    key: 'MIERCOLES',
    label: 'Miércoles',
    defaultEnabled: true,
    defaultStartTime: '08:00',
    defaultEndTime: '12:00',
  },
  {
    key: 'JUEVES',
    label: 'Jueves',
    defaultEnabled: true,
    defaultStartTime: '09:00',
    defaultEndTime: '18:00',
  },
  {
    key: 'VIERNES',
    label: 'Viernes',
    defaultEnabled: true,
    defaultStartTime: '08:00',
    defaultEndTime: '14:00',
  },
  {
    key: 'SABADO',
    label: 'Sábado',
    defaultEnabled: false,
    defaultStartTime: '08:00',
    defaultEndTime: '12:00',
  },
  {
    key: 'DOMINGO',
    label: 'Domingo',
    defaultEnabled: false,
    defaultStartTime: '08:00',
    defaultEndTime: '12:00',
  },
];

// Opciones horarias en pasos de 30 minutos (07:00 a 21:00).
const buildTimeOptions = (startHour = 7, endHour = 21) => {
  const options = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    const paddedHour = String(hour).padStart(2, '0');

    options.push({ value: `${paddedHour}:00`, label: `${paddedHour}:00` });

    if (hour < endHour) {
      options.push({ value: `${paddedHour}:30`, label: `${paddedHour}:30` });
    }
  }

  return options;
};

const TIME_OPTIONS = buildTimeOptions();

const toMinutes = (timeText) => {
  const match = TIME_PATTERN.exec(String(timeText ?? '').trim());

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
};

// Valida una fila de día individual cuando está activa.
const validateDayRule = (dayItem) => {
  if (!dayItem?.enabled) {
    return true;
  }

  const startMinutes = toMinutes(dayItem.startTime);
  const endMinutes = toMinutes(dayItem.endTime);

  if (startMinutes === null || endMinutes === null) {
    return 'Ingresá un horario válido (HH:mm).';
  }

  if (startMinutes >= endMinutes) {
    return 'La hora de salida debe ser posterior a la de entrada.';
  }

  if ((endMinutes - startMinutes) % SLOT_DURATION_MINUTES !== 0) {
    return `El rango horario debe ser divisible en bloques de ${SLOT_DURATION_MINUTES} minutos.`;
  }

  return true;
};

// Valida la grilla semanal completa (RN01, RN02 y sin solapamientos).
const validateScheduleDays = (days = []) => {
  const activeDays = days.filter((item) => item?.enabled);

  if (activeDays.length === 0) {
    return 'Debés activar al menos un día de atención.';
  }

  const rangesByDay = new Map();

  for (const dayItem of activeDays) {
    const ruleValidation = validateDayRule(dayItem);

    if (ruleValidation !== true) {
      return `${dayItem.label || dayItem.day}: ${ruleValidation}`;
    }

    const dayKey = normalizeDayKey(dayItem.day) ?? dayItem.day;
    const start = toMinutes(dayItem.startTime);
    const end = toMinutes(dayItem.endTime);
    const existingRanges = rangesByDay.get(dayKey) ?? [];

    const hasOverlap = existingRanges.some(
      (range) => start < range.end && range.start < end
    );

    if (hasOverlap) {
      return `Existen horarios solapados en el día ${dayItem.label || dayKey}.`;
    }

    existingRanges.push({ start, end });
    rangesByDay.set(dayKey, existingRanges);
  }

  return true;
};

const buildInitialDaysForm = (existingRules = []) => {
  const hasExisting = Array.isArray(existingRules) && existingRules.length > 0;
  const rulesByDay = new Map();

  if (hasExisting) {
    existingRules.forEach((rule) => {
      const key = normalizeDayKey(rule.day ?? rule.dayOfWeek);

      if (key) {
        rulesByDay.set(key, rule);
      }
    });
  }

  return WEEK_DAYS.map((dayDef) => {
    const existing = rulesByDay.get(dayDef.key);

    if (hasExisting) {
      return {
        day: dayDef.key,
        label: dayDef.label,
        enabled: Boolean(existing),
        startTime: existing?.startTime || dayDef.defaultStartTime,
        endTime: existing?.endTime || dayDef.defaultEndTime,
      };
    }

    return {
      day: dayDef.key,
      label: dayDef.label,
      enabled: dayDef.defaultEnabled,
      startTime: dayDef.defaultStartTime,
      endTime: dayDef.defaultEndTime,
    };
  });
};

const toActiveDaysPayload = (days = []) =>
  days
    .filter((item) => item?.enabled)
    .map((item) => ({
      day: item.day,
      dayOfWeek: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
    }));

export {
  SLOT_DURATION_MINUTES,
  WEEK_DAYS,
  TIME_OPTIONS,
  toMinutes,
  validateDayRule,
  validateScheduleDays,
  buildInitialDaysForm,
  toActiveDaysPayload,
};
