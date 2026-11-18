import { instance } from '../../shared/api/axiosInstance';

// La consigna define "api/specialties", pero el backend (feature/mar) hoy
// expone "api/specialities". Cuando el backend acepte la ruta de la consigna,
// se cambia solo esta constante.
const SPECIALTIES_ENDPOINT = 'api/specialities';

const toSpecialty = (raw) => ({
  id: raw.id,
  name: raw.name,
  description: raw.description,
  isActive: raw.isActive ?? true,
});

const toRequest = ({ name, description }) => ({
  name: name.trim(),
  description: description.trim(),
});

// GET /api/specialties?pageSize&pageIndex&name
// El backend responde 400 si "name" llega vacío, por eso solo se envía si hay texto.
const getSpecialties = async (
  { pageSize = 10, pageIndex = 1, name = '' } = {},
  { signal } = {}
) => {
  const params = { pageSize, pageIndex };

  if (name) {
    params.name = name;
  }

  const { data } = await instance.get(SPECIALTIES_ENDPOINT, { params, signal });

  return {
    items: (data?.data ?? []).map(toSpecialty),
    total: data?.total ?? 0,
  };
};

const getSpecialtyById = async (id) => {
  const { data } = await instance.get(`${SPECIALTIES_ENDPOINT}/${id}`);

  return toSpecialty(data);
};

const createSpecialty = async (values) => {
  const { data } = await instance.post(SPECIALTIES_ENDPOINT, toRequest(values));

  return toSpecialty(data);
};

const updateSpecialty = async (id, values) => {
  const { data } = await instance.put(
    `${SPECIALTIES_ENDPOINT}/${id}`,
    toRequest(values)
  );

  return toSpecialty(data);
};

// Baja lógica: el backend marca la especialidad como "deleted".
const deleteSpecialty = async (id) => {
  await instance.delete(`${SPECIALTIES_ENDPOINT}/${id}`);
};

export {
  getSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
