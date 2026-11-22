import { useCallback, useEffect, useState } from 'react';
import {
  createDoctor,
  getDoctorById,
  updateDoctor,
} from '../services/doctorsService';

// Con id es edición (precarga el médico), sin id es alta.
function useDoctorForm(id) {
  const isEdit = Boolean(id);
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      return undefined;
    }

    let isActive = true;

    setIsLoading(true);
    setLoadError(null);

    getDoctorById(id)
      .then((result) => isActive && setDoctor(result))
      .catch((error) => isActive && setLoadError(error))
      .finally(() => isActive && setIsLoading(false));

    return () => {
      isActive = false;
    };
  }, [id, isEdit]);

  const save = useCallback(
    (values) => (isEdit ? updateDoctor(id, values) : createDoctor(values)),
    [id, isEdit]
  );

  return { isEdit, doctor, isLoading, loadError, save };
}

export default useDoctorForm;
