import { instance } from '../../shared/api/axiosInstance';

const AVAILABILITIES_ENDPOINT = 'api/availabilities';

const DAY_KEYS_BY_INDEX = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
];

const DAY_ALIASES = {
  0: 'DOMINGO',
  domingo: 'DOMINGO',
  sunday: 'DOMINGO',
  1: 'LUNES',
  lunes: 'LUNES',
  monday: 'LUNES',
  2: 'MARTES',
  martes: 'MARTES',
  tuesday: 'MARTES',
  3: 'MIERCOLES',
  miercoles: 'MIERCOLES',
  miércoles: 'MIERCOLES',
  wednesday: 'MIERCOLES',
  4: 'JUEVES',
  jueves: 'JUEVES',
  thursday: 'JUEVES',
  5: 'VIERNES',
  viernes: 'VIERNES',
  friday: 'VIERNES',
  6: 'SABADO',
  sabado: 'SABADO',
  sábado: 'SABADO',
  saturday: 'SABADO',
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

// "08:00:00" -> "08:00"
const toShortTime = (value) => String(value ?? '').slice(0, 5);

const getDayKeyFromDate = (dateText) => {
  const [year, month, day] = String(dateText)
    .slice(0, 10)
    .split('-')
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const localDate = new Date(year, month - 1, day);

  return DAY_KEYS_BY_INDEX[localDate.getDay()] ?? null;
};

const normalizeDayKey = (value) => {
  const text = String(value ?? '').trim();

  if (ISO_DATE_PATTERN.test(text)) {
    return getDayKeyFromDate(text);
  }

  return DAY_ALIASES[text.toLowerCase()] ?? null;
};

const toSlot = (raw) => {
  const rawDate = raw.date ?? raw.day ?? raw.scheduledDate ?? '';
  const date = ISO_DATE_PATTERN.test(String(rawDate))
    ? String(rawDate).slice(0, 10)
    : '';
  const dayKey = normalizeDayKey(raw.dayOfWeek ?? raw.day ?? date);

  return {
    id: raw.id ?? null,
    date,
    dayKey,
    startTime: toShortTime(raw.startTime ?? raw.start),
    endTime: toShortTime(raw.endTime ?? raw.end),
  };
};

// Agrupa por día de la semana (LUNES..DOMINGO) tomando la menor hora de
// entrada y la mayor hora de salida cuando el backend devuelve slots de 30 min.
const aggregateRulesFromItems = (items) => {
  const byDay = new Map();

  items.forEach((item) => {
    const slot = toSlot(item);

    if (!slot.dayKey || !slot.startTime || !slot.endTime) {
      return;
    }

    const current = byDay.get(slot.dayKey);

    if (!current) {
      byDay.set(slot.dayKey, {
        day: slot.dayKey,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      return;
    }

    if (slot.startTime < current.startTime) {
      current.startTime = slot.startTime;
    }

    if (slot.endTime > current.endTime) {
      current.endTime = slot.endTime;
    }
  });

  return Array.from(byDay.values());
};

const toAvailabilityRequest = ({ doctorId, month, days = [] }) => ({
  doctorId,
  month: Number(month) || new Date().getMonth() + 1,
  days: days.map(({ day, dayOfWeek, startTime, endTime }) => {
    const rawDay = day ?? dayOfWeek;
    const normalizedDay = normalizeDayKey(rawDay) ?? rawDay;

    return {
      day: normalizedDay,
      dayOfWeek: normalizedDay,
      startTime: toShortTime(startTime),
      endTime: toShortTime(endTime),
    };
  }),
});

// GET /api/doctors/{doctorId}/availabilities?month
const fetchRawAvailabilities = async (
  doctorId,
  { month } = {},
  { signal } = {}
) => {
  const params = {};

  if (month) {
    params.month = month;
  }

  const { data } = await instance.get(`api/doctors/${doctorId}/availabilities`, {
    params,
    signal,
  });

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.data) ? data.data : [];
};

const getDoctorAvailabilitySlots = async (doctorId, query, options) => {
  const rawItems = await fetchRawAvailabilities(doctorId, query, options);

  return rawItems.map(toSlot);
};

const getDoctorAvailabilityRules = async (doctorId, query, options) => {
  const rawItems = await fetchRawAvailabilities(doctorId, query, options);

  return aggregateRulesFromItems(rawItems);
};

// POST /api/availabilities
const createAvailabilities = async (values) => {
  const payload = toAvailabilityRequest(values);
  const { data } = await instance.post(AVAILABILITIES_ENDPOINT, payload);

  return data;
};

// PUT /api/availabilities
const updateAvailabilities = async (values) => {
  const payload = toAvailabilityRequest(values);
  const { data } = await instance.put(AVAILABILITIES_ENDPOINT, payload);

  return data;
};

export {
  normalizeDayKey,
  getDoctorAvailabilitySlots,
  getDoctorAvailabilityRules,
  createAvailabilities,
  updateAvailabilities,
};
