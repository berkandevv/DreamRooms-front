import { useEffect, useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'
import HotelListCard from '../components/HotelListCard'
import Layout from '../components/Layout'
import { getHotels } from '../services/hotelService'
import { formatServices } from '../utils/formatServices'

const HOTELS_PER_PAGE = 6

function sortHotels(hotels, sortBy) {
  if (sortBy === 'price') {
    return hotels.toSorted((firstHotel, secondHotel) => {
      return Number(firstHotel.starting_price) - Number(secondHotel.starting_price)
    })
  }

  if (sortBy === 'rating') {
    return hotels.toSorted((firstHotel, secondHotel) => {
      return secondHotel.average_rating - firstHotel.average_rating
    })
  }

  return hotels
}

function getHotelZone(hotel) {
  return [
    hotel.location?.city,
    hotel.location?.region,
    hotel.location?.country,
  ]
    .filter(Boolean)
    .join(', ')
}

function getAvailableZones(hotels) {
  const zones = hotels.map((hotel) => getHotelZone(hotel)).filter(Boolean)

  return [...new Set(zones)].toSorted()
}

function getAvailableServices(hotels) {
  const services = hotels.flatMap((hotel) => formatServices(hotel.services))
  const servicesByName = new Map()

  services.forEach((service) => {
    servicesByName.set(normalizeText(service), service)
  })

  return [...servicesByName.values()].toSorted()
}

function getHighestPrice(hotels) {
  const prices = hotels.map((hotel) => Number(hotel.starting_price)).filter(Boolean)

  if (prices.length === 0) {
    return 500
  }

  return Math.ceil(Math.max(...prices))
}

function normalizeText(text) {
  return text.trim().toLowerCase()
}

function renderStars(rating) {
  const stars = []

  for (let index = 0; index < 5; index += 1) {
    if (index < Number(rating)) {
      stars.push(<FaStar className="h-4 w-4 text-[#10B981]" key={index} />)
    } else {
      stars.push(<FaRegStar className="h-4 w-4 text-[#10B981]" key={index} />)
    }
  }

  return stars
}

function filterHotels(
  hotels,
  selectedZone,
  selectedRating,
  selectedServices,
  maxPrice,
) {
  return hotels.filter((hotel) => {
    const zoneMatches = selectedZone === 'all' || getHotelZone(hotel) === selectedZone
    const ratingMatches =
      selectedRating === 'all' ||
      Number(hotel.average_rating) >= Number(selectedRating)
    const hotelPrice = Number(hotel.starting_price)
    const priceMatches = !hotelPrice || hotelPrice <= maxPrice
    const hotelServices = formatServices(hotel.services).map((service) => {
      return normalizeText(service)
    })
    const servicesMatch =
      selectedServices.length === 0 ||
      selectedServices.every((service) => {
        return hotelServices.includes(normalizeText(service))
      })

    return zoneMatches && ratingMatches && priceMatches && servicesMatch
  })
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedZone, setSelectedZone] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [selectedServices, setSelectedServices] = useState([])
  const [maxPrice, setMaxPrice] = useState(500)

  useEffect(() => {
    getHotels()
      .then((data) => {
        setHotels(data)
        setMaxPrice(getHighestPrice(data))
        setError('')
      })
      .catch(() => {
        setError('No se pudo cargar la lista de hoteles!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const availableZones = getAvailableZones(hotels)
  const availableServices = getAvailableServices(hotels)
  const highestPrice = getHighestPrice(hotels)
  const filteredHotels = filterHotels(
    hotels,
    selectedZone,
    selectedRating,
    selectedServices,
    maxPrice,
  )
  const sortedHotels = sortHotels(filteredHotels, sortBy)
  const totalPages = Math.ceil(sortedHotels.length / HOTELS_PER_PAGE)
  const firstHotelIndex = (currentPage - 1) * HOTELS_PER_PAGE
  const currentHotels = sortedHotels.slice(
    firstHotelIndex,
    firstHotelIndex + HOTELS_PER_PAGE,
  )

  function handleSortChange(event) {
    setSortBy(event.target.value)
    setCurrentPage(1)
  }

  function handleZoneChange(event) {
    setSelectedZone(event.target.value)
    setCurrentPage(1)
  }

  function handleRatingChange(event) {
    setSelectedRating(event.target.value)
    setCurrentPage(1)
  }

  function handleMaxPriceChange(event) {
    setMaxPrice(Number(event.target.value))
    setCurrentPage(1)
  }

  function handleServiceChange(event) {
    const service = event.target.value

    if (event.target.checked) {
      setSelectedServices((services) => [...services, service])
    } else {
      setSelectedServices((services) => {
        return services.filter((selectedService) => selectedService !== service)
      })
    }

    setCurrentPage(1)
  }

  function clearFilters() {
    setSelectedZone('all')
    setSelectedRating('all')
    setSelectedServices([])
    setMaxPrice(highestPrice)
    setCurrentPage(1)
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1)
  }

  function goToNextPage() {
    setCurrentPage((page) => page + 1)
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold text-on-surface">Hoteles</h1>
            <p className="mt-2 text-secondary">
              Explora todos los alojamientos disponibles en Dream Rooms
            </p>
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold text-secondary">
            Ordenar por
            <select
              className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-on-surface outline-none focus:border-primary"
              onChange={handleSortChange}
              value={sortBy}
            >
              <option value="rating">Mejor valoración</option>
              <option value="price">Precio más bajo</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="w-full shrink-0 md:w-72">
            <div className="sticky top-24 space-y-8 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="whitespace-nowrap text-xl font-bold text-on-surface">
                  Filtrar resultados
                </h2>
                <button
                  className="text-sm font-semibold text-secondary hover:underline"
                  onClick={clearFilters}
                  type="button"
                >
                  Limpiar
                </button>
              </div>

              <div>
                <label
                  className="text-sm font-bold text-on-surface"
                  htmlFor="price-filter"
                >
                  Precio máximo por noche
                </label>
                <input
                  className="mt-4 w-full accent-primary"
                  id="price-filter"
                  max={highestPrice}
                  min="0"
                  onChange={handleMaxPriceChange}
                  type="range"
                  value={maxPrice}
                />
                <div className="mt-2 flex justify-between text-sm font-semibold text-secondary">
                  <span>0</span>
                  <span>{maxPrice}</span>
                </div>
              </div>

              <div>
                <label
                  className="text-sm font-bold text-on-surface"
                  htmlFor="zone-filter"
                >
                  Zona
                </label>
                <select
                  className="mt-3 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-on-surface outline-none focus:border-primary"
                  id="zone-filter"
                  onChange={handleZoneChange}
                  value={selectedZone}
                >
                  <option value="all">Todas las zonas</option>
                  {availableZones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-bold text-on-surface">
                  Valoración mínima
                </p>
                <div className="mt-3 space-y-3">
                  {['5', '4', '3', '2', '1'].map((rating) => (
                    <label
                      className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-secondary"
                      key={rating}
                    >
                      <input
                        checked={selectedRating === rating}
                        className="h-5 w-5 accent-primary"
                        name="rating-filter"
                        onChange={handleRatingChange}
                        type="radio"
                        value={rating}
                      />
                      <span className="flex items-center gap-1">
                        {renderStars(rating)}
                      </span>
                    </label>
                  ))}
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-secondary">
                    <input
                      checked={selectedRating === 'all'}
                      className="h-5 w-5 accent-primary"
                      name="rating-filter"
                      onChange={handleRatingChange}
                      type="radio"
                      value="all"
                    />
                    <span>Todas</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-on-surface">Servicios</p>
                <div className="mt-3 space-y-3">
                  {availableServices.map((service) => (
                    <label
                      className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-secondary"
                      key={service}
                    >
                      <input
                        checked={selectedServices.includes(service)}
                        className="h-5 w-5 accent-primary"
                        onChange={handleServiceChange}
                        type="checkbox"
                        value={service}
                      />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {isLoading && (
              <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
                Cargando hoteles...
              </p>
            )}

            {error && (
              <p className="rounded-xl border border-error bg-error-container p-6 text-center text-error">
                {error}
              </p>
            )}

            {!isLoading && !error && hotels.length === 0 && (
              <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
                No hay hoteles disponibles en este momento.
              </p>
            )}

            {!isLoading &&
              !error &&
              hotels.length > 0 &&
              sortedHotels.length === 0 && (
                <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
                  No hay hoteles que coincidan con esos filtros.
                </p>
              )}

            {!isLoading &&
              !error &&
              hotels.length > 0 &&
              sortedHotels.length > 0 && (
                <div className="space-y-6">
                  <p className="text-sm font-semibold text-secondary">
                    {sortedHotels.length} hoteles encontrados · Página{' '}
                    {currentPage} de {totalPages}
                  </p>
                  {currentHotels.map((hotel) => (
                    <HotelListCard hotel={hotel} key={hotel.id} />
                  ))}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <button
                        className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={currentPage === 1}
                        onClick={goToPreviousPage}
                        type="button"
                      >
                        Anterior
                      </button>

                      <span className="text-sm font-semibold text-secondary">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={currentPage === totalPages}
                        onClick={goToNextPage}
                        type="button"
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
