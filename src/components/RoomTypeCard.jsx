import { FaCheck, FaUsers } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { formatServices } from '../utils/formatServices'
import { formatPrice } from '../utils/formatPrice'
import { formatDate } from '../utils/dateUtils'

export default function RoomTypeCard({
  roomType,
  currencySymbol,
  hotelSlug,
  nextAvailabilityDays = [],
  searchParams,
  selectedAvailableUnits = null,
}) {
  const navigate = useNavigate()
  const imageUrl = roomType.cover_image?.url
  const imageAlt = roomType.cover_image?.alt_text || roomType.name
  const price = formatPrice(roomType.base_price, currencySymbol)
  const services = formatServices(roomType.services)
  const availableUnits =
    selectedAvailableUnits === null || selectedAvailableUnits === undefined
      ? Number(roomType.total_units) || 0
      : Number(selectedAvailableUnits) || 0
  const availableUnitsLabel =
    selectedAvailableUnits === null || selectedAvailableUnits === undefined
      ? 'unidades totales'
      : 'unidades disponibles para estas fechas'
  const servicesText =
    services.length > 0 ? services.join(', ') : 'Servicios no disponibles'

  function handleSelectRoomType() {
    const checkoutParams = new URLSearchParams(searchParams)

    checkoutParams.set('room_type_id', roomType.id)

    navigate(`/hotels/${hotelSlug}/checkout?${checkoutParams.toString()}`)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_8px_24px_rgba(19,27,46,0.10)] transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_40px_rgba(19,27,46,0.16)]">
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={imageUrl}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div>
          <h3 className="text-2xl font-bold text-on-surface">
            {roomType.name}
          </h3>
          <div className="mt-1 flex flex-wrap gap-2 text-sm font-semibold text-secondary">
            <span>{roomType.size_m2 || '-'} m²</span>
            <span>•</span>
            <span>{roomType.bed_type || 'Cama no disponible'}</span>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm text-on-surface-variant">
          <div className="flex items-center gap-3">
            <FaUsers className="h-4 w-4 text-secondary" />
            <span>
              {roomType.capacity_adults || 0} adultos,{' '}
              {roomType.capacity_children || 0} niños
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaCheck className="h-4 w-4 text-secondary" />
            <span>{servicesText}</span>
          </div>
        </div>

        {nextAvailabilityDays.length > 0 && (
          <div className="mt-5 rounded-lg border border-outline-variant bg-surface p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary">
              Próximas fechas disponibles
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {nextAvailabilityDays.map((dayAvailability) => (
                <span
                  className="rounded-full bg-[#D1FAE5] px-2.5 py-1 text-xs font-bold text-[#047857]"
                  key={dayAvailability.date}
                >
                  {formatDate(dayAvailability.date)}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-4 border-t border-outline-variant pt-5">
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
              <p className="mt-1 text-xs font-semibold text-on-tertiary-container">
                {availableUnits} {availableUnitsLabel}
              </p>
            </div>

            <button
              className="h-10 shrink-0 cursor-pointer rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary shadow-md transition hover:-translate-y-0.5 hover:bg-on-surface-variant hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/25"
              onClick={handleSelectRoomType}
              type="button"
            >
              Seleccionar
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
