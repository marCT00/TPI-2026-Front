import { useId } from 'react';
import Input from '../atoms/Input';
import { CloseIcon, SearchIcon } from '../atoms/icons';

// Buscador controlado reutilizable (Especialidades, Doctores, etc.).
function SearchInput({
  value,
  onChange,
  label = 'Buscar',
  placeholder = 'Buscar...',
  hint = '',
  className = '',
}) {
  const inputId = useId();

  return (
    <div role="search" className={className}>
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <Input
        id={inputId}
        type="search"
        value={value}
        placeholder={placeholder}
        hint={hint}
        leftIcon={<SearchIcon />}
        onChange={(event) => onChange(event.target.value)}
        rightSlot={
          value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Limpiar búsqueda"
              className="text-med-text-muted hover:text-med-text-main"
            >
              <CloseIcon />
            </button>
          ) : null
        }
      />
    </div>
  );
}

export default SearchInput;
