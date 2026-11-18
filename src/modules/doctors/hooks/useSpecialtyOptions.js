import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import { getSpecialties } from '../../specialties/services/specialtiesService';

// El select muestra todas las especialidades activas, no solo una página.
const MAX_OPTIONS = 100;

function useSpecialtyOptions() {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    getSpecialties(
      { pageSize: MAX_OPTIONS, pageIndex: 1 },
      { signal: controller.signal }
    )
      .then((result) =>
        setOptions(
          result.items.map((specialty) => ({
            value: specialty.id,
            label: specialty.name,
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

export default useSpecialtyOptions;
