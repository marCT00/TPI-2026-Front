import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/ui/atoms/Button';
import Card from '../../shared/ui/atoms/Card';
import { PlusIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import SearchInput from '../../shared/ui/molecules/SearchInput';
import TablePagination from '../../shared/ui/molecules/TablePagination';
import ConfirmModal from '../../shared/ui/organisms/ConfirmModal';
import useToast from '../../shared/ui/organisms/toast/useToast';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import SpecialtiesTable from '../components/SpecialtiesTable';
import useSpecialtiesList from '../hooks/useSpecialtiesList';
import { deleteSpecialty } from '../services/specialtiesService';

function SpecialtiesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const list = useSpecialtiesList();
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchHint = list.isSearchTooShort
    ? `Escribí al menos ${list.minSearchLength} caracteres para filtrar.`
    : '';
  const emptyMessage = list.isFiltered
    ? 'No se encontraron especialidades con ese nombre.'
    : 'Todavía no hay especialidades registradas.';

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteSpecialty(toDelete.id);
      showToast({
        variant: 'success',
        message: `La especialidad "${toDelete.name}" fue dada de baja.`,
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
    <section
      aria-labelledby="specialties-title"
      className="flex flex-col gap-6"
    >
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1
            id="specialties-title"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main"
          >
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <SearchInput
            className="sm:w-72"
            label="Buscar especialidad por nombre"
            placeholder="Buscar especialidad..."
            value={list.searchTerm}
            hint={searchHint}
            onChange={list.changeSearch}
          />
          <Button
            className="shrink-0"
            onClick={() => navigate('/admin/specialties/new')}
          >
            <PlusIcon />
            Nueva Especialidad
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
        <SpecialtiesTable
          items={list.items}
          isLoading={list.isLoading}
          emptyMessage={emptyMessage}
          onEdit={(specialty) =>
            navigate(`/admin/specialties/${specialty.id}/edit`)
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

      <footer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-med-primary-900">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-med-text-sub">
            {list.isFiltered ? 'Coincidencias' : 'Total especialidades'}
          </p>
          <p className="mt-1 text-2xl font-bold text-med-primary-900">
            {list.isLoading ? '—' : list.total}
          </p>
          <p className="text-xs text-med-text-muted">
            {list.isFiltered
              ? 'Según la búsqueda actual'
              : 'Activas en el sistema'}
          </p>
        </Card>
      </footer>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="¿Dar de baja la especialidad?"
        message={
          toDelete
            ? `"${toDelete.name}" dejará de estar disponible para asignar médicos y reservar turnos.`
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

export default SpecialtiesPage;
