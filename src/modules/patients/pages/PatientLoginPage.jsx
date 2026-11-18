import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/ui/atoms/Button';
import Input from '../../shared/ui/atoms/Input';
import { IdCardIcon, MailIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import AuthPageTemplate from '../../auth/components/AuthPageTemplate';
import useAuth from '../../auth/hook/useAuth';
import { dniRules, emailRules } from '../../auth/helpers/validationRules';

const LOGIN_ERROR_MESSAGES = {
  401: 'El email y el DNI no coinciden con un paciente registrado.',
  AUTHENTICATION_FAILED:
    'El email y el DNI no coinciden con un paciente registrado.',
  REGISTER_USER_CONFLICT: 'Ese DNI ya está asociado a otro correo electrónico.',
  AUTHORIZATION_FAILED: 'Esta cuenta no tiene acceso al portal de pacientes.',
};

function PatientLoginPage() {
  const [submitError, setSubmitError] = useState('');
  const { signinPatient } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', dni: '' },
    mode: 'onTouched',
  });

  const dniField = register('dni', dniRules);

  // Deja solo dígitos mientras se escribe (sin puntos ni espacios).
  const handleDniChange = (event) => {
    event.target.value = event.target.value.replace(/\D/g, '');
    dniField.onChange(event);
  };

  // La redirección tras el login la resuelve GuestRoute al detectar la sesión.
  const onValid = async (formData) => {
    setSubmitError('');

    try {
      await signinPatient(formData);
    } catch (error) {
      setSubmitError(getErrorMessage(error, LOGIN_ERROR_MESSAGES));
    }
  };

  return (
    <AuthPageTemplate
      title="Portal del Paciente"
      subtitle="Inicia sesión para reservar y consultar tus turnos médicos"
      switchLink={{
        to: '/admin/login',
        label: '¿Es personal administrativo o médico? Ingrese aquí →',
      }}
    >
      <form noValidate onSubmit={handleSubmit(onValid)}>
        <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
          <legend className="sr-only">Datos del paciente</legend>

          <Input
            label="Correo Electrónico"
            type="email"
            autoComplete="email"
            placeholder="paciente@correo.com"
            leftIcon={<MailIcon />}
            error={errors.email?.message}
            {...register('email', emailRules)}
          />

          <Input
            label="DNI / Número de Identificación"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={8}
            placeholder="Ej: 35123456"
            hint="7 u 8 dígitos, sin puntos."
            leftIcon={<IdCardIcon />}
            error={errors.dni?.message}
            {...dniField}
            onChange={handleDniChange}
          />

          {submitError && <AlertBanner>{submitError}</AlertBanner>}

          <Button
            type="submit"
            className="w-full mt-1"
            isLoading={isSubmitting}
          >
            Ingresar Paciente
          </Button>

          <AlertBanner variant="info" className="text-center">
            Si es tu primer ingreso, tu cuenta se crea automáticamente con tu
            correo y DNI.
          </AlertBanner>
        </fieldset>
      </form>
    </AuthPageTemplate>
  );
}

export default PatientLoginPage;
