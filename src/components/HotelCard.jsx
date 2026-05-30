import { Link } from 'react-router'
import { formatPrice } from '../utils/formatPrice'
import FavoriteButton from './FavoriteButton'

export default function HotelCard({ hotel, isFavorite = false, onFavoriteToggle }) {
  const city = hotel.location?.city || 'Ciudad no disponible'
  const country = hotel.location?.country || 'País no disponible'
  const price = formatPrice(hotel.starting_price, hotel.currency_symbol)
  const stars = '★'.repeat(Number(hotel.stars) || 0) || 'Sin estrellas'
  const imageUrl = hotel.cover_image?.url
  const imageAlt = hotel.cover_image?.alt_text || hotel.name

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_8px_24px_rgba(19,27,46,0.10)] transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_40px_rgba(19,27,46,0.16)]">
      <div className="relative h-64 overflow-hidden">
        {imageUrl && (
          <img
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            src={imageUrl}
          />
        )}

        <div className="absolute right-4 top-4 rounded-lg bg-surface-container-lowest/90 px-3 py-1 text-sm font-semibold text-on-surface shadow">
          <span className="text-[#D4AF37]">{stars}</span>
        </div>
        {onFavoriteToggle && (
          <FavoriteButton
            className="absolute left-4 top-4 w-11 rounded-full px-0"
            isFavorite={isFavorite}
            onToggle={() => onFavoriteToggle(hotel)}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          <h3 className="text-2xl font-bold leading-tight text-on-surface">
            {hotel.name}
          </h3>

          <p className="mt-2 text-sm font-medium text-secondary">
            {city}, {country}
          </p>
        </div>

        <div className="min-h-6 flex-1"></div>

        <div className="flex items-end justify-between gap-4 border-t border-outline-variant pt-7">
          <div>
            <p className="text-xs font-semibold uppercase text-secondary">
              Desde
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {price}
              <span className="text-base font-normal text-secondary">
                /noche
              </span>
            </p>
          </div>

          <Link
            className="flex h-10 shrink-0 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:opacity-90"
            to={`/hotels/${hotel.slug}`}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  )
}
