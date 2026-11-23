import { instance } from '../../shared/api/axiosInstance';

const DASHBOARD_STATS_ENDPOINT = 'api/dashboard/stats';

// GET /api/dashboard/stats
const getDashboardStats = async ({ signal } = {}) => {
  const { data } = await instance.get(DASHBOARD_STATS_ENDPOINT, { signal });

  return {
    activeDoctors: data?.activeDoctors ?? 0,
    doctorsAddedThisMonth: data?.doctorsAddedThisMonth ?? 0,
    activeSpecialities: data?.activeSpecialities ?? 0,
    todayAppointments: data?.todayConfirmedAppointments ?? 0,
  };
};

export { getDashboardStats };
