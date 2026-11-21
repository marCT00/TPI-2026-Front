function SpecialityStatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
      Activo
    </span>
  ) : (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
      Inactivo
    </span>
  );
}

export default SpecialityStatusBadge;
