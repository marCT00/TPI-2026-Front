import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../../shared/ui/atoms/Card';
import Spinner from '../../shared/ui/atoms/Spinner';
import { PencilIcon, UserPlusIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import useToast from '../../shared/ui/organisms/toast/useToast';
import {
  getApiError,
  getErrorMessage,
} from '../../shared/api/parseBackendError';
import DoctorForm from '../components/DoctorForm';
import useDoctorForm from '../hooks/useDoctorForm';
import useSpecialityOptions from '../hooks/useSpecialityOptions';

const LIST_PATH = '/admin/doctors';

// Errores del backend que corresponden a un campo puntual del formulario.
const FIELD_ERRORS = {
  DOCTOR_LICENSE_NUMBER_CONFLICT: [
    'licenseNumber',
    'Ya existe un médico con ese número de licencia.',
  ],
  DOCTOR_INVALID_LICENSE_NUMBER: [
    'licenseNumber',
    'La licencia es obligatoria y no puede superar los 50 caracteres.',
  ],
  DOCTOR_INVALID_NAME: [
    'name',
    'El nombre debe tener entre 3 y 100 caracteres.',
  ],
  ENTITY_NOTFOUND: [
    'specialityId',
    'La especialidad seleccionada ya no está disponible.',
  ],
};

const toFormValues = (doctor) => ({
  name: doctor.name,
  specialityId: doctor.speciality.id ?? '',
  licenseNumber: doctor.licenseNumber,
});

function DoctorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isEdit, doctor, isLoading, loadError, save } = useDoctorForm(id);
  const specialities = useSpecialityOptions();
  const [submitError, setSubmitError] = useState('');

  const notFound = getApiError(loadError)?.status === 404;
  // En edición se espera también a las especialidades, para que el select
  // pueda marcar la del médico.
  const isPreparing = isLoading || (isEdit && specialities.isLoading);

  // Si el médico no existe (o fue dado de baja), vuelve al listado.
  useEffect(() => {
    if (loadError && notFound) {
      showToast({
        variant: 'warning',
        message: 'El médico que intentás editar no existe.',
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
          ? `Se actualizó a "${saved.name}".`
          : `Se registró a "${saved.name}".`,
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
      aria-labelledby="doctor-form-title"
      className="flex flex-col gap-6"
    >
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-2 text-xs text-med-text-muted">
          <li>
            <Link to={LIST_PATH} className="hover:text-med-primary-900">
              Doctores
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li
            aria-current="page"
            className="font-semibold text-med-primary-900"
          >
            {isEdit ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
          </li>
        </ol>
      </nav>

      <Card as="article" className="max-w-4xl p-0 overflow-hidden">
        <header className="p-6 border-b border-med-border bg-med-primary-50/40">
          <h1
            id="doctor-form-title"
            className="flex items-center gap-2 text-xl font-bold text-med-primary-900"
          >
            {isEdit ? (
              <PencilIcon className="w-5 h-5" />
            ) : (
              <UserPlusIcon className="w-5 h-5" />
            )}
            {isEdit ? 'Editar Doctor' : 'Registrar Nuevo Doctor'}
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            {isEdit
              ? 'Modifique el nombre, la especialidad o el número de licencia del profesional.'
              : 'Complete todos los campos obligatorios para integrar al nuevo facultativo al sistema del centro médico.'}
          </p>
        </header>

        <div className="p-6 flex flex-col gap-5">
          {specialities.error && (
            <AlertBanner title="No se pudieron cargar las especialidades">
              {specialities.error}
            </AlertBanner>
          )}

          {isPreparing && (
            <div className="flex justify-center py-10 text-med-primary-900">
              <Spinner size="lg" label="Cargando médico" />
            </div>
          )}

          {!isPreparing && loadError && !notFound && (
            <AlertBanner title="No se pudo cargar el médico">
              {getErrorMessage(loadError)}
            </AlertBanner>
          )}

          {!isPreparing && !loadError && (
            <DoctorForm
              key={doctor?.id ?? 'new'}
              defaultValues={doctor ? toFormValues(doctor) : undefined}
              specialityOptions={specialities.options}
              isLoadingSpecialities={specialities.isLoading}
              submitError={submitError}
              submitLabel={isEdit ? 'Guardar Cambios' : 'Guardar Doctor'}
              onSubmit={handleSubmit}
              onCancel={() => navigate(LIST_PATH)}
            />
          )}
        </div>
      </Card>
    </section>
  );
}

export default DoctorFormPage;
