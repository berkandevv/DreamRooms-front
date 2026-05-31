import { Link } from 'react-router'
import PaymentMethodBadge from '../../components/PaymentMethodBadge'
import { formatDate } from '../../utils/dateUtils'
import { pluralize } from '../../utils/textUtils'
import { getBookingCancellationText } from '../../utils/cancellationUtils'
import {
  getBookingImage,
  getBookingImageAlt,
  getBookedUnits,
} from './bookingHelpers'
import StatusBadge from './StatusBadge'

export default function BookingCard({ booking, isCancelling, onCancel }) {
  const imageUrl = getBookingImage(booking)
  const cancellationText = getBookingCancellationText(booking.cancellation)
  const canCancel = booking.cancellation?.can_cancel === true

  // Solicita la cancelación de la reserva
  function handleCancelClick() {
    const hotelName = booking.hotel?.name || 'este hotel'
    const reference = booking.booking_reference || booking.id
    const shouldCancel = window.confirm(
      `¿Seguro que quieres cancelar la reserva ${reference} en ${hotelName}?`,
    )

    if (shouldCancel) {
      onCancel(booking.id)
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[12rem_1fr_auto] lg:items-stretch">
        {imageUrl && (
          <div className="h-44 overflow-hidden rounded-lg lg:h-full lg:min-h-36">
            <img
              alt={getBookingImageAlt(booking)}
              className="h-full w-full object-cover"
              src={imageUrl}
            />
          </div>
        )}

        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-primary">
              {booking.hotel?.name || 'Hotel'}
            </h3>
            <p className="mt-1 font-semibold text-secondary">
              {booking.room_type?.name || 'Habitación'}
            </p>
            <p className="mt-1 text-sm font-semibold text-outline">
              Ref. {booking.booking_reference || booking.id}
            </p>

            <p className="mt-5 text-sm font-semibold text-secondary">
              {booking.stay?.nights || '-'}{' '}
              {pluralize(booking.stay?.nights, 'noche', 'noches')} ·{' '}
              {getBookedUnits(booking)}{' '}
              {pluralize(getBookedUnits(booking), 'habitación', 'habitaciones')} ·{' '}
              {booking.stay?.adults_count || 0} adultos,{' '}
              {booking.stay?.children_count || 0} niños
            </p>

            <div className="mt-4 flex flex-col gap-4 text-sm sm:flex-row sm:items-end sm:gap-10">
              <StayInfo label="Check-in" value={formatDate(booking.stay?.check_in)} />
              <StayInfo label="Check-out" value={formatDate(booking.stay?.check_out)} />
            </div>
          </div>

          <div className="mt-5 border-t border-outline-variant pt-4">
            {cancellationText && (
              <p className="mb-3 text-sm font-semibold text-secondary">
                {cancellationText}
              </p>
            )}
            <Link
              className="text-sm font-semibold text-secondary underline transition hover:text-primary"
              to={`/hotels/${booking.hotel?.slug || ''}`}
            >
              Ver hotel
            </Link>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between gap-4 border-t border-outline-variant pt-4 lg:w-44 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <StatusBadge status={booking.status} />
            <PaymentMethodBadge paymentMethod={booking.payment_method} />
            <p className="text-xl font-bold text-primary">
              {booking.amounts?.total}
              {booking.amounts?.currency_symbol}
            </p>
          </div>

          {booking.status?.toLowerCase() !== 'cancelled' && canCancel && (
            <button
              className="rounded-lg border border-error/25 bg-error-container/60 px-4 py-2 text-sm font-semibold text-error transition hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isCancelling}
              onClick={handleCancelClick}
              type="button"
            >
              {isCancelling ? 'Cancelando...' : 'Cancelar'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function StayInfo({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-outline">
        {label}
      </p>
      <p className="mt-1 whitespace-nowrap font-semibold text-primary">
        {value}
      </p>
    </div>
  )
}
