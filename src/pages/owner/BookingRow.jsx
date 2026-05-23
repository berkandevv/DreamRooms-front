import { FaCreditCard } from 'react-icons/fa'
import { formatPrice } from '../../utils/formatPrice'
import { bookingStatuses } from './ownerForms'
import { getDateLabel } from './ownerHelpers'
import { StatusBadge } from './OwnerUi'

export default function BookingRow({
  booking,
  compact = false,
  disabled = false,
  onCreatePayment,
  onPaymentAmountChange,
  onStatusChange,
  paymentAmount,
}) {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-primary">
              {booking.customer?.name || 'Cliente'}
            </h3>
            <StatusBadge label="Reserva" status={booking.status} />
            <StatusBadge label="Pago" status={booking.payment_status} />
          </div>
          <p className="mt-1 text-sm text-secondary">
            {booking.booking_reference} · {booking.hotel?.name} ·{' '}
            {booking.room_type?.name}
          </p>
          <p className="mt-1 text-sm text-secondary">
            {getDateLabel(booking.stay?.check_in)} -{' '}
            {getDateLabel(booking.stay?.check_out)} ·{' '}
            {booking.stay?.nights || 0} noches
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <p className="text-xl font-bold text-primary">
            {formatPrice(booking.amounts?.total, booking.amounts?.currency_symbol)}
          </p>
          {!compact && (
            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 rounded-lg border border-outline-variant bg-surface px-3 text-sm outline-none focus:border-primary"
                disabled={disabled}
                onChange={(event) => onStatusChange(booking.id, event.target.value)}
                value={booking.status}
              >
                {bookingStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {onCreatePayment && (
                <>
                  <input
                    className="h-10 w-28 rounded-lg border border-outline-variant bg-surface px-3 text-sm outline-none focus:border-primary"
                    min="0"
                    onChange={(event) =>
                      onPaymentAmountChange((currentAmounts) => ({
                        ...currentAmounts,
                        [booking.id]: event.target.value,
                      }))
                    }
                    placeholder={booking.amounts?.total || '0.00'}
                    step="0.01"
                    type="number"
                    value={paymentAmount || ''}
                  />
                  <button
                    className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={disabled}
                    onClick={() => onCreatePayment(booking)}
                    type="button"
                  >
                    <FaCreditCard className="h-3 w-3" />
                    Pago
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
