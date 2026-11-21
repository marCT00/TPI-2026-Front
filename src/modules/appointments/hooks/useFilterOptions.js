import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import { getDoctors } from '../../doctors/services/doctorsService';
import { getSpecialities } from '../../specialities/services/specialitiesService';

const MAX_OPTIONS = 100;

// Especialidades y médicos activos para los selects de la búsqueda.
function useFilterOptions() {
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const query = { pageSize: MAX_OPTIONS, pageIndex: 1 };
    const options = { signal: controller.signal };

    Promise.all([getSpecialities(query, options), getDoctors(query, options)])
      .then(([specialitiesResult, doctorsResult]) => {
        setSpecialities(
          specialitiesResult.items.map((speciality) => ({
            value: speciality.id,
            label: speciality.name,
          }))
        );
        setDoctors(
          doctorsResult.items.map((doctor) => ({
            value: doctor.id,
            label: doctor.name,
            specialityId: doctor.speciality.id,
          }))
        );
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return { specialities, doctors, isLoading, error };
}

export default useFilterOptions;
