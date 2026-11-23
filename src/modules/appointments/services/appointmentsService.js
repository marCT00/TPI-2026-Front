import { instance } from '../../shared/api/axiosInstance';

const APPOINTMENTS_ENDPOINT = 'api/appointments';

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
      id: doctorObj.doctorId ?? doctorObj.id ?? raw.doctorId ?? null,
      name: doctorObj.name ?? raw.doctorName ?? 'Profesional Médico',
    },
    speciality: {
      id:
        specialityObj.specialityId ??
        specialityObj.specialtyId ??
        specialityObj.id ??
        null,
      name: specialityObj.name ?? raw.specialityName ?? 'Consulta Médica',
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
