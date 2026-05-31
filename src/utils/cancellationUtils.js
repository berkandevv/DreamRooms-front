import { formatDateTime } from './dateUtils'

// Obtiene el texto visible de la política configurada para una habitación
export function getFreeCancellationPolicyText(hours) {
  if (hours === null) {
    return 'Cancelación gratuita sin fecha límite.'
  }

  if (hours === undefined || hours === '') {
    return 'Política de cancelación no disponible.'
  }

  if (Number(hours) === 0) {
    return 'Cancelación gratuita hasta la hora exacta del check-in.'
  }

  return `Cancelación gratuita hasta ${hours} horas antes del check-in.`
}

// Obtiene el texto visible del plazo fijado al crear una reserva
export function getBookingCancellationText(cancellation) {
  if (!cancellation) {
    return ''
  }

  if (cancellation.deadline_at === null) {
    return 'Cancelación gratuita sin fecha límite.'
  }

  const deadline = formatDateTime(cancellation.deadline_at)

  return cancellation.can_cancel
    ? `Cancelación gratuita hasta el ${deadline}.`
    : `El plazo de cancelación gratuita finalizó el ${deadline}.`
}
