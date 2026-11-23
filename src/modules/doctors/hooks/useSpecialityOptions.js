import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import { getSpecialities } from '../../specialities/services/specialitiesService';

// El select muestra todas las especialidades activas, no solo una página.
const MAX_OPTIONS = 100;

function useSpecialityOptions() {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    getSpecialities(
      { pageSize: MAX_OPTIONS, pageIndex: 1, isActive: true },
      { signal: controller.signal }
    )
      .then((result) =>
        setOptions(
          result.items.map((speciality) => ({
            value: speciality.id,
            label: speciality.name,
          }))
        )
      )
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

  return { options, isLoading, error };
}

export default useSpecialityOptions;
