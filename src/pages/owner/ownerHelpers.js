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

export function getStatusLabel(status) {
  const labels = {
    active: 'Activa',
    authorized: 'Autorizado',
    blocked: 'Bloqueado',
    cancelled: 'Cancelada',
    closed: 'Cerrado',
    completed: 'Completada',
    confirmed: 'Confirmada',
    draft: 'Borrador',
    failed: 'Fallido',
    hotel: 'Pago en hotel',
    inactive: 'Inactivo',
    manual: 'Manual',
    open: 'Abierto',
    paid: 'Pagado',
    pending: 'Pendiente',
    published: 'Publicado',
    refunded: 'Reembolsado',
    card: 'Tarjeta',
  }

  return labels[status] || status || 'Desconocido'
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

  if (booking.payment_status === 'paid') {
    return totalAmount
  }

  const rawPaidAmount = getRawPaidBookingAmount(booking)

  return Math.min(rawPaidAmount, totalAmount)
}

export function getRemainingBookingAmount(booking) {
  if (booking.payment_status === 'paid') {
    return 0
  }

  const totalAmount = getTotalBookingAmount(booking)
  const paidAmount = getPaidBookingAmount(booking)

  return Math.max(totalAmount - paidAmount, 0)
}

export function canRegisterManualPayment(booking) {
  return (
    booking.payment_method === 'hotel' &&
    booking.payment_status === 'pending' &&
    getTotalBookingAmount(booking) > 0
  )
}
