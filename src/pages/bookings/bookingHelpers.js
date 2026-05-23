import { getHotelBySlug } from '../../services/hotelService'

export function getStatusLabel(status) {
  const labels = {
    cancelled: 'Cancelada',
    completed: 'Completada',
    confirmed: 'Confirmada',
    pending: 'Pendiente',
  }

  return labels[status?.toLowerCase()] || status || 'Sin estado'
}

export function isPastBooking(booking) {
  const status = booking.status?.toLowerCase()

  return ['cancelled', 'completed'].includes(status)
}

export function canReviewBooking(booking, reviewedBookings) {
  return (
    booking.status?.toLowerCase() === 'completed' &&
    !reviewedBookings.includes(booking.id)
  )
}

export function getBookingImage(booking) {
  return (
    booking.hotel?.cover_image?.url ||
    booking.room_type?.cover_image?.url ||
    booking.cover_image?.url ||
    booking.image?.url ||
    ''
  )
}

export function getBookingImageAlt(booking) {
  return (
    booking.hotel?.cover_image?.alt_text ||
    booking.room_type?.cover_image?.alt_text ||
    booking.hotel?.name ||
    booking.room_type?.name ||
    'Reserva'
  )
}

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
