import { useEffect, useState } from 'react';

// Devuelve el valor recién cuando dejó de cambiar durante "delay" ms.
// Evita disparar una petición al backend por cada tecla.
const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebouncedValue;
