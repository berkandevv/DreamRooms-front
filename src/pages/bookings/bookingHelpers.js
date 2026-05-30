import { getHotelBySlug } from '../../services/hotelService'

// Obtiene la etiqueta visible de un estado de reserva
export function getStatusLabel(status) {
  const labels = {
    cancelled: 'Cancelada',
    completed: 'Completada',
    confirmed: 'Confirmada',
    pending: 'Pendiente',
  }

  return labels[status?.toLowerCase()] || status || 'Sin estado'
}

// Obtiene la etiqueta visible de un método de pago
export function getPaymentMethodLabel(paymentMethod) {
  const labels = {
    card: 'Pago con tarjeta',
    hotel: 'Pago en hotel',
    manual: 'Manual',
  }

  return labels[paymentMethod?.toLowerCase()] || 'No indicado'
}

// Obtiene el número de unidades incluidas en una reserva
export function getBookedUnits(booking) {
  return Number(booking.stay?.units_booked || booking.units_booked) || 1
}

// Comprueba si una reserva ya ha finalizado
export function isPastBooking(booking) {
  const status = booking.status?.toLowerCase()

  return ['cancelled', 'completed'].includes(status)
}

// Comprueba si una reserva ya tiene reseña
export function bookingHasReview(booking) {
  return Boolean(booking.review || booking.has_review)
}

// Comprueba si una reserva admite una nueva reseña
export function canReviewBooking(booking, reviewedBookings) {
  return (
    [true, 'true', 1, '1'].includes(booking.can_review) &&
    !reviewedBookings.includes(booking.id)
  )
}

// Obtiene la imagen principal de una reserva
export function getBookingImage(booking) {
  return (
    booking.hotel?.cover_image?.url ||
    booking.room_type?.cover_image?.url ||
    booking.cover_image?.url ||
    booking.image?.url ||
    ''
  )
}

// Obtiene el texto alternativo de la imagen de una reserva
export function getBookingImageAlt(booking) {
  return (
    booking.hotel?.cover_image?.alt_text ||
    booking.room_type?.cover_image?.alt_text ||
    booking.hotel?.name ||
    booking.room_type?.name ||
    'Reserva'
  )
}

// Completa las reservas con las imágenes de sus hoteles
export async function enrichBookingsWithHotelImages(bookings) {
  const hotelSlugs = [
    ...new Set(bookings.map((booking) => booking.hotel?.slug).filter(Boolean)),
  ]

  const hotelEntries = await Promise.all(
    hotelSlugs.map(async (slug) => {
      try {
        const hotel = await getHotelBySlug(slug)

        return [slug, hotel]
      } catch {
        return [slug, null]
      }
    }),
  )
  const hotelsBySlug = Object.fromEntries(hotelEntries)

  return bookings.map((booking) => {
    const hotel = hotelsBySlug[booking.hotel?.slug]
    const roomType = hotel?.room_types?.find((item) => {
      return Number(item.id) === Number(booking.room_type?.id)
    })

    return {
      ...booking,
      hotel: {
        ...booking.hotel,
        cover_image: booking.hotel?.cover_image || hotel?.cover_image,
      },
      room_type: {
        ...booking.room_type,
        cover_image: booking.room_type?.cover_image || roomType?.cover_image,
      },
    }
  })
}
