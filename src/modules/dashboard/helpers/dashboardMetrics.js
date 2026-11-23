const isSameYearMonth = (isoDate, referenceDate = new Date()) => {
  if (!isoDate) {
    return false;
  }

  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return (
    parsed.getFullYear() === referenceDate.getFullYear() &&
    parsed.getMonth() === referenceDate.getMonth()
  );
};

const countDoctorsAddedInMonth = (doctors = [], referenceDate = new Date()) =>
  doctors.filter((doctor) => isSameYearMonth(doctor?.createdAt, referenceDate))
    .length;

const formatMonthlyAddedBadge = (count) => {
  const safeCount = Math.max(0, Number(count) || 0);

  return `+${safeCount} este mes`;
};

export { isSameYearMonth, countDoctorsAddedInMonth, formatMonthlyAddedBadge };
