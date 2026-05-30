import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import BookingSummary from '../components/BookingSummary'
import FavoriteButton from '../components/FavoriteButton'
import HotelDetailHero from '../components/HotelDetailHero'
import Layout from '../components/Layout'
import ReviewsSection from '../components/ReviewsSection'
import RoomTypeCard from '../components/RoomTypeCard'
import ServicesList from '../components/ServicesList'
import { useCustomerFavorites } from '../hooks/useCustomerFavorites'
import { getHotelBySlug, getHotelReviews } from '../services/hotelService'
import {
  getRoomTypeAvailability,
  getRoomTypeAvailabilityQuote,
} from '../services/roomTypeService'

function addDays(date, days) {
  const nextDate = new Date(date)

  nextDate.setUTCDate(nextDate.getUTCDate() + days)

  return nextDate
}

function formatDateInput(date) {
  return date.toISOString().slice(0, 10)
}

function getNextAvailabilityRange() {
  const today = new Date()
  const startDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  )
  const endDate = addDays(startDate, 30)

  return {
    from: formatDateInput(startDate),
    to: formatDateInput(endDate),
  }
}

function getStayDates(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return []
  }

  const startDate = new Date(`${checkIn}T00:00:00Z`)
  const endDate = new Date(`${checkOut}T00:00:00Z`)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return []
  }

  if (endDate <= startDate) {
    return []
  }

  const dates = []
  const currentDate = new Date(startDate)

  while (currentDate < endDate) {
    dates.push(currentDate.toISOString().slice(0, 10))
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)
  }

  return dates
}

function roomTypeMatchesCapacity(roomType, adults, children) {
  return (
    Number(roomType.capacity_adults) >= adults &&
    Number(roomType.capacity_children) >= children
  )
}

function getOpenAvailabilityDays(availabilityDays) {
  return availabilityDays
    .filter((dayAvailability) => {
      return (
        dayAvailability.status === 'open' &&
        Number(dayAvailability.available_units) > 0
      )
    })
    .slice(0, 4)
}

export default function HotelDetailPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const roomsSectionRef = useRef(null)
  const checkIn = searchParams.get('check_in') || ''
  const checkOut = searchParams.get('check_out') || ''
  const adults = Number(searchParams.get('adults')) || 0
  const children = Number(searchParams.get('children')) || 0
  const unitsBooked = Number(searchParams.get('units_booked')) || 1
  const [detail, setDetail] = useState({
    hotel: null,
    isLoading: true,
    error: '',
  })
  const [reviews, setReviews] = useState([])
  const [reviewsError, setReviewsError] = useState('')
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityError, setAvailabilityError] = useState('')
  const [availabilityNotice, setAvailabilityNotice] = useState('')
  const [availableRoomTypeIds, setAvailableRoomTypeIds] = useState(null)
  const [availableUnitsByRoomType, setAvailableUnitsByRoomType] = useState({})
  const [nextAvailabilityByRoomType, setNextAvailabilityByRoomType] = useState({})
  const [nextAvailabilityError, setNextAvailabilityError] = useState('')
  const { canUseFavorites, favoriteIds, toggleFavorite } = useCustomerFavorites()

  const { hotel, isLoading, error } = detail

  function scrollToRooms() {
    roomsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  async function handleCheckAvailability() {
    scrollToRooms()
    setAvailabilityError('')

    const stayDates = getStayDates(checkIn, checkOut)

    if (stayDates.length === 0) {
      setAvailableRoomTypeIds(null)
      setAvailableUnitsByRoomType({})
      setAvailabilityNotice(
        'Para comprobar disponibilidad real, vuelve desde una búsqueda con fechas de entrada y salida.',
      )
      return
    }

    setIsCheckingAvailability(true)
    setAvailabilityNotice('')

    try {
      const roomTypes = hotel.room_types || []
      const availabilityEntries = await Promise.all(
        roomTypes.map((roomType) => {
          return getRoomTypeAvailabilityQuote(roomType.id, {
            check_in: checkIn,
            check_out: checkOut,
            units_booked: unitsBooked,
          }).then((quote) => [roomType.id, quote])
        }),
      )
      const quoteByRoomType = Object.fromEntries(availabilityEntries)
      const unitsByRoomType = Object.fromEntries(
        roomTypes.map((roomType) => [
          roomType.id,
          quoteByRoomType[roomType.id]?.available_units_for_stay ?? null,
        ]),
      )
      const availableIds = roomTypes
        .filter((roomType) => {
          return (
            roomTypeMatchesCapacity(roomType, adults, children) &&
            quoteByRoomType[roomType.id]?.is_available === true
          )
        })
        .map((roomType) => roomType.id)

      setAvailableRoomTypeIds(availableIds)
      setAvailableUnitsByRoomType(unitsByRoomType)
      setAvailabilityNotice(
        `${availableIds.length} tipos de habitación disponibles para las fechas seleccionadas.`,
      )
    } catch {
      setAvailableRoomTypeIds(null)
      setAvailableUnitsByRoomType({})
      setAvailabilityError('No se pudo comprobar la disponibilidad.')
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  useEffect(() => {
    getHotelBySlug(slug)
      .then((data) => {
        setDetail({
          hotel: data,
          isLoading: false,
          error: '',
        })
      })
      .catch(() => {
        setDetail({
          hotel: null,
          isLoading: false,
          error: 'No se pudo cargar el detalle del hotel!',
        })
      })

    getHotelReviews(slug)
      .then((data) => {
        setReviews(data)
        setReviewsError('')
      })
      .catch(() => {
        setReviewsError('No se pudieron cargar las reseñas!')
      })
  }, [slug])

  useEffect(() => {
    if (!hotel?.room_types?.length || checkIn || checkOut) {
      return undefined
    }

    let shouldIgnoreResponse = false
    const range = getNextAvailabilityRange()

    Promise.all(
      hotel.room_types.map((roomType) => {
        return getRoomTypeAvailability(roomType.id, range).then((availability) => [
          roomType.id,
          getOpenAvailabilityDays(availability),
        ])
      }),
    )
      .then((availabilityEntries) => {
        if (shouldIgnoreResponse) {
          return
        }

        setNextAvailabilityByRoomType(Object.fromEntries(availabilityEntries))
        setNextAvailabilityError('')
      })
      .catch(() => {
        if (!shouldIgnoreResponse) {
          setNextAvailabilityByRoomType({})
          setNextAvailabilityError(
            'No se pudo cargar una vista previa de fechas disponibles.',
          )
        }
      })

    return () => {
      shouldIgnoreResponse = true
    }
  }, [checkIn, checkOut, hotel])

  if (isLoading) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
            Cargando detalle del hotel...
          </p>
        </section>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="rounded-xl border border-error bg-error-container p-6 text-center text-error">
            <p>{error}</p>
            <Link className="mt-4 inline-block font-semibold underline" to="/">
              Volver a hoteles
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  if (!hotel) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
            Hotel no encontrado.
          </p>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl space-y-10 px-5 py-8 md:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <Link className="inline-block text-sm font-semibold text-secondary hover:text-primary" to="/">
            ← Volver a hoteles
          </Link>
          {canUseFavorites && (
            <FavoriteButton
              isFavorite={favoriteIds.has(Number(hotel.id))}
              label={
                favoriteIds.has(Number(hotel.id))
                  ? 'Quitar de favoritos'
                  : 'Guardar favorito'
              }
              onToggle={() => toggleFavorite(hotel)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <HotelDetailHero hotel={hotel} />
          <BookingSummary
            checkIn={checkIn}
            checkOut={checkOut}
            hotel={hotel}
            isCheckingAvailability={isCheckingAvailability}
            onCheckAvailability={handleCheckAvailability}
          />
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
            <h2 className="text-2xl font-bold text-on-surface">Descripción</h2>
            <p className="mt-4 leading-7 text-on-surface-variant">
              {hotel.description || 'Este hotel todavía no tiene descripción.'}
            </p>

            <div className="mt-8 border-t border-outline-variant pt-6">
              <h3 className="text-lg font-bold text-on-surface">Servicios</h3>
              <ServicesList services={hotel.services} />
            </div>

            <div className="mt-8 border-t border-outline-variant pt-6">
              <h3 className="text-lg font-bold text-on-surface">Políticas</h3>
              <p className="mt-3 text-on-surface-variant">
                {hotel.cancellation_policy || 'Política no disponible.'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container p-6">
            <h2 className="text-lg font-bold text-on-surface">Contacto</h2>
            <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
              <p>Email: {hotel.contact?.email || 'No disponible'}</p>
              <p>Teléfono: {hotel.contact?.phone || 'No disponible'}</p>
              <p>Dirección: {hotel.contact?.address || hotel.location?.address || 'No disponible'}</p>
            </div>
          </div>
        </section>

        <section ref={roomsSectionRef}>
          <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold text-on-surface">Habitaciones disponibles</h2>
              <p className="mt-1 text-secondary">
                {availableRoomTypeIds
                  ? 'Habitaciones filtradas según disponibilidad y ocupación.'
                  : 'Elige el tipo de habitación que mejor encaja con tu estancia.'}
              </p>
            </div>
            <p className="text-sm font-semibold text-secondary">
              {availableRoomTypeIds?.length ?? hotel.room_types?.length ?? 0}{' '}
              tipos de habitación
            </p>
          </div>

          {availabilityNotice && (
            <p className="mb-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm font-semibold text-secondary">
              {availabilityNotice}
            </p>
          )}

          {availabilityError && (
            <p className="mb-5 rounded-xl border border-error bg-error-container p-4 text-sm font-semibold text-error">
              {availabilityError}
            </p>
          )}

          {!checkIn && !checkOut && nextAvailabilityError && (
            <p className="mb-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm font-semibold text-secondary">
              {nextAvailabilityError}
            </p>
          )}

          {isCheckingAvailability && (
            <p className="mb-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm font-semibold text-secondary">
              Comprobando disponibilidad...
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotel.room_types
              ?.filter((roomType) => {
                if (!availableRoomTypeIds) {
                  return true
                }

                return availableRoomTypeIds.includes(roomType.id)
              })
              .map((roomType) => (
                <RoomTypeCard
                  currencySymbol={hotel.currency_symbol}
                  hotelSlug={hotel.slug}
                  key={roomType.id}
                  roomType={roomType}
                  searchParams={searchParams}
                  nextAvailabilityDays={
                    !checkIn && !checkOut
                      ? nextAvailabilityByRoomType[roomType.id]
                      : []
                  }
                  selectedAvailableUnits={availableUnitsByRoomType[roomType.id]}
                />
              ))}
          </div>

          {availableRoomTypeIds?.length === 0 && (
            <p className="mt-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
              No hay habitaciones disponibles para esas fechas y ocupación.
            </p>
          )}
        </section>

        <ReviewsSection error={reviewsError} reviews={reviews} />
      </section>
    </Layout>
  )
}
