// Reglas de validación para la solicitud de turno (pág. 18 del PDF).
const REASON_LIMITS = { min: 5, max: 500 };

const DAY_NAMES_SHORT = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const DAY_NAMES_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const MONTH_NAMES_SHORT = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
];
const MONTH_NAMES_FULL = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const reasonRules = {
  setValueAs: (value) => String(value ?? '').trim(),
  required: 'El motivo de la consulta es obligatorio',
  minLength: {
    value: REASON_LIMITS.min,
    message: `El motivo debe tener al menos ${REASON_LIMITS.min} caracteres`,
  },
  maxLength: {
    value: REASON_LIMITS.max,
    message: `El motivo no puede superar los ${REASON_LIMITS.max} caracteres`,
  },
};

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseIsoDate = (isoDate) => {
  const [year, month, day] = String(isoDate ?? '')
    .slice(0, 10)
    .split('-')
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

// Retorna el lunes (00:00 local) de la semana de la fecha dada.
const getMondayOfWeek = (referenceDate = new Date()) => {
  const date = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
  const dayOfWeek = date.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  date.setDate(date.getDate() + diffToMonday);

  return date;
};

const addDays = (baseDate, daysCount) => {
  const next = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate()
  );

  next.setDate(next.getDate() + daysCount);

  return next;
};

// Construye los días visibles de la semana (Lunes a Viernes, o incluye Sábado/Domingo si tienen turnos).
const buildWeekDays = (mondayDate, slotsByDate = {}) => {
  const saturdayIso = toIsoDate(addDays(mondayDate, 5));
  const sundayIso = toIsoDate(addDays(mondayDate, 6));
  const totalDays =
    slotsByDate[sundayIso]?.length > 0
      ? 7
      : slotsByDate[saturdayIso]?.length > 0
        ? 6
        : 5;

  const days = [];

  for (let offset = 0; offset < totalDays; offset += 1) {
    const current = addDays(mondayDate, offset);
    const dayIndex = current.getDay();
    const monthIndex = current.getMonth();
    const dayNumber = String(current.getDate()).padStart(2, '0');

    days.push({
      isoDate: toIsoDate(current),
      dayName: DAY_NAMES_SHORT[dayIndex],
      dayFullName: DAY_NAMES_FULL[dayIndex],
      dateNumber: dayNumber,
      monthShort: MONTH_NAMES_SHORT[monthIndex],
      monthFull: MONTH_NAMES_FULL[monthIndex],
      fullDate: `${DAY_NAMES_FULL[dayIndex]} ${current.getDate()} de ${MONTH_NAMES_FULL[monthIndex]} de ${current.getFullYear()}`,
    });
  }

  return days;
};

const formatWeekRangeLabel = (weekDays = []) => {
  if (weekDays.length === 0) {
    return '';
  }

  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];

  return `${first.dayFullName} ${Number(first.dateNumber)} - ${last.dayFullName} ${Number(last.dateNumber)}, ${last.monthFull}`;
};

// RN04: Filtra turnos en fechas u horarios pasados y los agrupa por YYYY-MM-DD.
const groupFutureSlotsByDate = (slots = [], now = new Date()) => {
  const todayIso = toIsoDate(now);
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const grouped = {};

  slots.forEach((slot) => {
    if (!slot?.date || !slot?.startTime) {
      return;
    }

    if (slot.date < todayIso) {
      return;
    }

    if (slot.date === todayIso && slot.startTime <= currentTime) {
      return;
    }

    if (!grouped[slot.date]) {
      grouped[slot.date] = [];
    }

    grouped[slot.date].push(slot);
  });

  Object.values(grouped).forEach((daySlots) => {
    daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return grouped;
};

export {
  REASON_LIMITS,
  reasonRules,
  toIsoDate,
  parseIsoDate,
  getMondayOfWeek,
  addDays,
  buildWeekDays,
  formatWeekRangeLabel,
  groupFutureSlotsByDate,
};
