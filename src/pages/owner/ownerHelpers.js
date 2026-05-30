import { formatDate } from '../../utils/dateUtils'

export function getLocationText(hotel) {
  return [hotel.location?.city, hotel.location?.region, hotel.location?.country]
    .filter(Boolean)
    .join(', ')
}

export function getStatusClass(status) {
  if (status === 'confirmed' || status === 'published' || status === 'paid') {
    return 'bg-on-tertiary-container/10 text-on-tertiary-container'
  }

  if (status === 'cancelled' || status === 'failed') {
    return 'bg-error-container text-error'
  }

  return 'bg-secondary-container text-on-secondary-fixed-variant'
}

export function getDateLabel(value) {
  return formatDate(value, 'Sin fecha')
}

export function getTotalBookingAmount(booking) {
  return Number(booking.amounts?.total) || 0
}

export function getRawPaidBookingAmount(booking) {
  return (booking.payments || [])
    .filter((payment) => payment.status === 'paid')
    .reduce((total, payment) => total + (Number(payment.amount) || 0), 0)
}

export function getPaidBookingAmount(booking) {
  const totalAmount = getTotalBookingAmount(booking)
  const rawPaidAmount = getRawPaidBookingAmount(booking)

  return Math.min(rawPaidAmount, totalAmount)
}

export function getRemainingBookingAmount(booking) {
  const totalAmount = getTotalBookingAmount(booking)
  const paidAmount = getPaidBookingAmount(booking)

  return Math.max(totalAmount - paidAmount, 0)
}
