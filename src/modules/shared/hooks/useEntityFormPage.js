import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../ui/organisms/toast/useToast';
import { getApiError, getErrorMessage } from '../api/parseBackendError';

// Comportamiento común de las páginas de alta/edición de una entidad (SRP):
// - si la entidad a editar no existe (404), avisa y vuelve al listado;
// - al guardar, muestra el toast de éxito y vuelve al listado;
// - si el backend rechaza un campo puntual, marca ese campo en el formulario;
//   cualquier otro error queda en submitError para mostrarlo arriba.
//
// fieldErrors: { [errorCode]: [campo, mensaje] }
function useEntityFormPage({
  save,
  loadError,
  listPath,
  fieldErrors = {},
  notFoundMessage,
  getSuccessMessage,
}) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitError, setSubmitError] = useState('');

  const notFound = getApiError(loadError)?.status === 404;

  useEffect(() => {
    if (loadError && notFound) {
      showToast({ variant: 'warning', message: notFoundMessage });
      navigate(listPath, { replace: true });
    }
  }, [loadError, notFound, notFoundMessage, listPath, navigate, showToast]);

  const handleSubmit = useCallback(
    async (values, { setFieldError }) => {
      setSubmitError('');

      try {
        const saved = await save(values);

        showToast({ variant: 'success', message: getSuccessMessage(saved) });
        navigate(listPath);
      } catch (error) {
        const fieldError = fieldErrors[getApiError(error).errorCode];

        if (fieldError) {
          setFieldError(...fieldError);

          return;
        }

        setSubmitError(getErrorMessage(error));
      }
    },
    [save, fieldErrors, getSuccessMessage, listPath, navigate, showToast]
  );

  const goToList = useCallback(() => navigate(listPath), [navigate, listPath]);

  return { notFound, submitError, handleSubmit, goToList };
}

export default useEntityFormPage;
