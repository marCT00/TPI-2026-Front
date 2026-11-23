import { Link, useParams } from 'react-router-dom';
import Card from '../../shared/ui/atoms/Card';
import Spinner from '../../shared/ui/atoms/Spinner';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import useEntityFormPage from '../../shared/hooks/useEntityFormPage';
import SpecialityForm from '../components/SpecialityForm';
import useSpecialityForm from '../hooks/useSpecialityForm';

const LIST_PATH = '/admin/specialities';

// Errores del backend que corresponden a un campo puntual del formulario.
const FIELD_ERRORS = {
  SPECIALITY_NAME_CONFLICT: [
    'name',
    'Ya existe una especialidad con ese nombre.',
  ],
  SPECIALITY_INVALID_NAME: [
    'name',
    'El nombre debe tener entre 3 y 100 caracteres.',
  ],
  SPECIALITY_INVALID_DESCRIPTION: [
    'description',
    'La descripción debe tener entre 10 y 100 caracteres.',
  ],
};

const toFormValues = (speciality) => ({
  name: speciality.name,
  description: speciality.description,
  isActive: String(speciality.isActive),
});

function SpecialityFormPage() {
  const { id } = useParams();
  const { isEdit, speciality, isLoading, loadError, save } =
    useSpecialityForm(id);
  const { notFound, submitError, handleSubmit, goToList } = useEntityFormPage({
    save,
    loadError,
    listPath: LIST_PATH,
    fieldErrors: FIELD_ERRORS,
    notFoundMessage: 'La especialidad que intentás editar no existe.',
    getSuccessMessage: (saved) =>
      isEdit
        ? `Se actualizó la especialidad "${saved.name}".`
        : `Se creó la especialidad "${saved.name}".`,
  });

  const title = isEdit ? 'Editar Especialidad' : 'Registrar Nueva Especialidad';

  return (
    <section
      aria-labelledby="speciality-form-title"
      className="flex flex-col gap-6"
    >
      <header>
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-xs text-med-text-muted">
            <li>
              <Link to={LIST_PATH} className="hover:text-med-primary-900">
                Especialidades
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-med-text-sub">
              {isEdit ? 'Editar Especialidad' : 'Agregar Nueva Especialidad'}
            </li>
          </ol>
        </nav>
        <h1
          id="speciality-form-title"
          className="mt-2 text-2xl font-bold tracking-tight text-med-text-main"
        >
          {title}
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          {isEdit
            ? 'Modifique el nombre o la descripción de la especialidad médica.'
            : 'Complete la información técnica y administrativa para dar de alta una especialidad médica en el sistema hospitalario.'}
        </p>
      </header>

      <Card as="article" className="max-w-3xl p-6">
        {isLoading && (
          <div className="flex justify-center py-10 text-med-primary-900">
            <Spinner size="lg" label="Cargando especialidad" />
          </div>
        )}

        {!isLoading && loadError && !notFound && (
          <AlertBanner title="No se pudo cargar la especialidad">
            {getErrorMessage(loadError)}
          </AlertBanner>
        )}

        {!isLoading && !loadError && (
          <SpecialityForm
            key={speciality?.id ?? 'new'}
            defaultValues={speciality ? toFormValues(speciality) : undefined}
            submitError={submitError}
            submitLabel={isEdit ? 'Guardar Cambios' : 'Guardar Especialidad'}
            onSubmit={handleSubmit}
            onCancel={goToList}
          />
        )}
      </Card>
    </section>
  );
}

export default SpecialityFormPage;
