const formatMonthlyAddedBadge = (count) => {
  const safeCount = Math.max(0, Number(count) || 0);

  return `+${safeCount} este mes`;
};

export { formatMonthlyAddedBadge };
