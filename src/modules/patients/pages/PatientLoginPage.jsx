import { IdCardIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import AuthPageTemplate from '../../auth/components/AuthPageTemplate';
import LoginForm from '../../auth/components/LoginForm';
import useAuth from '../../auth/hook/useAuth';
import { dniRules } from '../../auth/helpers/validationRules';

const LOGIN_ERROR_MESSAGES = {
  401: 'El email y el DNI no coinciden con un paciente registrado.',
  AUTHENTICATION_FAILED:
    'El email y el DNI no coinciden con un paciente registrado.',
  REGISTER_USER_CONFLICT: 'Ese DNI ya está asociado a otro correo electrónico.',
  AUTHORIZATION_FAILED: 'Esta cuenta no tiene acceso al portal de pacientes.',
};

const SECRET_FIELD = {
  name: 'dni',
  label: 'DNI / Número de Identificación',
  placeholder: 'Ej: 35123456',
  hint: '7 u 8 dígitos, sin puntos.',
  autoComplete: 'off',
  inputMode: 'numeric',
  maxLength: 8,
  leftIcon: <IdCardIcon />,
  toggleLabels: {
    show: 'Mostrar DNI',
    hide: 'Ocultar DNI',
  },
  rules: dniRules,
  numericOnly: true,
};

function PatientLoginPage() {
  const { signinPatient } = useAuth();

  return (
    <AuthPageTemplate
      title="Portal del Paciente"
      subtitle="Inicia sesión para reservar y consultar tus turnos médicos"
      switchLink={{
        to: '/admin/login',
        label: '¿Es personal administrativo o médico? Ingrese aquí →',
      }}
    >
      <LoginForm
        legend="Datos del paciente"
        emailPlaceholder="paciente@correo.com"
        emailAutoComplete="email"
        secretField={SECRET_FIELD}
        submitLabel="Ingresar Paciente"
        errorMessages={LOGIN_ERROR_MESSAGES}
        onSubmit={signinPatient}
        footer={
          <AlertBanner variant="info" className="text-center">
            Si es tu primer ingreso, tu cuenta se crea automáticamente con tu
            correo y DNI.
          </AlertBanner>
        }
      />
    </AuthPageTemplate>
  );
}

export default PatientLoginPage;
