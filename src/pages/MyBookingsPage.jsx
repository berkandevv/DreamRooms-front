import { useEffect, useState } from 'react'
import { FaCheckCircle, FaRegStar, FaStar } from 'react-icons/fa'
import { Link } from 'react-router'
import Layout from '../components/Layout'
import { getAuthenticatedUser, getAuthToken } from '../services/authService'
import {
  cancelCustomerBooking,
  createCustomerBookingReview,
  getCustomerBookings,
} from '../services/customerBookingService'
import { getHotelBySlug } from '../services/hotelService'

function formatDate(date) {
  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function pluralize(count, singular, plural) {
  return Number(count) === 1 ? singular : plural
}

function getStatusLabel(status) {
  const labels = {
    cancelled: 'Cancelada',
    completed: 'Completada',
    confirmed: 'Confirmada',
    pending: 'Pendiente',
  }

  return labels[status?.toLowerCase()] || status || 'Sin estado'
}

function isPastBooking(booking) {
  const status = booking.status?.toLowerCase()

  return ['cancelled', 'completed'].includes(status)
}

function canReviewBooking(booking, reviewedBookings) {
  return (
    booking.status?.toLowerCase() === 'completed' &&
    !reviewedBookings.includes(booking.id)
  )
}

function getBookingImage(booking) {
  return (
    booking.hotel?.cover_image?.url ||
    booking.room_type?.cover_image?.url ||
    booking.cover_image?.url ||
    booking.image?.url ||
    ''
  )
}

function getBookingImageAlt(booking) {
  return (
    booking.hotel?.cover_image?.alt_text ||
    booking.room_type?.cover_image?.alt_text ||
    booking.hotel?.name ||
    booking.room_type?.name ||
    'Reserva'
  )
}

async function enrichBookingsWithHotelImages(bookings) {
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

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [expandedReviewId, setExpandedReviewId] = useState(null)
  const [reviewedBookings, setReviewedBookings] = useState([])
  const [cancellingBookingId, setCancellingBookingId] = useState(null)
  const [cancelError, setCancelError] = useState('')
  const isAuthenticated = Boolean(getAuthToken())
  const user = getAuthenticatedUser()
  const [isLoading, setIsLoading] = useState(isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    getCustomerBookings()
      .then((data) => enrichBookingsWithHotelImages(data))
      .then((enrichedBookings) => {
        setBookings(enrichedBookings)
        setError('')
      })
      .catch((bookingsError) => {
        setError(bookingsError.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isAuthenticated])

  const activeBookings = bookings.filter((booking) => !isPastBooking(booking))
  const pastBookings = bookings.filter(isPastBooking)
  const customerName =
    user?.name ||
    bookings.find((booking) => booking.customer?.name)?.customer?.name ||
    bookings.find((booking) => booking.user?.name)?.user?.name ||
    'cliente'

  function handleReviewCreated(bookingId) {
    setReviewedBookings((currentBookings) => [...currentBookings, bookingId])
    setExpandedReviewId(null)
  }

  async function handleCancelBooking(bookingId) {
    setCancellingBookingId(bookingId)
    setCancelError('')

    try {
      const cancelledBooking = await cancelCustomerBooking(bookingId)

      setBookings((currentBookings) => {
        return currentBookings.map((booking) => {
          if (booking.id === bookingId) {
            return cancelledBooking
          }

          return booking
        })
      })
    } catch (bookingError) {
      setCancelError(bookingError.message)
    } finally {
      setCancellingBookingId(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
            <h1 className="text-3xl font-bold text-on-surface">
              Inicia sesión para ver tus reservas
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-secondary">
              Las reservas se consultan con la sesión temporal del cliente.
            </p>
            <Link
              className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 font-semibold text-on-primary transition hover:opacity-90"
              to="/login"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary">
            Hola, {customerName}
          </h1>
          <p className="mt-2 text-secondary">
            Gestiona tus próximas estancias y comenta tus reservas completadas.
          </p>
        </header>

        {isLoading && (
          <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
            Cargando tus reservas...
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-error bg-error-container p-6 text-center text-error">
            {error}
          </p>
        )}

        {!isLoading && !error && bookings.length === 0 && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
            <h2 className="text-2xl font-bold text-on-surface">
              Todavía no tienes reservas
            </h2>
            <Link
              className="mt-5 inline-flex h-11 items-center rounded-lg bg-primary px-5 font-semibold text-on-primary transition hover:opacity-90"
              to="/hotels"
            >
              Explorar hoteles
            </Link>
          </div>
        )}

        {!isLoading && !error && bookings.length > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-10">
              {cancelError && (
                <p className="rounded-xl border border-error bg-error-container p-4 text-sm font-semibold text-error">
                  {cancelError}
                </p>
              )}

              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-primary">
                    Reservas actuales
                  </h2>
                  <span className="rounded-lg bg-surface-container px-3 py-1 text-sm font-semibold text-secondary">
                    {activeBookings.length}{' '}
                    {pluralize(activeBookings.length, 'activa', 'activas')}
                  </span>
                </div>

                <div className="space-y-5">
                  {activeBookings.length === 0 && (
                    <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-secondary">
                      No tienes reservas activas.
                    </p>
                  )}

                  {activeBookings.map((booking) => (
                    <BookingCard
                      booking={booking}
                      isCancelling={cancellingBookingId === booking.id}
                      key={booking.id}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-primary">
                  Estancias pasadas
                </h2>
                <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
                  {pastBookings.length === 0 && (
                    <p className="p-6 text-secondary">
                      No tienes estancias pasadas.
                    </p>
                  )}

                  {pastBookings.map((booking) => (
                    <div
                      className="border-b border-outline-variant last:border-b-0"
                      key={booking.id}
                    >
                      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1fr_auto_auto] md:items-center">
                        <div>
                          <h3 className="font-bold text-primary">
                            {booking.hotel?.name || 'Hotel'}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-secondary">
                            {booking.room_type?.name || 'Habitación'}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          {formatDate(booking.stay?.check_in)} -{' '}
                          {formatDate(booking.stay?.check_out)}
                        </p>
                        <div className="flex items-center justify-start gap-3 md:justify-end">
                          <StatusBadge status={booking.status} />
                          {reviewedBookings.includes(booking.id) ? (
                            <span className="flex items-center gap-2 text-sm font-semibold text-on-tertiary-container">
                              <FaCheckCircle className="h-4 w-4" />
                              Comentado
                            </span>
                          ) : (
                            canReviewBooking(booking, reviewedBookings) && (
                              <button
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90"
                                onClick={() =>
                                  setExpandedReviewId((currentId) =>
                                    currentId === booking.id ? null : booking.id,
                                  )
                                }
                                type="button"
                              >
                                Escribir comentario
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {expandedReviewId === booking.id && (
                        <ReviewForm
                          booking={booking}
                          onCreated={handleReviewCreated}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(19,27,46,0.08)] lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-primary">Resumen</h2>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <StatCard label="Total reservas" value={bookings.length} />
                <StatCard label="Activas" value={activeBookings.length} />
                <StatCard label="Pasadas" value={pastBookings.length} />
                <StatCard
                  label="Comentadas"
                  value={reviewedBookings.length}
                />
              </div>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  )
}

function BookingCard({ booking, isCancelling, onCancel }) {
  const imageUrl = getBookingImage(booking)

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
              {booking.stay?.adults_count || 0} adultos,{' '}
              {booking.stay?.children_count || 0} niños
            </p>

            <div className="mt-4 flex flex-col gap-4 text-sm sm:flex-row sm:items-end sm:gap-10">
              <StayInfo label="Check-in" value={formatDate(booking.stay?.check_in)} />
              <StayInfo label="Check-out" value={formatDate(booking.stay?.check_out)} />
            </div>
          </div>

          <div className="mt-5 border-t border-outline-variant pt-4">
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
            <p className="text-xl font-bold text-primary">
              {booking.amounts?.total}
              {booking.amounts?.currency_symbol}
            </p>
          </div>

          {booking.status?.toLowerCase() !== 'cancelled' && (
            <button
              className="rounded-lg border border-error/25 bg-error-container/60 px-4 py-2 text-sm font-semibold text-error transition hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isCancelling}
              onClick={() => onCancel(booking.id)}
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

function ReviewForm({ booking, onCreated }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await createCustomerBookingReview(booking.id, {
        comment,
        rating,
      })
      onCreated(booking.id)
    } catch (reviewError) {
      setError(reviewError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="border-t border-outline-variant bg-surface p-5"
      onSubmit={handleSubmit}
    >
      <h4 className="font-bold text-primary">
        ¿Cómo fue tu estancia en {booking.hotel?.name || 'el hotel'}?
      </h4>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            className="text-primary"
            key={value}
            onClick={() => setRating(value)}
            type="button"
          >
            {value <= rating ? (
              <FaStar className="h-5 w-5" />
            ) : (
              <FaRegStar className="h-5 w-5" />
            )}
          </button>
        ))}
      </div>
      <textarea
        className="mt-4 h-24 w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(event) => setComment(event.target.value)}
        placeholder="Comparte tu experiencia..."
        required
        value={comment}
      />
      {error && (
        <p className="mt-3 rounded-lg border border-error bg-error-container p-3 text-sm font-semibold text-error">
          {error}
        </p>
      )}
      <div className="mt-4 flex justify-end gap-3">
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Publicando...' : 'Publicar comentario'}
        </button>
      </div>
    </form>
  )
}

function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase()
  const isCancelled = normalizedStatus === 'cancelled'
  const isConfirmed = normalizedStatus === 'confirmed'

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
        isCancelled
          ? 'bg-error-container text-error'
          : isConfirmed
            ? 'bg-on-tertiary-container/10 text-on-tertiary-container'
            : 'bg-secondary-container text-secondary'
      }`}
    >
      {getStatusLabel(status)}
    </span>
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-secondary">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
    </div>
  )
}
