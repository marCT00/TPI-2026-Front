import { useNavigate } from 'react-router-dom';
import useDoctorsList from '../../doctors/hooks/useDoctorsList';
import Button from '../../shared/ui/atoms/Button';
import Card from '../../shared/ui/atoms/Card';
import { PlusIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import SearchInput from '../../shared/ui/molecules/SearchInput';
import TablePagination from '../../shared/ui/molecules/TablePagination';
import DirectoryDoctorsTable from '../components/DirectoryDoctorsTable';
import KpiStatCard from '../components/KpiStatCard';
import { formatMonthlyAddedBadge } from '../helpers/dashboardMetrics';
import useDashboardStats from '../hooks/useDashboardStats';

function OverviewPage() {
  const navigate = useNavigate();
  const { stats, isLoading: isLoadingStats } = useDashboardStats();
  const list = useDoctorsList();

  const searchHint = list.isSearchTooShort
    ? `Escribí al menos ${list.minSearchLength} caracteres para filtrar.`
    : '';
  const emptyMessage = list.isFiltered
    ? 'No se encontraron médicos con ese nombre.'
    : 'Todavía no hay médicos registrados.';

  return (
    <section aria-labelledby="overview-title" className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            id="overview-title"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main"
          >
            Vista General de Gestión
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Configure el personal médico y las especialidades del departamento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => navigate('/admin/doctors/new')}>
            <PlusIcon />
            Agregar Nuevo Doctor
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/admin/specialities/new')}
          >
            <PlusIcon />
            Agregar Nueva Especialidad
          </Button>
        </div>
      </header>

      <section
        aria-label="Indicadores generales"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        <KpiStatCard
          label="Doctores Activos"
          value={stats.activeDoctors}
          isLoading={isLoadingStats}
          badgeText={
            isLoadingStats
              ? '...'
              : formatMonthlyAddedBadge(stats.doctorsAddedThisMonth)
          }
          badgeVariant="active"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
        />

        <KpiStatCard
          label="Especialidades Activas"
          value={stats.activeSpecialities}
          isLoading={isLoadingStats}
          badgeText="Estable"
          badgeVariant="neutral"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          }
        />

        <KpiStatCard
          label="Turnos Confirmados Para Hoy"
          value={stats.todayAppointments}
          isLoading={isLoadingStats}
          badgeText="Hoy"
          badgeVariant="primary"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
      </section>

      {list.error && (
        <AlertBanner title="No se pudo cargar el directorio de profesionales">
          {list.error}{' '}
          <button
            type="button"
            onClick={list.refresh}
            className="font-semibold underline"
          >
            Reintentar
          </button>
        </AlertBanner>
      )}

      <Card as="article" className="p-0 overflow-hidden">
        <header className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900 sm:pt-2">
            Directorio de Profesionales Médicos
          </h2>
          <SearchInput
            className="w-full sm:w-72"
            label="Buscar profesional por nombre"
            placeholder="Buscar por nombre..."
            value={list.searchTerm}
            hint={searchHint}
            onChange={list.changeSearch}
          />
        </header>

        <DirectoryDoctorsTable
          items={list.items}
          isLoading={list.isLoading}
          emptyMessage={emptyMessage}
          onViewDetail={() => navigate('/admin/doctors')}
        />

        <TablePagination
          currentPage={list.page}
          totalPages={list.totalPages}
          totalItems={list.total}
          pageSize={list.pageSize}
          onPageChange={list.setPage}
        />
      </Card>
    </section>
  );
}

export default OverviewPage;
