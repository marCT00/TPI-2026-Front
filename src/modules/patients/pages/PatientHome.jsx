import { useNavigate } from 'react-router-dom';
import useAppointmentBooking from '../../appointments/hooks/useAppointmentBooking';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import BookingConfirmSection from '../components/BookingConfirmSection';
import BookingSearchCard from '../components/BookingSearchCard';
import BookingSuccessModal from '../components/BookingSuccessModal';
import DoctorSummaryCard from '../components/DoctorSummaryCard';
import WeeklyAvailabilityPicker from '../components/WeeklyAvailabilityPicker';

function PatientHome() {
  const navigate = useNavigate();
  const booking = useAppointmentBooking();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <BookingSearchCard
        specialities={booking.specialities}
        doctors={booking.filteredDoctors}
        selectedSpecialityId={booking.selectedSpecialityId}
        selectedDoctorId={booking.selectedDoctorId}
        isLoadingCatalog={booking.isLoadingCatalog}
        isLoadingSlots={booking.isLoadingSlots}
        onChangeSpeciality={booking.changeSpeciality}
        onChangeDoctor={booking.changeDoctor}
        onSearch={booking.searchAvailability}
      />

      {booking.catalogError && (
        <AlertBanner title="No se pudieron cargar las especialidades y médicos">
          {booking.catalogError}
        </AlertBanner>
      )}

      {booking.slotsError && (
        <AlertBanner title="No se pudo consultar la disponibilidad del profesional">
          {booking.slotsError}{' '}
          <button
            type="button"
            onClick={booking.searchAvailability}
            className="font-semibold underline"
          >
            Reintentar
          </button>
        </AlertBanner>
      )}

      <DoctorSummaryCard doctor={booking.currentDoctor} />

      <WeeklyAvailabilityPicker
        weekDays={booking.weekDays}
        weekRangeLabel={booking.weekRangeLabel}
        slotsByDate={booking.slotsByDate}
        selectedDate={booking.selectedDate}
        selectedSlot={booking.selectedSlot}
        isLoading={booking.isLoadingCatalog || booking.isLoadingSlots}
        onPrevWeek={booking.goToPreviousWeek}
        onNextWeek={booking.goToNextWeek}
        onSelectDay={booking.selectDay}
        onSelectSlot={booking.selectSlot}
      />

      <BookingConfirmSection
        doctor={booking.currentDoctor}
        selectedDayObj={booking.selectedDayObj}
        selectedSlot={booking.selectedSlot}
        bookingError={booking.bookingError}
        onConfirm={booking.confirmBooking}
      />

      <BookingSuccessModal
        booking={booking.confirmedBooking}
        onClose={booking.closeConfirmedModal}
        onGoToAppointments={() => {
          booking.closeConfirmedModal();
          navigate('/appointments');
        }}
      />
    </div>
  );
}

export default PatientHome;
