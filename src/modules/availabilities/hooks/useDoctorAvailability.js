import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getApiError,
  getErrorMessage,
} from '../../shared/api/parseBackendError';
import { getDoctors } from '../../doctors/services/doctorsService';
import {
  buildInitialDaysForm,
  toActiveDaysPayload,
} from '../helpers/availabilityRules';
import {
  createAvailabilities,
  getDoctorAvailabilityRules,
  updateAvailabilities,
} from '../services/availabilitiesService';

const MAX_DOCTORS = 100;

function useDoctorAvailability(initialDoctorId = '') {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [existingRules, setExistingRules] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [doctorsError, setDoctorsError] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // 1. Cargar listado de médicos activos para el selector.
  useEffect(() => {
    const controller = new AbortController();

    setIsLoadingDoctors(true);
    setDoctorsError('');

    getDoctors(
      { pageSize: MAX_DOCTORS, pageIndex: 1 },
      { signal: controller.signal }
    )
      .then((result) => {
        setDoctors(result.items);
        setSelectedDoctorId((currentId) => {
          const matchesInitial = result.items.some(
            (doc) => doc.id === currentId
          );

          if (matchesInitial) {
            return currentId;
          }

          return result.items[0]?.id ?? '';
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setDoctorsError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingDoctors(false);
        }
      });

    return () => controller.abort();
  }, []);

  // 2. Consultar disponibilidad actual del médico seleccionado.
  useEffect(() => {
    if (!selectedDoctorId) {
      setExistingRules([]);

      return undefined;
    }

    const controller = new AbortController();
    const currentMonth = new Date().getMonth() + 1;

    setIsLoadingSchedule(true);
    setScheduleError('');

    getDoctorAvailabilityRules(
      selectedDoctorId,
      { month: currentMonth },
      { signal: controller.signal }
    )
      .then((rules) => {
        setExistingRules(rules);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setExistingRules([]);
          setScheduleError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingSchedule(false);
        }
      });

    return () => controller.abort();
  }, [selectedDoctorId, reloadKey]);

  const selectedDoctor = useMemo(
    () => doctors.find((doc) => doc.id === selectedDoctorId) ?? null,
    [doctors, selectedDoctorId]
  );

  const initialDays = useMemo(
    () => buildInitialDaysForm(existingRules),
    [existingRules]
  );

  const hasExistingAvailability = existingRules.length > 0;

  const refreshSchedule = useCallback(
    () => setReloadKey((current) => current + 1),
    []
  );

  const saveAvailability = useCallback(
    async (daysFormValues) => {
      const currentMonth = new Date().getMonth() + 1;
      const daysPayload = toActiveDaysPayload(daysFormValues);
      const requestPayload = {
        doctorId: selectedDoctorId,
        month: currentMonth,
        days: daysPayload,
      };

      if (hasExistingAvailability) {
        await updateAvailabilities(requestPayload);
      } else {
        try {
          await createAvailabilities(requestPayload);
        } catch (error) {
          // Si ya existían reglas en el mes actual, se sobreescribe con PUT.
          if (getApiError(error).errorCode === 'AVAILABILITY_OVERLAP') {
            await updateAvailabilities(requestPayload);
          } else {
            throw error;
          }
        }
      }

      refreshSchedule();
    },
    [selectedDoctorId, hasExistingAvailability, refreshSchedule]
  );

  return {
    doctors,
    selectedDoctor,
    selectedDoctorId,
    selectDoctor: setSelectedDoctorId,
    initialDays,
    hasExistingAvailability,
    isLoadingDoctors,
    isLoadingSchedule,
    doctorsError,
    scheduleError,
    refreshSchedule,
    saveAvailability,
  };
}

export default useDoctorAvailability;
