import { instance } from '../../shared/api/axiosInstance';

const APPOINTMENTS_ENDPOINT = 'api/appointments';

// "09:30:00" -> "09:30"
const toShortTime = (value) => String(value ?? '').slice(0, 5);

const toAppointment = (raw) => ({
  id: raw.id,
  date: String(raw.appointmentDate ?? '').slice(0, 10),
  startTime: toShortTime(raw.startTime),
  endTime: toShortTime(raw.endTime),
  status: raw.status,
  reason: raw.reason ?? '',
  patient: {
    dni: raw.patient?.dni ?? '',
    name: raw.patient?.name ?? '',
  },
  doctor: {
    id: raw.doctor?.doctorId ?? null,
    name: raw.doctor?.name ?? 'Sin médico',
  },
  speciality: {
    id: raw.doctor?.speciality?.specialityId ?? null,
    name: raw.doctor?.speciality?.name ?? 'Sin especialidad',
  },
});

// Solo se mandan los filtros que tienen valor.
const toSearchParams = ({ pageSize, pageIndex, filters }) => {
  const params = { pageSize, pageIndex };

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params[key] = value;
    }
  });

  return params;
};

// GET /api/appointments/search?pageSize&pageIndex&patientDni&doctorId&specialityId&date
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

// GET /api/appointments?date=YYYY-MM-DD (turnos agendados para un día)
const getAppointmentsByDate = async (date, { signal } = {}) => {
  const { data } = await instance.get(APPOINTMENTS_ENDPOINT, {
    params: { date },
    signal,
  });

  return {
    items: (data?.data ?? []).map(toAppointment),
    total: data?.total ?? 0,
  };
};

export { searchAppointments, getAppointmentsByDate };
