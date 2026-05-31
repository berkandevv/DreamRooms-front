import { formatDate } from '../../utils/dateUtils'
export { getBookedUnits } from '../../utils/bookingUtils'
export { getStatusLabel } from '../../utils/statusUtils'

// Obtiene la ubicación visible de un hotel
export function getLocationText(hotel) {
  return [hotel.location?.city, hotel.location?.region, hotel.location?.country]
    .filter(Boolean)
    .join(', ')
}

// Obtiene las clases visuales asociadas a un estado
export function getStatusClass(status) {
  if (status === 'confirmed' || status === 'published' || status === 'paid') {
    return 'bg-on-tertiary-container/10 text-on-tertiary-container'
  }

  if (status === 'cancelled' || status === 'failed') {
    return 'bg-error-container text-error'
  }

  return 'bg-secondary-container text-on-secondary-fixed-variant'
}

// Obtiene la etiqueta visible de una fecha
export function getDateLabel(value) {
  return formatDate(value, 'Sin fecha')
}

// Obtiene el importe total de una reserva
export function getTotalBookingAmount(booking) {
  return Number(booking.amounts?.total) || 0
}

// Suma los pagos completados de una reserva
export function getRawPaidBookingAmount(booking) {
  return (booking.payments || [])
    .filter((payment) => payment.status === 'paid')
    .reduce((total, payment) => total + (Number(payment.amount) || 0), 0)
}

// Obtiene el importe pagado sin superar el total
export function getPaidBookingAmount(booking) {
  const totalAmount = getTotalBookingAmount(booking)

  if (booking.payment_status === 'paid') {
    return totalAmount
  }

  const rawPaidAmount = getRawPaidBookingAmount(booking)

  return Math.min(rawPaidAmount, totalAmount)
}

// Obtiene el importe pendiente de una reserva
export function getRemainingBookingAmount(booking) {
  if (booking.payment_status === 'paid') {
    return 0
  }

  const totalAmount = getTotalBookingAmount(booking)
  const paidAmount = getPaidBookingAmount(booking)

  return Math.max(totalAmount - paidAmount, 0)
}

// Comprueba si una reserva admite un pago manual
export function canRegisterManualPayment(booking) {
  return (
    booking.payment_method === 'hotel' &&
    booking.payment_status === 'pending' &&
    getTotalBookingAmount(booking) > 0
  )
}
