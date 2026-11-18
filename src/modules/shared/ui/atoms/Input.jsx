import { forwardRef, useId } from 'react';

// forwardRef permite usar {...register('campo')} de react-hook-form igual que
// con un <input> nativo (LSP).
const Input = forwardRef(function Input(
  {
    label,
    error = '',
    hint = '',
    leftIcon = null,
    rightSlot = null,
    id,
    className = '',
    ...restProps
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-med-text-main"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-med-text-muted"
          >
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`w-full border rounded-lg py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent disabled:bg-gray-50 ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightSlot ? 'pr-10' : 'pr-3.5'} ${
            error ? 'border-red-400 bg-red-50/20' : 'border-med-border'
          } ${className}`}
          {...restProps}
        />
        {rightSlot && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </span>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-med-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-500 font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
