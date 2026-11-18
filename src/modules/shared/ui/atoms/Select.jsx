import { forwardRef, useId } from 'react';
import { ChevronDownIcon } from './icons';

// Igual que Input: con forwardRef se puede usar {...register('campo')}.
// options: [{ value, label }]
const Select = forwardRef(function Select(
  {
    label,
    options = [],
    placeholder = '',
    error = '',
    hint = '',
    leftIcon = null,
    id,
    className = '',
    ...restProps
  },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={selectId}
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
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`w-full appearance-none border rounded-lg py-2.5 pr-10 text-sm bg-white text-med-text-main transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent disabled:bg-gray-50 disabled:text-med-text-muted ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${error ? 'border-red-400 bg-red-50/20' : 'border-med-border'} ${className}`}
          {...restProps}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-med-text-muted"
        >
          <ChevronDownIcon />
        </span>
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

export default Select;
