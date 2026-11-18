// Nombre a mostrar: fullName si el backend lo provee, si no el email.
const getDisplayName = (user) => user?.fullName || user?.email || 'Usuario';

const getInitials = (user) => {
  const source = user?.fullName || user?.email?.split('@')[0] || '';
  const words = source.split(/[\s._-]+/).filter(Boolean);
  const initials =
    words.length > 1 ? words[0][0] + words[1][0] : source.slice(0, 2);

  return initials.toUpperCase() || '?';
};

export { getDisplayName, getInitials };
