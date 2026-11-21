import { useCallback, useEffect, useState } from 'react';
import {
  createSpeciality,
  getSpecialityById,
  updateSpeciality,
} from '../services/specialitiesService';

// Resuelve el modo del formulario: con id → edición (precarga), sin id → alta.
function useSpecialityForm(id) {
  const isEdit = Boolean(id);
  const [speciality, setSpeciality] = useState(null);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      return undefined;
    }

    let isActive = true;

    setIsLoading(true);
    setLoadError(null);

    getSpecialityById(id)
      .then((result) => isActive && setSpeciality(result))
      .catch((error) => isActive && setLoadError(error))
      .finally(() => isActive && setIsLoading(false));

    return () => {
      isActive = false;
    };
  }, [id, isEdit]);

  const save = useCallback(
    (values) =>
      isEdit ? updateSpeciality(id, values) : createSpeciality(values),
    [id, isEdit]
  );

  return { isEdit, speciality, isLoading, loadError, save };
}

export default useSpecialityForm;
