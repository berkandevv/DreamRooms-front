import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import BookingSummary from '../components/BookingSummary'
import HotelDetailHero from '../components/HotelDetailHero'
import Layout from '../components/Layout'
import ReviewsSection from '../components/ReviewsSection'
import RoomTypeCard from '../components/RoomTypeCard'
import ServicesList from '../components/ServicesList'
import { getHotelBySlug, getHotelReviews } from '../services/hotelService'

export default function HotelDetailPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const [detail, setDetail] = useState({
    hotel: null,
    isLoading: true,
    error: '',
  })
  const [reviews, setReviews] = useState([])
  const [reviewsError, setReviewsError] = useState('')

  const { hotel, isLoading, error } = detail

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
        <Link className="inline-block text-sm font-semibold text-secondary hover:text-primary" to="/">
          ← Volver a hoteles
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <HotelDetailHero hotel={hotel} />
          <BookingSummary hotel={hotel} />
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

        <section>
          <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold text-on-surface">Habitaciones disponibles</h2>
              <p className="mt-1 text-secondary">
                Elige el tipo de habitación que mejor encaja con tu estancia.
              </p>
            </div>
            <p className="text-sm font-semibold text-secondary">
              {hotel.room_types?.length || 0} tipos de habitación
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotel.room_types?.map((roomType) => (
              <RoomTypeCard
                currencySymbol={hotel.currency_symbol}
                hotelSlug={hotel.slug}
                key={roomType.id}
                roomType={roomType}
                searchParams={searchParams}
              />
            ))}
          </div>
        </section>

        <ReviewsSection error={reviewsError} reviews={reviews} />
      </section>
    </Layout>
  )
}
