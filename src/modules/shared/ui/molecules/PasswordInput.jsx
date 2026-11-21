import { forwardRef, useState } from 'react';
import Input from '../atoms/Input';
import { EyeIcon, EyeOffIcon, LockIcon } from '../atoms/icons';

const DEFAULT_TOGGLE_LABELS = {
  show: 'Mostrar contraseña',
  hide: 'Ocultar contraseña',
};

const PasswordInput = forwardRef(function PasswordInput(
  {
    toggleLabels = DEFAULT_TOGGLE_LABELS,
    leftIcon = <LockIcon />,
    ...restProps
  },
  ref
) {
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? toggleLabels.hide : toggleLabels.show;

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      leftIcon={leftIcon}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={toggleLabel}
          title={toggleLabel}
          className="text-med-text-muted hover:text-med-text-main"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      {...restProps}
    />
  );
});

export default PasswordInput;
