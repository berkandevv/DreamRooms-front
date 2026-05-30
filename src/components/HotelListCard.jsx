import { Link, useLocation } from 'react-router'
import { formatServices } from '../utils/formatServices'
import { getServiceIcon } from '../utils/getServiceIcon'
import {
  getHotelImage,
  getHotelLocation,
  getHotelStars,
} from '../utils/hotelUtils'
import FavoriteButton from './FavoriteButton'
import PricePerNight from './PricePerNight'

export default function HotelListCard({
  hotel,
  isFavorite = false,
  onFavoriteToggle,
}) {
  const location = useLocation()
  const { city, country } = getHotelLocation(hotel)
  const { alt: imageAlt, url: imageUrl } = getHotelImage(hotel)
  const stars = getHotelStars(hotel.stars)
  const services = formatServices(hotel.services).slice(0, 3)

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_8px_24px_rgba(19,27,46,0.10)] transition duration-300 hover:border-primary hover:shadow-[0_18px_40px_rgba(19,27,46,0.16)] lg:flex-row">
      <div className="relative h-64 overflow-hidden lg:h-auto lg:w-80">
        {imageUrl && (
          <img
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={imageUrl}
          />
        )}
        <div className="absolute right-4 top-4 rounded-full bg-surface-container-lowest/90 px-3 py-1 text-sm font-semibold text-on-surface shadow">
          <span className="text-[#10B981]">{stars}</span>
        </div>
        {onFavoriteToggle && (
          <FavoriteButton
            className="absolute left-4 top-4 w-11 rounded-full px-0"
            isFavorite={isFavorite}
            onToggle={() => onFavoriteToggle(hotel)}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-on-surface">
              {hotel.name}
            </h2>
            <p className="mt-2 text-sm font-semibold text-secondary">
              {city}, {country}
            </p>
          </div>

          {services.length > 0 && (
            <div className="hidden shrink-0 flex-nowrap justify-end gap-2 md:flex">
              {services.map((service) => (
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container text-secondary"
                  key={service}
                  title={service}
                >
                  {getServiceIcon(service, 'h-4 w-4')}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4 line-clamp-2 text-on-surface-variant">
          {hotel.description || 'Descripción no disponible.'}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-outline-variant pt-6">
          <div>
            <p className="text-xs font-semibold uppercase text-secondary">
              Desde
            </p>
            <PricePerNight
              currencySymbol={hotel.currency_symbol}
              price={hotel.starting_price}
            />
          </div>

          <Link
            className="flex h-11 shrink-0 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary transition hover:opacity-90"
            to={`/hotels/${hotel.slug}${location.search}`}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  )
}
