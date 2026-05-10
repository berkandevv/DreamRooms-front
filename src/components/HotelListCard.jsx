import { Link } from 'react-router'
import placeholderImg from '../assets/hero.png'
import { formatServices } from '../utils/formatServices'
import { formatPrice } from '../utils/formatPrice'
import { getServiceIcon } from '../utils/getServiceIcon'

export default function HotelListCard({ hotel }) {
  const city = hotel.location?.city || 'Ciudad no disponible'
  const country = hotel.location?.country || 'País no disponible'
  const price = formatPrice(hotel.starting_price, hotel.currency_symbol)
  const rating = hotel.average_rating || 'Nuevo'
  const imageUrl = hotel.cover_image?.url || placeholderImg
  const imageAlt = hotel.cover_image?.alt_text || hotel.name
  const services = formatServices(hotel.services).slice(0, 3)

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_8px_24px_rgba(19,27,46,0.10)] transition duration-300 hover:border-primary hover:shadow-[0_18px_40px_rgba(19,27,46,0.16)] lg:flex-row">
      <div className="relative h-64 overflow-hidden lg:h-auto lg:w-80">
        <img
          alt={imageAlt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={imageUrl}
        />
        <div className="absolute right-4 top-4 rounded-full bg-surface-container-lowest/90 px-3 py-1 text-sm font-semibold text-on-surface shadow">
          <span className="text-[#10B981]">☆</span> {rating}
        </div>
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
            <div className="hidden flex-wrap justify-end gap-2 md:flex">
              {services.map((service) => (
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-secondary"
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
            <p className="mt-1 text-2xl font-bold text-primary">
              {price}
              <span className="text-base font-normal text-secondary">
                /noche
              </span>
            </p>
          </div>

          <Link
            className="flex h-11 shrink-0 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary transition hover:opacity-90"
            to={`/hotels/${hotel.slug}`}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  )
}
