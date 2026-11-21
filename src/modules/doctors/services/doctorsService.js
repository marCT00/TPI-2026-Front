import { instance } from '../../shared/api/axiosInstance';

const DOCTORS_ENDPOINT = 'api/doctors';

const toDoctor = (raw) => ({
  id: raw.id,
  name: raw.name,
  licenseNumber: raw.licenseNumber ?? '',
  speciality: {
    id: raw.speciality?.id ?? null,
    name: raw.speciality?.name ?? 'Sin especialidad',
  },
});

const toRequest = ({ name, licenseNumber, specialityId }) => ({
  name: name.trim(),
  licenseNumber: licenseNumber.trim(),
  specialityId,
});

// GET /api/doctors?pageSize&pageIndex&name
// El nombre solo se manda si hay texto, porque el backend valida su longitud.
const getDoctors = async (
  { pageSize = 10, pageIndex = 1, name = '' } = {},
  { signal } = {}
) => {
  const params = { pageSize, pageIndex };

  if (name) {
    params.name = name;
  }

  const { data } = await instance.get(DOCTORS_ENDPOINT, { params, signal });

  return {
    items: (data?.data ?? []).map(toDoctor),
    total: data?.total ?? 0,
  };
};

const getDoctorById = async (id) => {
  const { data } = await instance.get(`${DOCTORS_ENDPOINT}/${id}`);

  return toDoctor(data);
};

const createDoctor = async (values) => {
  const { data } = await instance.post(DOCTORS_ENDPOINT, toRequest(values));

  return toDoctor(data);
};

const updateDoctor = async (id, values) => {
  const { data } = await instance.put(
    `${DOCTORS_ENDPOINT}/${id}`,
    toRequest(values)
  );

  return toDoctor(data);
};

// Baja lógica: el backend marca al médico como "deleted".
const deleteDoctor = async (id) => {
  await instance.delete(`${DOCTORS_ENDPOINT}/${id}`);
};

export { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
