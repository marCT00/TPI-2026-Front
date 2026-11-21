import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import { searchAppointments } from '../services/appointmentsService';

const PAGE_SIZE = 10;

const EMPTY_FILTERS = {
  patientDni: '',
  specialityId: '',
  doctorId: '',
  date: '',
};

// Los filtros se aplican al confirmar el formulario, no con cada tecla.
function useAppointmentsSearch() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    searchAppointments(
      { pageSize: PAGE_SIZE, pageIndex: page, filters },
      { signal: controller.signal }
    )
      .then((result) => {
        setItems(result.items);
        setTotal(result.total);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setItems([]);
          setTotal(0);
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [filters, page, reloadKey]);

  const applyFilters = useCallback((values) => {
    setFilters({ ...EMPTY_FILTERS, ...values });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    isLoading,
    error,
    filters,
    isFiltered: Object.values(filters).some(Boolean),
    applyFilters,
    clearFilters,
    setPage,
    refresh,
  };
}

export { EMPTY_FILTERS };
export default useAppointmentsSearch;
