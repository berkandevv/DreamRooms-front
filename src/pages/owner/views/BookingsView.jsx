import BookingRow from '../BookingRow'
import { bookingStatuses, paymentStatuses } from '../ownerForms'
import { getStatusLabel } from '../ownerHelpers'
import { SelectInput } from '../OwnerUi'

// Vista de reservas: filtros y listado de reservas del propietario
export default function BookingsView({
  bookingFilters,
  bookings,
  hotels,
  isSaving,
  onCreatePayment,
  onFilterChange,
  onStatusChange,
  selectedHotelId,
  setSelectedHotelId,
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-primary">Reservas</h2>
        <p className="text-secondary">
          Filtra, confirma estancias y registra pagos internos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 md:grid-cols-3">
        <SelectInput
          label="Hotel"
          name="hotel_id"
          onChange={(event) => setSelectedHotelId(event.target.value)}
          value={selectedHotelId}
        >
          <option value="">Todos los hoteles</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          label="Estado"
          name="status"
          onChange={(event) =>
            onFilterChange((currentFilters) => ({
              ...currentFilters,
              status: event.target.value,
            }))
          }
          value={bookingFilters.status}
        >
          <option value="">Todos</option>
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          label="Pago"
          name="payment_status"
          onChange={(event) =>
            onFilterChange((currentFilters) => ({
              ...currentFilters,
              payment_status: event.target.value,
            }))
          }
          value={bookingFilters.payment_status}
        >
          <option value="">Todos</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </SelectInput>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingRow
            booking={booking}
            disabled={isSaving}
            key={booking.id}
            onCreatePayment={onCreatePayment}
            onStatusChange={onStatusChange}
          />
        ))}
        {bookings.length === 0 && (
          <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
            No hay reservas con esos filtros.
          </p>
        )}
      </div>
    </section>
  )
}
