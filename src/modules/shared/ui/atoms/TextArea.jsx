import { forwardRef, useId } from 'react';

// Igual que Input: compatible con {...register()} de react-hook-form (LSP).
// "counter" es un texto opcional, por ejemplo "45/100".
const TextArea = forwardRef(function TextArea(
  {
    label,
    error = '',
    hint = '',
    counter = '',
    id,
    className = '',
    ...restProps
  },
  ref
) {
  const generatedId = useId();
  const textAreaId = id || generatedId;
  const hintId = `${textAreaId}-hint`;
  const errorId = `${textAreaId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={textAreaId}
          className="text-xs font-semibold text-med-text-main"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textAreaId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`w-full min-h-28 border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition resize-y focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent disabled:bg-gray-50 ${
          error ? 'border-red-400 bg-red-50/20' : 'border-med-border'
        } ${className}`}
        {...restProps}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
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
        {counter && (
          <span
            aria-hidden="true"
            className="shrink-0 text-[11px] text-med-text-muted tabular-nums"
          >
            {counter}
          </span>
        )}
      </div>
    </div>
  );
});

export default TextArea;
