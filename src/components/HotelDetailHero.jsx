import {
  getHotelImage,
  getHotelLocation,
  getHotelStars,
} from '../utils/hotelUtils'

export default function HotelDetailHero({ hotel }) {
  const { alt: imageAlt, url: imageUrl } = getHotelImage(hotel)
  const { address, city, country } = getHotelLocation(hotel)
  const stars = getHotelStars(hotel.stars)

  return (
    <section className="lg:col-span-2">
      {imageUrl && (
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-[0_8px_24px_rgba(19,27,46,0.10)]">
          <img
            alt={imageAlt}
            className="aspect-video h-full w-full object-cover"
            src={imageUrl}
          />
        </div>
      )}

      <div className="mt-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-primary">
              {hotel.name}
            </h1>
            <p className="mt-3 text-secondary">
              {address ? `${address}, ` : ''}
              {city}, {country}
            </p>
          </div>

          <div className="rounded-lg bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface shadow">
            <span className="text-[#10B981]">{stars}</span>
            <span className="ml-1 text-secondary">
              ({hotel.reviews_count || 0} reseñas)
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
