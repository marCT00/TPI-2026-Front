import { useCallback, useEffect, useState } from 'react';
import useDebouncedValue from '../../shared/hooks/useDebouncedValue';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import { getDoctors } from '../services/doctorsService';

const PAGE_SIZE = 10;
const MIN_SEARCH_LENGTH = 3;
const SEARCH_DELAY_MS = 300;

function useDoctorsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(searchTerm.trim(), SEARCH_DELAY_MS);
  const nameFilter =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : '';
  const isSearchTooShort =
    debouncedSearch.length > 0 && debouncedSearch.length < MIN_SEARCH_LENGTH;

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    getDoctors(
      { pageSize: PAGE_SIZE, pageIndex: page, name: nameFilter },
      { signal: controller.signal }
    )
      .then((result) => {
        setItems(result.items);
        setTotal(result.total);
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
  }, [page, nameFilter, reloadKey]);

  const changeSearch = useCallback((value) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  // Si se dio de baja el único médico de la página, vuelve a la anterior.
  const refreshAfterDelete = useCallback(() => {
    if (items.length === 1 && page > 1) {
      setPage((current) => current - 1);

      return;
    }

    refresh();
  }, [items.length, page, refresh]);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    isLoading,
    error,
    searchTerm,
    isFiltered: Boolean(nameFilter),
    isSearchTooShort,
    minSearchLength: MIN_SEARCH_LENGTH,
    changeSearch,
    setPage,
    refresh,
    refreshAfterDelete,
  };
}

export default useDoctorsList;
