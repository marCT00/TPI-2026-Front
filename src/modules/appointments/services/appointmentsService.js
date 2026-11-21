import { instance } from '../../shared/api/axiosInstance';

const APPOINTMENTS_ENDPOINT = 'api/appointments';
const META_STORAGE_KEY = 'medportal.appointments.meta';

const readMetadataMap = () => {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);

    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveAppointmentMetadata = (id, turnId, meta) => {
  if (!meta?.doctorName && !meta?.specialityName) {
    return;
  }

  try {
    const current = readMetadataMap();

    if (id) {
      current[id] = meta;
    }

    if (turnId) {
      current[turnId] = meta;
    }

    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Si localStorage no está disponible, se continúa sin caché local.
  }
};

// "09:30:00" -> "09:30"
const toShortTime = (value) => String(value ?? '').slice(0, 5);

const toAppointment = (raw = {}) => {
  const doctorObj = raw.doctor ?? {};
  const specialityObj =
    doctorObj.speciality ??
    doctorObj.specialty ??
    raw.speciality ??
    raw.specialty ??
    {};
  const turnId = raw.turnId ?? raw.availabilitySlotId ?? null;
  const metaMap = readMetadataMap();
  const cachedMeta = metaMap[raw.id] ?? (turnId ? metaMap[turnId] : null) ?? {};

  return {
    id: raw.id,
    turnId,
    date: String(raw.appointmentDate ?? raw.date ?? '').slice(0, 10),
    startTime: toShortTime(raw.startTime),
    endTime: toShortTime(raw.endTime),
    status: raw.status,
    reason: raw.reason ?? raw.motive ?? '',
    patient: {
      id: raw.patientId ?? raw.patient?.id ?? null,
      dni: raw.patient?.dni ?? raw.patientDni ?? '',
      name: raw.patient?.name ?? '',
    },
    doctor: {
      id:
        doctorObj.doctorId ??
        doctorObj.id ??
        raw.doctorId ??
        cachedMeta.doctorId ??
        null,
      name:
        doctorObj.name ??
        raw.doctorName ??
        cachedMeta.doctorName ??
        'Profesional Médico',
    },
    speciality: {
      id:
        specialityObj.specialityId ??
        specialityObj.specialtyId ??
        specialityObj.id ??
        cachedMeta.specialityId ??
        null,
      name:
        specialityObj.name ??
        raw.specialityName ??
        cachedMeta.specialityName ??
        'Consulta Médica',
    },
  };
};

// Solo se mandan los filtros que tienen valor; mapea patientDni -> dni.
const toSearchParams = ({ pageSize, pageIndex, filters = {} }) => {
  const params = { pageSize, pageIndex };

  Object.entries(filters).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    if (key === 'patientDni') {
      params.dni = value;
      params.patientDni = value;

      return;
    }

    params[key] = value;
  });

  return params;
};

// GET /api/appointments/search?pageSize&pageIndex&dni&doctorId&specialityId&date
const searchAppointments = async (
  { pageSize = 10, pageIndex = 1, filters = {} } = {},
  { signal } = {}
) => {
  const params = toSearchParams({ pageSize, pageIndex, filters });
  const { data } = await instance.get(`${APPOINTMENTS_ENDPOINT}/search`, {
    params,
    signal,
  });

  return {
    items: (data?.data ?? []).map(toAppointment),
    total: data?.total ?? 0,
  };
};

// Consulta los turnos agendados para un día puntual.
const getAppointmentsByDate = async (date, { signal } = {}) =>
  searchAppointments(
    { pageSize: 50, pageIndex: 1, filters: { date } },
    { signal }
  );

// POST /api/appointments
const createAppointment = async ({
  doctorId,
  doctorName,
  specialityId,
  specialityName,
  availabilitySlotId,
  patientDni,
  reason,
}) => {
  const payload = {
    doctorId,
    availabilitySlotId,
    availabilityId: availabilitySlotId,
    patient: {
      dni: String(patientDni ?? '').trim(),
    },
    reason: String(reason ?? '').trim(),
  };

  const { data } = await instance.post(APPOINTMENTS_ENDPOINT, payload);

  saveAppointmentMetadata(data?.id, data?.turnId ?? availabilitySlotId, {
    doctorId,
    doctorName,
    specialityId,
    specialityName,
  });

  return toAppointment(data);
};

// GET /api/appointments/patient?dni={dni}
const getPatientAppointments = async (dni, { signal } = {}) => {
  const { data } = await instance.get(`${APPOINTMENTS_ENDPOINT}/patient`, {
    params: { dni: String(dni ?? '').trim() },
    signal,
  });

  const rawList = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return rawList.map(toAppointment);
};

// DELETE /api/appointments/{id}
const cancelAppointment = async (id) => {
  await instance.delete(`${APPOINTMENTS_ENDPOINT}/${id}`);
};

export {
  toAppointment,
  searchAppointments,
  getAppointmentsByDate,
  createAppointment,
  getPatientAppointments,
  cancelAppointment,
};
