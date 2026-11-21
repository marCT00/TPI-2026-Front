import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/ui/atoms/Button';
import Input from '../../shared/ui/atoms/Input';
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import { emailRules } from '../helpers/validationRules';

const DEFAULT_TOGGLE_LABELS = {
  show: 'Mostrar contraseña',
  hide: 'Ocultar contraseña',
};

// Organismo de formulario de autenticación reutilizable para Admin y Paciente (OCP).
function LoginForm({
  legend = 'Credenciales de acceso',
  emailPlaceholder = 'correo@ejemplo.com',
  emailAutoComplete = 'email',
  secretField,
  submitLabel = 'Iniciar Sesión',
  errorMessages = {},
  onSubmit,
  footer = null,
}) {
  const {
    name: secretName = 'password',
    label: secretLabel = 'Contraseña',
    placeholder: secretPlaceholder = '••••••••',
    hint: secretHint = '',
    autoComplete: secretAutoComplete = 'current-password',
    inputMode: secretInputMode,
    maxLength: secretMaxLength,
    leftIcon: secretLeftIcon = <LockIcon />,
    toggleLabels = DEFAULT_TOGGLE_LABELS,
    rules: secretRules = {},
    numericOnly = false,
  } = secretField ?? {};

  const [submitError, setSubmitError] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', [secretName]: '' },
    mode: 'onTouched',
  });

  const secretRegistration = register(secretName, secretRules);
  const toggleLabel = showSecret ? toggleLabels.hide : toggleLabels.show;

  const handleSecretChange = (event) => {
    if (numericOnly) {
      event.target.value = event.target.value.replace(/\D/g, '');
    }

    secretRegistration.onChange(event);
  };

  const onValid = async (formData) => {
    setSubmitError('');

    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(getErrorMessage(error, errorMessages));
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onValid)}>
      <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
        <legend className="sr-only">{legend}</legend>

        <Input
          label="Correo Electrónico"
          type="email"
          autoComplete={emailAutoComplete}
          placeholder={emailPlaceholder}
          leftIcon={<MailIcon />}
          error={errors.email?.message}
          {...register('email', emailRules)}
        />

        <Input
          label={secretLabel}
          type={showSecret ? 'text' : 'password'}
          inputMode={secretInputMode}
          autoComplete={secretAutoComplete}
          maxLength={secretMaxLength}
          placeholder={secretPlaceholder}
          hint={secretHint}
          leftIcon={secretLeftIcon}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowSecret((current) => !current)}
              aria-label={toggleLabel}
              title={toggleLabel}
              className="text-med-text-muted hover:text-med-text-main"
            >
              {showSecret ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          error={errors[secretName]?.message}
          {...secretRegistration}
          onChange={handleSecretChange}
        />

        {submitError && <AlertBanner>{submitError}</AlertBanner>}

        <Button type="submit" className="w-full mt-1" isLoading={isSubmitting}>
          {submitLabel}
        </Button>

        {footer}
      </fieldset>
    </form>
  );
}

export default LoginForm;
