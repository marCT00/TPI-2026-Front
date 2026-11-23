import Card from '../../shared/ui/atoms/Card';
import Spinner from '../../shared/ui/atoms/Spinner';

// Organismo del calendario semanal responsive (Desktop: grilla 5/6 cols; Mobile: tira de días + grilla 3 cols).
function WeeklyAvailabilityPicker({
  weekDays = [],
  weekRangeLabel = '',
  slotsByDate = {},
  selectedDate = '',
  selectedSlot = null,
  isLoading = false,
  onPrevWeek,
  onNextWeek,
  onSelectDay,
  onSelectSlot,
}) {
  const activeDayIso = selectedDate || weekDays[0]?.isoDate || '';
  const mobileSlots = slotsByDate[activeDayIso] ?? [];
  const desktopColsClass =
    weekDays.length === 7
      ? 'sm:grid-cols-7'
      : weekDays.length === 6
        ? 'sm:grid-cols-6'
        : 'sm:grid-cols-5';

  return (
    <Card
      as="section"
      aria-label="Selector semanal de disponibilidad"
      className="p-5 sm:p-6 border-med-border"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Semana anterior"
            onClick={onPrevWeek}
            className="px-2.5 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
          >
            ‹
          </button>
          <span className="font-bold text-sm sm:text-base text-med-primary-900">
            {weekRangeLabel}
          </span>
          <button
            type="button"
            aria-label="Semana siguiente"
            onClick={onNextWeek}
            className="px-2.5 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-med-text-sub">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-med-primary-900" />
            Disponible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Seleccionado
          </span>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-14 text-med-primary-900">
          <Spinner size="lg" label="Consultando horarios disponibles" />
        </div>
      ) : (
        <>
          {/* A) VISTA DESKTOP: Grilla semanal por columnas */}
          <div className={`hidden sm:grid ${desktopColsClass} gap-3 pt-5`}>
            {weekDays.map((day) => {
              const daySlots = slotsByDate[day.isoDate] ?? [];

              return (
                <div
                  key={day.isoDate}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-med-text-sub uppercase">
                      {day.dayName}
                    </span>
                    <p className="text-xl font-bold text-med-primary-900 leading-tight">
                      {day.dateNumber}
                    </p>
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    {daySlots.length > 0 ? (
                      daySlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;

                        return (
                          <button
                            key={slot.id ?? `${day.isoDate}-${slot.startTime}`}
                            type="button"
                            onClick={() => onSelectSlot(day.isoDate, slot)}
                            className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                              isSelected
                                ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
                                : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        );
                      })
                    ) : (
                      <div className="h-44 flex items-center justify-center text-center p-2">
                        <p className="text-xs text-med-text-muted leading-relaxed">
                          No hay turnos disponibles para este día.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* B) VISTA MOBILE: Selector horizontal de días + bloques de 30 min (RNF05) */}
          <div className="block sm:hidden pt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-med-text-main">
                  Próximos Turnos
                </span>
                <button
                  type="button"
                  onClick={onNextWeek}
                  className="text-xs font-semibold text-med-primary-700"
                >
                  Ver más ›
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {weekDays.map((day) => {
                  const isActive = activeDayIso === day.isoDate;

                  return (
                    <button
                      key={day.isoDate}
                      type="button"
                      onClick={() => onSelectDay(day.isoDate)}
                      className={`flex-1 min-w-[68px] py-2.5 px-2 rounded-xl text-center border transition-all ${
                        isActive
                          ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
                          : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-bold uppercase ${
                          isActive ? 'text-white/80' : 'text-med-text-sub'
                        }`}
                      >
                        {day.dayName}
                      </span>
                      <span className="block text-base font-extrabold my-0.5">
                        {day.dateNumber}
                      </span>
                      <span
                        className={`block text-[10px] uppercase ${
                          isActive ? 'text-white/80' : 'text-med-text-muted'
                        }`}
                      >
                        {day.monthShort}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-med-text-sub mb-2.5">
                Horarios disponibles (Bloques de 30 min)
              </span>

              {mobileSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {mobileSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <button
                        key={slot.id ?? `${activeDayIso}-${slot.startTime}`}
                        type="button"
                        onClick={() => onSelectSlot(activeDayIso, slot)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'border-2 border-med-primary-900 bg-med-primary-50 text-med-primary-900 font-bold shadow-xs'
                            : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                        }`}
                      >
                        {slot.startTime} hs
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border border-med-border rounded-xl text-center">
                  <p className="text-xs text-med-text-muted">
                    No hay turnos disponibles para este día.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default WeeklyAvailabilityPicker;
