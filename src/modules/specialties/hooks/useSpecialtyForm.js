import { useCallback, useEffect, useState } from 'react';
import {
  createSpecialty,
  getSpecialtyById,
  updateSpecialty,
} from '../services/specialtiesService';

// Resuelve el modo del formulario: con id → edición (precarga), sin id → alta.
function useSpecialtyForm(id) {
  const isEdit = Boolean(id);
  const [specialty, setSpecialty] = useState(null);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      return undefined;
    }

    let isActive = true;

    setIsLoading(true);
    setLoadError(null);

    getSpecialtyById(id)
      .then((result) => isActive && setSpecialty(result))
      .catch((error) => isActive && setLoadError(error))
      .finally(() => isActive && setIsLoading(false));

    return () => {
      isActive = false;
    };
  }, [id, isEdit]);

  const save = useCallback(
    (values) =>
      isEdit ? updateSpecialty(id, values) : createSpecialty(values),
    [id, isEdit]
  );

  return { isEdit, specialty, isLoading, loadError, save };
}

export default useSpecialtyForm;
