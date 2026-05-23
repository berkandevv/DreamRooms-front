import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router'
import Layout from '../components/Layout'
import BookingCard from './bookings/BookingCard'
import ReviewForm from './bookings/ReviewForm'
import StatusBadge from './bookings/StatusBadge'
import {
  canReviewBooking,
  enrichBookingsWithHotelImages,
  isPastBooking,
} from './bookings/bookingHelpers'
import {
  getAuthenticatedUser,
  getAuthToken,
  setAuthenticatedUser,
} from '../services/authService'
import {
  cancelCustomerBooking,
  getCustomerBookings,
} from '../services/customerBookingService'
import { formatDate } from '../utils/dateUtils'
import { pluralize } from '../utils/textUtils'

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
        const customer = enrichedBookings.find((booking) => {
          return booking.customer?.name || booking.customer?.email
        })?.customer

        if (customer) {
          setAuthenticatedUser({
            email: customer.email,
            name: customer.name,
          })
        }

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
            Gestiona tus próximas estancias y comenta tus reservas completadas
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
