import { useCallback, useEffect, useState } from 'react';
import { searchAppointments } from '../../appointments/services/appointmentsService';
import { getDoctors } from '../../doctors/services/doctorsService';
import { getSpecialities } from '../../specialities/services/specialitiesService';

// Fecha actual en formato local YYYY-MM-DD (sin desfase UTC).
const getTodayIsoDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const isConfirmedStatus = (status) =>
  status === 0 || String(status ?? '').toUpperCase() === 'BOOKED';

function useDashboardStats() {
  const [stats, setStats] = useState({
    activeDoctors: 0,
    activeSpecialities: 0,
    todayAppointments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const today = getTodayIsoDate();

    setIsLoading(true);

    Promise.allSettled([
      getDoctors({ pageSize: 1, pageIndex: 1 }, options),
      getSpecialities({ pageSize: 1, pageIndex: 1 }, options),
      searchAppointments(
        { pageSize: 50, pageIndex: 1, filters: { date: today } },
        options
      ),
    ]).then(([doctorsRes, specialitiesRes, appointmentsRes]) => {
      if (controller.signal.aborted) {
        return;
      }

      const activeDoctors =
        doctorsRes.status === 'fulfilled' ? doctorsRes.value.total : 0;
      const activeSpecialities =
        specialitiesRes.status === 'fulfilled'
          ? specialitiesRes.value.total
          : 0;

      let todayAppointments = 0;

      if (appointmentsRes.status === 'fulfilled') {
        const items = appointmentsRes.value.items ?? [];
        const confirmedCount = items.filter((item) =>
          isConfirmedStatus(item.status)
        ).length;

        todayAppointments =
          items.length > 0 ? confirmedCount : appointmentsRes.value.total;
      }

      setStats({ activeDoctors, activeSpecialities, todayAppointments });
      setIsLoading(false);
    });

    return () => controller.abort();
  }, [reloadKey]);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  return { stats, isLoading, refresh };
}

export default useDashboardStats;
