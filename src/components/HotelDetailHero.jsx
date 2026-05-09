import placeholderImg from '../assets/hero.png'

export default function HotelDetailHero({ hotel }) {
  const imageUrl = hotel.cover_image?.url || placeholderImg
  const imageAlt = hotel.cover_image?.alt_text || hotel.name
  const address = hotel.location?.address || hotel.contact?.address
  const city = hotel.location?.city
  const country = hotel.location?.country

  return (
    <section className="lg:col-span-2">
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-[0_8px_24px_rgba(19,27,46,0.10)]">
        <img
          alt={imageAlt}
          className="aspect-video h-full w-full object-cover"
          src={imageUrl}
        />
      </div>

      <div className="mt-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-primary">
              {hotel.name}
            </h1>
            <p className="mt-3 text-secondary">
              {address ? `${address}, ` : ''}
              {city || 'Ciudad no disponible'}, {country || 'País no disponible'}
            </p>
          </div>

          <div className="rounded-lg bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface shadow">
            <span className="text-[#10B981]">☆</span>{' '}
            {hotel.average_rating || 'Nuevo'}
            <span className="ml-1 text-secondary">
              ({hotel.reviews_count || 0} reseñas)
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
