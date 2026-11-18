import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/ui/atoms/Button';
import Input from '../../shared/ui/atoms/Input';
import { MailIcon, ShieldCheckIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import PasswordInput from '../../shared/ui/molecules/PasswordInput';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import AuthPageTemplate from '../components/AuthPageTemplate';
import useAuth from '../hook/useAuth';
import { adminPasswordRules, emailRules } from '../helpers/validationRules';

const LOGIN_ERROR_MESSAGES = {
  401: 'Email o contraseña incorrectos.',
  AUTHENTICATION_FAILED: 'Email o contraseña incorrectos.',
  AUTHORIZATION_FAILED: 'Esta cuenta no tiene acceso al portal administrativo.',
};

function AdminLoginPage() {
  const [submitError, setSubmitError] = useState('');
  const { signinAdmin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  // La redirección tras el login la resuelve GuestRoute al detectar la sesión.
  const onValid = async (formData) => {
    setSubmitError('');

    try {
      await signinAdmin(formData);
    } catch (error) {
      setSubmitError(getErrorMessage(error, LOGIN_ERROR_MESSAGES));
    }
  };

  return (
    <AuthPageTemplate
      title="Bienvenido de nuevo"
      subtitle="Por favor, autentíquese para acceder al portal de proveedores."
      switchLink={{ to: '/login', label: '← Volver al Portal de Pacientes' }}
      aside={
        <aside className="bg-med-primary-50 border-t border-med-primary-100 p-4 sm:p-5 flex items-start gap-3">
          <ShieldCheckIcon className="w-5 h-5 text-med-primary-600 shrink-0 mt-0.5" />
          <p className="text-xs text-med-text-sub leading-relaxed">
            <strong className="text-med-text-main font-semibold">
              Solo Acceso Seguro:
            </strong>{' '}
            Este sistema es para personal médico autorizado. Los intentos de
            acceso no autorizados son registrados y monitoreados para su
            cumplimiento.
          </p>
        </aside>
      }
    >
      <form noValidate onSubmit={handleSubmit(onValid)}>
        <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
          <legend className="sr-only">Credenciales de administrador</legend>

          <Input
            label="Correo Electrónico"
            type="email"
            autoComplete="username"
            placeholder="admin@system.com"
            leftIcon={<MailIcon />}
            error={errors.email?.message}
            {...register('email', emailRules)}
          />

          <PasswordInput
            label="Contraseña"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', adminPasswordRules)}
          />

          {submitError && <AlertBanner>{submitError}</AlertBanner>}

          <Button
            type="submit"
            className="mt-2 w-full"
            isLoading={isSubmitting}
          >
            Iniciar Sesión →
          </Button>

          {import.meta.env.DEV && (
            <AlertBanner variant="info" className="justify-center text-center">
              <span className="font-semibold">Credenciales de prueba:</span>
              <br />
              Email: <code>admin@system.com</code> | Clave:{' '}
              <code>Admin123!</code>
            </AlertBanner>
          )}
        </fieldset>
      </form>
    </AuthPageTemplate>
  );
}

export default AdminLoginPage;
