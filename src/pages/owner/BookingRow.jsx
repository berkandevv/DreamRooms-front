import { FaCreditCard } from 'react-icons/fa'
import PaymentMethodBadge from '../../components/PaymentMethodBadge'
import { formatPrice } from '../../utils/formatPrice'
import { pluralize } from '../../utils/textUtils'
import { bookingStatuses } from './forms/ownerForms'
import {
  canRegisterManualPayment,
  getBookedUnits,
  getDateLabel,
  getPaidBookingAmount,
  getRemainingBookingAmount,
  getStatusLabel,
} from './ownerHelpers'
import { StatusBadge } from './OwnerUi'

export default function BookingRow({
  booking,
  compact = false,
  disabled = false,
  onCreatePayment,
  onStatusChange,
}) {
  // Calcula los importes de pago y si se puede registrar un pago manual
  const paidAmount = getPaidBookingAmount(booking)
  const remainingAmount = getRemainingBookingAmount(booking)
  const canCreateManualPayment = canRegisterManualPayment(booking)
  const taxesAmount = Number(booking.amounts?.taxes) || 0
  const discountAmount = Number(booking.amounts?.discount) || 0
  const currencySymbol = booking.amounts?.currency_symbol

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
          <div className="mt-2">
            <PaymentMethodBadge paymentMethod={booking.payment_method} />
          </div>
          <p className="mt-1 text-sm text-secondary">
            {getDateLabel(booking.stay?.check_in)} -{' '}
            {getDateLabel(booking.stay?.check_out)} ·{' '}
            {booking.stay?.nights || 0}{' '}
            {pluralize(booking.stay?.nights, 'noche', 'noches')} ·{' '}
            {getBookedUnits(booking)}{' '}
            {pluralize(getBookedUnits(booking), 'habitación', 'habitaciones')}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="text-sm md:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary">
              Total reserva
            </p>
            <p className="text-xl font-bold text-primary">
              {formatPrice(booking.amounts?.total, currencySymbol, {
                decimals: true,
              })}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 md:justify-end">
              <PaymentAmountBadge
                label="Pagado"
                tone="paid"
                value={formatPrice(paidAmount, currencySymbol, {
                  decimals: true,
                })}
              />
              <PaymentAmountBadge
                label="Pendiente"
                tone={remainingAmount > 0 ? 'pending' : 'settled'}
                value={formatPrice(remainingAmount, currencySymbol, {
                  decimals: true,
                })}
              />
              {taxesAmount > 0 && (
                <PaymentAmountBadge
                  label="Tasas"
                  tone="tax"
                  value={formatPrice(taxesAmount, currencySymbol, {
                    decimals: true,
                  })}
                />
              )}
              {discountAmount > 0 && (
                <PaymentAmountBadge
                  label="Descuento"
                  tone="discount"
                  value={`-${formatPrice(discountAmount, currencySymbol, {
                    decimals: true,
                  })}`}
                />
              )}
            </div>
          </div>
          {!compact && (
            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 cursor-pointer rounded-lg border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                onChange={(event) => onStatusChange(booking.id, event.target.value)}
                value={booking.status}
              >
                {bookingStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
              {onCreatePayment && (
                <button
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={disabled || !canCreateManualPayment}
                  onClick={() => onCreatePayment(booking)}
                  type="button"
                  title={
                    canCreateManualPayment
                      ? 'Registrar pago completo'
                      : 'Solo disponible para reservas pendientes con pago en hotel'
                  }
                >
                  <FaCreditCard className="h-3 w-3" />
                  Pago
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

// Etiqueta con el importe de pago y un color según su tipo
function PaymentAmountBadge({ label, tone, value }) {
  const toneClassNames = {
    discount: 'bg-on-tertiary-container/10 text-on-tertiary-container',
    paid: 'bg-on-tertiary-container/10 text-on-tertiary-container',
    pending: 'bg-error-container text-error',
    settled: 'bg-surface-container text-secondary',
    tax: 'bg-secondary-container text-on-secondary-fixed',
  }

  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-xs font-bold ${toneClassNames[tone]}`}
    >
      {label}: {value}
    </span>
  )
}
