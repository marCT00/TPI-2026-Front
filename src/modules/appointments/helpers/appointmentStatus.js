// El backend serializa el enum DateState como número (0..3). Se aceptan
// también los nombres por si en algún momento se envían como texto.
const STATUS_BY_CODE = {
  0: 'BOOKED',
  1: 'CANCELLED',
  2: 'ATTENDED',
  3: 'NO_SHOW',
};

const STATUS_INFO = {
  BOOKED: {
    label: 'Confirmado',
    className: 'bg-med-active-bg text-med-active-text',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-med-danger-bg text-med-danger-text',
  },
  ATTENDED: {
    label: 'Completado',
    className: 'bg-gray-100 text-med-text-sub',
  },
  NO_SHOW: {
    label: 'Ausente',
    className: 'bg-amber-50 text-amber-700',
  },
};

const UNKNOWN_STATUS = {
  label: 'Sin estado',
  className: 'bg-gray-100 text-med-text-muted',
};

const getStatusInfo = (status) => {
  const key = STATUS_BY_CODE[status] ?? String(status ?? '').toUpperCase();

  return STATUS_INFO[key] ?? UNKNOWN_STATUS;
};

export { getStatusInfo };
