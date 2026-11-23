import { useCallback, useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';

const INITIAL_STATS = {
  activeDoctors: 0,
  doctorsAddedThisMonth: 0,
  activeSpecialities: 0,
  todayAppointments: 0,
};

function useDashboardStats() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);

    getDashboardStats({ signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setStats(result);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStats(INITIAL_STATS);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [reloadKey]);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  return { stats, isLoading, refresh };
}

export default useDashboardStats;
