import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import { getDoctors } from '../../doctors/services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';

const MAX_OPTIONS = 100;

// Especialidades y médicos activos para los selects de la búsqueda.
function useFilterOptions() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const query = { pageSize: MAX_OPTIONS, pageIndex: 1 };
    const options = { signal: controller.signal };

    Promise.all([getSpecialties(query, options), getDoctors(query, options)])
      .then(([specialtiesResult, doctorsResult]) => {
        setSpecialties(
          specialtiesResult.items.map((specialty) => ({
            value: specialty.id,
            label: specialty.name,
          }))
        );
        setDoctors(
          doctorsResult.items.map((doctor) => ({
            value: doctor.id,
            label: doctor.name,
            specialtyId: doctor.specialty.id,
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

  return { specialties, doctors, isLoading, error };
}

export default useFilterOptions;
