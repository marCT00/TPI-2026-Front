import { useCallback, useEffect, useState } from 'react';
import useAuth from '../../auth/hook/useAuth';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import {
  cancelAppointment,
  getPatientAppointments,
} from '../services/appointmentsService';

function usePatientAppointments() {
  const { user } = useAuth();
  const dni = user?.dni ?? '';
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!dni) {
      setItems([]);
      setIsLoading(false);

      return undefined;
    }

    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    getPatientAppointments(dni, { signal: controller.signal })
      .then((appointments) => {
        setItems(appointments);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setItems([]);
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [dni, reloadKey]);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  const cancelById = useCallback(async (appointmentId) => {
    await cancelAppointment(appointmentId);
    setItems((current) =>
      current.filter((appointment) => appointment.id !== appointmentId)
    );
  }, []);

  return {
    items,
    isLoading,
    error,
    refresh,
    cancelById,
  };
}

export default usePatientAppointments;
