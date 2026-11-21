import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../../shared/ui/atoms/Card';
import Spinner from '../../shared/ui/atoms/Spinner';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import useToast from '../../shared/ui/organisms/toast/useToast';
import {
  getApiError,
  getErrorMessage,
} from '../../shared/api/parseBackendError';
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

function SpecialityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isEdit, speciality, isLoading, loadError, save } =
    useSpecialityForm(id);
  const [submitError, setSubmitError] = useState('');

  const title = isEdit ? 'Editar Especialidad' : 'Registrar Nueva Especialidad';
  const notFound = getApiError(loadError)?.status === 404;

  // Si la especialidad no existe (o fue dada de baja), vuelve al listado.
  useEffect(() => {
    if (loadError && notFound) {
      showToast({
        variant: 'warning',
        message: 'La especialidad que intentás editar no existe.',
      });
      navigate(LIST_PATH, { replace: true });
    }
  }, [loadError, notFound, navigate, showToast]);

  const handleSubmit = async (values, { setFieldError }) => {
    setSubmitError('');

    try {
      const saved = await save(values);

      showToast({
        variant: 'success',
        message: isEdit
          ? `Se actualizó la especialidad "${saved.name}".`
          : `Se creó la especialidad "${saved.name}".`,
      });
      navigate(LIST_PATH);
    } catch (error) {
      const fieldError = FIELD_ERRORS[getApiError(error).errorCode];

      if (fieldError) {
        setFieldError(...fieldError);

        return;
      }

      setSubmitError(getErrorMessage(error));
    }
  };

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
            defaultValues={
              speciality
                ? {
                    name: speciality.name,
                    description: speciality.description,
                  }
                : undefined
            }
            isActive={speciality?.isActive ?? true}
            submitError={submitError}
            submitLabel={isEdit ? 'Guardar Cambios' : 'Guardar Especialidad'}
            onSubmit={handleSubmit}
            onCancel={() => navigate(LIST_PATH)}
          />
        )}
      </Card>
    </section>
  );
}

export default SpecialityFormPage;
