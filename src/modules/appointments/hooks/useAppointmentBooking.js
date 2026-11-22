import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../../auth/hook/useAuth';
import { getDoctorAvailabilitySlots } from '../../availabilities/services/availabilitiesService';
import { getDoctors } from '../../doctors/services/doctorsService';
import {
  getApiError,
  getErrorMessage,
} from '../../shared/api/parseBackendError';
import { getSpecialities } from '../../specialities/services/specialitiesService';
import {
  addDays,
  buildWeekDays,
  formatWeekRangeLabel,
  getMondayOfWeek,
  groupFutureSlotsByDate,
  parseIsoDate,
  toIsoDate,
} from '../helpers/bookingRules';
import { createAppointment } from '../services/appointmentsService';

const MAX_OPTIONS = 100;

const BOOKING_ERROR_MESSAGES = {
  APPOINTMENT_CONCURRENCY:
    'Este horario acaba de ser reservado por otro paciente. Por favor, seleccioná otro turno disponible.',
  APPOINTMENT_SLOT_UNAVAILABLE:
    'El bloque horario seleccionado ya no está disponible. Elegí otro horario.',
  APPOINTMENT_PAST_DATE:
    'No es posible reservar turnos en fechas u horarios pasados.',
  APPOINTMENT_INVALID_REASON:
    'El motivo de la consulta debe tener entre 5 y 500 caracteres.',
};

function useAppointmentBooking() {
  const { user } = useAuth();
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialityId, setSelectedSpecialityId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [slots, setSlots] = useState([]);
  const [weekMonday, setWeekMonday] = useState(() => getMondayOfWeek());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [catalogError, setCatalogError] = useState('');
  const [slotsError, setSlotsError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [slotsReloadKey, setSlotsReloadKey] = useState(0);

  // 1. Cargar especialidades y médicos activos al montar la vista.
  useEffect(() => {
    const controller = new AbortController();
    const query = { pageSize: MAX_OPTIONS, pageIndex: 1 };
    const options = { signal: controller.signal };

    setIsLoadingCatalog(true);
    setCatalogError('');

    Promise.all([getSpecialities(query, options), getDoctors(query, options)])
      .then(([specialitiesRes, doctorsRes]) => {
        const specItems = specialitiesRes.items;
        const docItems = doctorsRes.items;

        setSpecialities(specItems);
        setDoctors(docItems);

        const initialSpecId = specItems[0]?.id ?? '';
        const matchingDocs = initialSpecId
          ? docItems.filter((doc) => doc.speciality.id === initialSpecId)
          : docItems;
        const initialDocId =
          matchingDocs[0]?.id ?? docItems[0]?.id ?? '';

        setSelectedSpecialityId(
          matchingDocs[0]?.speciality?.id ?? initialSpecId
        );
        setSelectedDoctorId(initialDocId);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setCatalogError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingCatalog(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Médicos filtrados por la especialidad seleccionada (CU01 Paso 2).
  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialityId) {
      return doctors;
    }

    return doctors.filter(
      (doctor) => doctor.speciality.id === selectedSpecialityId
    );
  }, [doctors, selectedSpecialityId]);

  const currentDoctor = useMemo(
    () =>
      doctors.find((doctor) => doctor.id === selectedDoctorId) ??
      filteredDoctors[0] ??
      null,
    [doctors, filteredDoctors, selectedDoctorId]
  );

  // 2. Consultar los slots disponibles del médico seleccionado (CU01 Paso 4).
  useEffect(() => {
    if (!selectedDoctorId) {
      setSlots([]);
      setSelectedSlot(null);

      return undefined;
    }

    const controller = new AbortController();

    setIsLoadingSlots(true);
    setSlotsError('');

    getDoctorAvailabilitySlots(selectedDoctorId, {}, { signal: controller.signal })
      .then((rawSlots) => {
        setSlots(rawSlots);
        const grouped = groupFutureSlotsByDate(rawSlots);
        const availableDates = Object.keys(grouped).sort();

        if (availableDates.length > 0) {
          const firstDate = availableDates[0];
          const firstDateObj = parseIsoDate(firstDate);
          const firstSlot = grouped[firstDate][0];

          if (firstDateObj) {
            setWeekMonday(getMondayOfWeek(firstDateObj));
          }

          setSelectedDate(firstDate);
          setSelectedSlot(firstSlot ?? null);
        } else {
          const currentMonday = getMondayOfWeek();

          setWeekMonday(currentMonday);
          setSelectedDate(toIsoDate(currentMonday));
          setSelectedSlot(null);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setSlots([]);
          setSelectedSlot(null);
          setSlotsError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingSlots(false);
        }
      });

    return () => controller.abort();
  }, [selectedDoctorId, slotsReloadKey]);

  const slotsByDate = useMemo(() => groupFutureSlotsByDate(slots), [slots]);

  const weekDays = useMemo(
    () => buildWeekDays(weekMonday, slotsByDate),
    [weekMonday, slotsByDate]
  );

  const weekRangeLabel = useMemo(
    () => formatWeekRangeLabel(weekDays),
    [weekDays]
  );

  const selectedDayObj = useMemo(
    () =>
      weekDays.find((day) => day.isoDate === selectedDate) ??
      weekDays[0] ??
      null,
    [weekDays, selectedDate]
  );

  const changeSpeciality = useCallback(
    (specialityId) => {
      setSelectedSpecialityId(specialityId);
      setBookingError('');

      const matching = specialityId
        ? doctors.filter((doc) => doc.speciality.id === specialityId)
        : doctors;

      setSelectedDoctorId(matching[0]?.id ?? '');
    },
    [doctors]
  );

  const changeDoctor = useCallback((doctorId) => {
    setSelectedDoctorId(doctorId);
    setBookingError('');
  }, []);

  const searchAvailability = useCallback(() => {
    setBookingError('');
    setSlotsReloadKey((key) => key + 1);
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setWeekMonday((current) => {
      const prev = addDays(current, -7);
      const minMonday = getMondayOfWeek();

      return prev < minMonday ? minMonday : prev;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekMonday((current) => addDays(current, 7));
  }, []);

  const selectDay = useCallback(
    (isoDate) => {
      setSelectedDate(isoDate);
      setBookingError('');
      const daySlots = slotsByDate[isoDate] ?? [];

      setSelectedSlot((current) => {
        if (current && current.date === isoDate) {
          return current;
        }

        return daySlots[0] ?? null;
      });
    },
    [slotsByDate]
  );

  const selectSlot = useCallback((isoDate, slot) => {
    setSelectedDate(isoDate);
    setSelectedSlot(slot);
    setBookingError('');
  }, []);

  // Paso 6 de CU01: Confirmar turno (con manejo del Flujo Alternativo 6: Turno ocupado).
  const confirmBooking = useCallback(
    async ({ reason }) => {
      if (!selectedDoctorId || !selectedSlot?.id) {
        setBookingError('Seleccioná un horario disponible antes de confirmar.');

        return false;
      }

      if (!user?.dni) {
        setBookingError(
          'No se encontró el DNI del paciente en la sesión actual. Volvé a iniciar sesión.'
        );

        return false;
      }

      setBookingError('');

      try {
        const created = await createAppointment({
          doctorId: selectedDoctorId,
          doctorName: currentDoctor?.name,
          specialityId: currentDoctor?.speciality?.id,
          specialityName: currentDoctor?.speciality?.name,
          availabilitySlotId: selectedSlot.id,
          patientDni: user.dni,
          reason,
        });

        setConfirmedBooking({
          id: created.id,
          doctorName: currentDoctor?.name ?? created.doctor.name,
          specialityName:
            currentDoctor?.speciality?.name ?? created.speciality.name,
          licenseNumber: currentDoctor?.licenseNumber ?? '',
          fullDate: selectedDayObj?.fullDate ?? selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          reason: String(reason).trim(),
          patientEmail: user.email,
          patientDni: user.dni,
        });

        setSlotsReloadKey((key) => key + 1);

        return true;
      } catch (error) {
        const apiError = getApiError(error);
        const isConflict =
          apiError.status === 409 ||
          apiError.errorCode === 'APPOINTMENT_CONCURRENCY' ||
          apiError.errorCode === 'APPOINTMENT_SLOT_UNAVAILABLE';

        setBookingError(getErrorMessage(error, BOOKING_ERROR_MESSAGES));

        if (isConflict) {
          setSelectedSlot(null);
          setSlotsReloadKey((key) => key + 1);
        }

        return false;
      }
    },
    [selectedDoctorId, selectedSlot, user, currentDoctor, selectedDayObj]
  );

  const closeConfirmedModal = useCallback(() => {
    setConfirmedBooking(null);
  }, []);

  return {
    user,
    specialities,
    filteredDoctors,
    selectedSpecialityId,
    selectedDoctorId,
    currentDoctor,
    weekDays,
    weekRangeLabel,
    slotsByDate,
    selectedDate,
    selectedDayObj,
    selectedSlot,
    isLoadingCatalog,
    isLoadingSlots,
    catalogError,
    slotsError,
    bookingError,
    confirmedBooking,
    changeSpeciality,
    changeDoctor,
    searchAvailability,
    goToPreviousWeek,
    goToNextWeek,
    selectDay,
    selectSlot,
    confirmBooking,
    closeConfirmedModal,
  };
}

export default useAppointmentBooking;
