import { instance } from '../../shared/api/axiosInstance';

const SPECIALITIES_ENDPOINT = 'api/specialities';
const INACTIVE_STORAGE_KEY = 'tpi_inactive_specialities';

const getInactiveIds = () => {
  try {
    const raw = window.localStorage.getItem(INACTIVE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

const setSpecialityActiveState = (id, isActive) => {
  if (!id) {
    return;
  }

  try {
    const inactiveIds = getInactiveIds();

    if (isActive) {
      inactiveIds.delete(id);
    } else {
      inactiveIds.add(id);
    }

    window.localStorage.setItem(
      INACTIVE_STORAGE_KEY,
      JSON.stringify([...inactiveIds])
    );
  } catch {
    // Si localStorage no está disponible, se mantiene el estado del backend.
  }
};

const toSpeciality = (raw, inactiveIds = getInactiveIds()) => ({
  id: raw.id,
  name: raw.name,
  description: raw.description,
  isActive: inactiveIds.has(raw.id) ? false : (raw.isActive ?? true),
});

const toRequest = ({ name, description }) => ({
  name: name.trim(),
  description: description.trim(),
});

// GET /api/specialities?pageSize&pageIndex&name
// El backend responde 400 si "name" llega vacío, por eso solo se envía si hay texto.
const getSpecialities = async (
  { pageSize = 10, pageIndex = 1, name = '' } = {},
  { signal } = {}
) => {
  const params = { pageSize, pageIndex };

  if (name) {
    params.name = name;
  }

  const { data } = await instance.get(SPECIALITIES_ENDPOINT, {
    params,
    signal,
  });
  const inactiveIds = getInactiveIds();

  return {
    items: (data?.data ?? []).map((item) => toSpeciality(item, inactiveIds)),
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

  setSpecialityActiveState(data?.id, values.isActive ?? true);

  return toSpeciality(data);
};

const updateSpeciality = async (id, values) => {
  const { data } = await instance.put(
    `${SPECIALITIES_ENDPOINT}/${id}`,
    toRequest(values)
  );

  setSpecialityActiveState(id, values.isActive ?? true);

  return toSpeciality(data);
};

// Baja lógica: el backend marca la especialidad como "deleted".
const deleteSpeciality = async (id) => {
  await instance.delete(`${SPECIALITIES_ENDPOINT}/${id}`);
  setSpecialityActiveState(id, true);
};

export {
  getSpecialities,
  getSpecialityById,
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
};
