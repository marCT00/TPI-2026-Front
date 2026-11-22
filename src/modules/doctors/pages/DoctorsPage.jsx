import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/ui/atoms/Button';
import Card from '../../shared/ui/atoms/Card';
import { ClockIcon, PlusIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import SearchInput from '../../shared/ui/molecules/SearchInput';
import TablePagination from '../../shared/ui/molecules/TablePagination';
import ConfirmModal from '../../shared/ui/organisms/ConfirmModal';
import useToast from '../../shared/ui/organisms/toast/useToast';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import DoctorsTable from '../components/DoctorsTable';
import useDoctorsList from '../hooks/useDoctorsList';
import { deleteDoctor } from '../services/doctorsService';

function DoctorsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const list = useDoctorsList();
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchHint = list.isSearchTooShort
    ? `Escribí al menos ${list.minSearchLength} caracteres para filtrar.`
    : '';
  const emptyMessage = list.isFiltered
    ? 'No se encontraron médicos con ese nombre.'
    : 'Todavía no hay médicos registrados.';

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteDoctor(toDelete.id);
      showToast({
        variant: 'success',
        message: `Se dio de baja a "${toDelete.name}".`,
      });
      setToDelete(null);
      list.refreshAfterDelete();
    } catch (error) {
      showToast({ variant: 'error', message: getErrorMessage(error) });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section aria-labelledby="doctors-title" className="flex flex-col gap-6">
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1
            id="doctors-title"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main"
          >
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <SearchInput
            className="sm:w-72"
            label="Buscar doctor por nombre"
            placeholder="Buscar doctor por nombre..."
            value={list.searchTerm}
            hint={searchHint}
            onChange={list.changeSearch}
          />
          <Button
            variant="secondary"
            className="shrink-0"
            onClick={() => navigate('/admin/doctors/availabilities')}
          >
            <ClockIcon />
            Agregar Disponibilidad Horaria
          </Button>
          <Button
            className="shrink-0"
            onClick={() => navigate('/admin/doctors/new')}
          >
            <PlusIcon />
            Nuevo Doctor
          </Button>
        </div>
      </header>

      {list.error && (
        <AlertBanner title="No se pudo cargar el listado">
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
        <header className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </header>
        <DoctorsTable
          items={list.items}
          isLoading={list.isLoading}
          emptyMessage={emptyMessage}
          onEdit={(doctor) => navigate(`/admin/doctors/${doctor.id}/edit`)}
          onManageAvailability={(doctor) =>
            navigate(`/admin/doctors/availabilities?doctorId=${doctor.id}`)
          }
          onDelete={setToDelete}
        />
        <TablePagination
          currentPage={list.page}
          totalPages={list.totalPages}
          totalItems={list.total}
          pageSize={list.pageSize}
          onPageChange={list.setPage}
        />
      </Card>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="¿Dar de baja al médico?"
        message={
          toDelete
            ? `"${toDelete.name}" dejará de aparecer en el directorio y no podrá recibir nuevos turnos.`
            : ''
        }
        confirmLabel="Dar de baja"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}

export default DoctorsPage;
