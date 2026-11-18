import { forwardRef, useState } from 'react';
import Input from '../atoms/Input';
import { EyeIcon, EyeOffIcon, LockIcon } from '../atoms/icons';

const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? 'Ocultar contraseña' : 'Mostrar contraseña';

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      leftIcon={<LockIcon />}
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
      {...props}
    />
  );
});

export default PasswordInput;
