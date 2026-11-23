import { instance } from '../../shared/api/axiosInstance';

const SPECIALITIES_ENDPOINT = 'api/specialities';

const toSpeciality = (raw) => ({
  id: raw.id,
  name: raw.name,
  description: raw.description,
  isActive: raw.isActive ?? true,
});

const toRequest = ({ name, description, isActive = true }) => ({
  name: name.trim(),
  description: description.trim(),
  isActive: Boolean(isActive),
});

// GET /api/specialities?pageSize&pageIndex&name&isActive
// El backend responde 400 si "name" llega vacío, por eso solo se envía si hay texto.
const getSpecialities = async (
  { pageSize = 10, pageIndex = 1, name = '', isActive } = {},
  { signal } = {}
) => {
  const params = { pageSize, pageIndex };

  if (name) {
    params.name = name;
  }

  if (typeof isActive === 'boolean') {
    params.isActive = isActive;
  }

  const { data } = await instance.get(SPECIALITIES_ENDPOINT, {
    params,
    signal,
  });

  return {
    items: (data?.data ?? []).map(toSpeciality),
    total: data?.total ?? 0,
  };
};

const getSpecialityById = async (id) => {
  const { data } = await instance.get(`${SPECIALITIES_ENDPOINT}/${id}`);

  return toSpeciality(data);
};

const createSpeciality = async (values) => {
  const { data } = await instance.post(
    SPECIALITIES_ENDPOINT,
    toRequest(values)
  );

  return toSpeciality(data);
};

const updateSpeciality = async (id, values) => {
  const { data } = await instance.put(
    `${SPECIALITIES_ENDPOINT}/${id}`,
    toRequest(values)
  );

  return toSpeciality(data);
};

// Baja lógica: el backend marca la especialidad como "deleted".
const deleteSpeciality = async (id) => {
  await instance.delete(`${SPECIALITIES_ENDPOINT}/${id}`);
};

export {
  getSpecialities,
  getSpecialityById,
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
};
