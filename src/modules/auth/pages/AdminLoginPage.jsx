import { LockIcon, ShieldCheckIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import AuthPageTemplate from '../components/AuthPageTemplate';
import LoginForm from '../components/LoginForm';
import useAuth from '../hook/useAuth';
import { adminPasswordRules } from '../helpers/validationRules';

const LOGIN_ERROR_MESSAGES = {
  401: 'Email o contraseña incorrectos.',
  AUTHENTICATION_FAILED: 'Email o contraseña incorrectos.',
  AUTHORIZATION_FAILED: 'Esta cuenta no tiene acceso al portal administrativo.',
};

const SECRET_FIELD = {
  name: 'password',
  label: 'Contraseña',
  placeholder: '••••••••',
  autoComplete: 'current-password',
  leftIcon: <LockIcon />,
  toggleLabels: {
    show: 'Mostrar contraseña',
    hide: 'Ocultar contraseña',
  },
  rules: adminPasswordRules,
};

function AdminLoginPage() {
  const { signinAdmin } = useAuth();

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
      <LoginForm
        legend="Credenciales de administrador"
        emailPlaceholder="admin@system.com"
        emailAutoComplete="username"
        secretField={SECRET_FIELD}
        submitLabel="Iniciar Sesión →"
        errorMessages={LOGIN_ERROR_MESSAGES}
        onSubmit={signinAdmin}
        footer={
          import.meta.env.DEV && (
            <AlertBanner variant="info" className="justify-center text-center">
              <span className="font-semibold">Credenciales de prueba:</span>
              <br />
              Email: <code>admin@system.com</code> | Clave:{' '}
              <code>Admin123!</code>
            </AlertBanner>
          )
        }
      />
    </AuthPageTemplate>
  );
}

export default AdminLoginPage;
