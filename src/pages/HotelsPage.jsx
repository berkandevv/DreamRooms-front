import { useEffect, useState } from 'react'
import { FaChevronDown, FaRegStar, FaStar } from 'react-icons/fa'
import { useSearchParams } from 'react-router'
import HotelListCard from '../components/HotelListCard'
import Layout from '../components/Layout'
import { useCustomerFavorites } from '../hooks/useCustomerFavorites'
import { getHotels } from '../services/hotelService'
import { getRoomTypeAvailability } from '../services/roomTypeService'
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

function getAvailableRegions(hotels) {
  const regions = hotels.map((hotel) => hotel.location?.region).filter(Boolean)

  return [...new Set(regions)].toSorted()
}

function getAvailableCities(hotels, selectedRegion) {
  const cities = hotels
    .filter((hotel) => {
      return selectedRegion === 'all' || hotel.location?.region === selectedRegion
    })
    .map((hotel) => hotel.location?.city)
    .filter(Boolean)

  return [...new Set(cities)].toSorted()
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

function hotelMatchesSearch(hotel, searchText) {
  if (!searchText) {
    return true
  }

  const normalizedSearch = normalizeText(searchText)
  const searchableText = [
    hotel.name,
    hotel.location?.city,
    hotel.location?.region,
    hotel.location?.country,
  ]
    .filter(Boolean)
    .map((value) => normalizeText(value))
    .join(' ')

  return searchableText.includes(normalizedSearch)
}

function hotelMatchesCapacity(hotel, adults, children) {
  if (!adults && !children) {
    return true
  }

  if (!hotel.room_types || hotel.room_types.length === 0) {
    return true
  }

  return hotel.room_types.some((roomType) => {
    const adultCapacity = Number(roomType.capacity_adults)
    const childrenCapacity = Number(roomType.capacity_children)

    return adultCapacity >= adults && childrenCapacity >= children
  })
}

function getRoomTypes(hotel) {
  return hotel.room_types || []
}

function roomTypeMatchesCapacity(roomType, adults, children) {
  const adultCapacity = Number(roomType.capacity_adults)
  const childrenCapacity = Number(roomType.capacity_children)

  return adultCapacity >= adults && childrenCapacity >= children
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

function isAvailabilityOpen(dayAvailability, nights) {
  const unavailableStatuses = ['unavailable', 'blocked', 'closed']
  const status = dayAvailability.status?.toLowerCase()
  const minStayNights = Number(dayAvailability.min_stay_nights) || 0

  return (
    Number(dayAvailability.available_units) > 0 &&
    !unavailableStatuses.includes(status) &&
    minStayNights <= nights
  )
}

function roomTypeIsAvailable(roomTypeId, availabilityByRoomType, stayDates) {
  if (stayDates.length === 0) {
    return true
  }

  const roomTypeAvailability = availabilityByRoomType[roomTypeId] || []
  const availabilityByDate = new Map(
    roomTypeAvailability.map((dayAvailability) => [
      dayAvailability.date,
      dayAvailability,
    ]),
  )

  return stayDates.every((date) => {
    const dayAvailability = availabilityByDate.get(date)

    return dayAvailability && isAvailabilityOpen(dayAvailability, stayDates.length)
  })
}

function hotelMatchesAvailability(
  hotel,
  adults,
  children,
  availabilityByRoomType,
  stayDates,
) {
  if (stayDates.length === 0) {
    return true
  }

  const roomTypes = getRoomTypes(hotel)

  if (roomTypes.length === 0) {
    return false
  }

  return roomTypes.some((roomType) => {
    return (
      roomTypeMatchesCapacity(roomType, adults, children) &&
      roomTypeIsAvailable(roomType.id, availabilityByRoomType, stayDates)
    )
  })
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
  selectedRegion,
  selectedCity,
  selectedRating,
  selectedServices,
  maxPrice,
  searchText,
  adults,
  children,
  availabilityByRoomType,
  stayDates,
) {
  return hotels.filter((hotel) => {
    const searchMatches = hotelMatchesSearch(hotel, searchText)
    const capacityMatches = hotelMatchesCapacity(hotel, adults, children)
    const availabilityMatches = hotelMatchesAvailability(
      hotel,
      adults,
      children,
      availabilityByRoomType,
      stayDates,
    )
    const regionMatches =
      selectedRegion === 'all' || hotel.location?.region === selectedRegion
    const cityMatches =
      selectedCity === 'all' || hotel.location?.city === selectedCity
    const ratingMatches =
      selectedRating === 'all' ||
      Number(hotel.stars) === Number(selectedRating)
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

    return (
      searchMatches &&
      capacityMatches &&
      availabilityMatches &&
      regionMatches &&
      cityMatches &&
      ratingMatches &&
      priceMatches &&
      servicesMatch
    )
  })
}

export default function HotelsPage() {
  const [searchParams] = useSearchParams()
  const urlSearchText = searchParams.get('destination') || ''
  const adults = Number(searchParams.get('adults')) || 0
  const children = Number(searchParams.get('children')) || 0
  const checkIn = searchParams.get('check_in') || ''
  const checkOut = searchParams.get('check_out') || ''
  const [hotels, setHotels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [availabilityByRoomType, setAvailabilityByRoomType] = useState({})
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [selectedServices, setSelectedServices] = useState([])
  const [maxPrice, setMaxPrice] = useState(500)
  const [filterSearchText, setFilterSearchText] = useState(urlSearchText)
  const { canUseFavorites, favoriteIds, toggleFavorite } = useCustomerFavorites()

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

  useEffect(() => {
    const stayDates = getStayDates(checkIn, checkOut)

    if (stayDates.length === 0 || hotels.length === 0) {
      return
    }

    const roomTypeIds = [
      ...new Set(
        hotels
          .flatMap((hotel) => getRoomTypes(hotel))
          .map((roomType) => roomType.id)
          .filter(Boolean),
      ),
    ]

    let shouldIgnoreResponse = false

    Promise.resolve()
      .then(() => {
        if (shouldIgnoreResponse) {
          return []
        }

        setIsAvailabilityLoading(true)
        setAvailabilityError('')

        return Promise.all(
          roomTypeIds.map((roomTypeId) => {
            return getRoomTypeAvailability(roomTypeId, {
              from: checkIn,
              to: checkOut,
            }).then((availability) => [roomTypeId, availability])
          }),
        )
      })
      .then((availabilityEntries) => {
        if (shouldIgnoreResponse) {
          return
        }

        setAvailabilityByRoomType(Object.fromEntries(availabilityEntries))
      })
      .catch(() => {
        if (shouldIgnoreResponse) {
          return
        }

        setAvailabilityByRoomType({})
        setAvailabilityError('No se pudo comprobar la disponibilidad por fechas.')
      })
      .finally(() => {
        if (!shouldIgnoreResponse) {
          setIsAvailabilityLoading(false)
        }
      })

    return () => {
      shouldIgnoreResponse = true
    }
  }, [checkIn, checkOut, hotels])

  const availableRegions = getAvailableRegions(hotels)
  const availableCities = getAvailableCities(hotels, selectedRegion)
  const availableServices = getAvailableServices(hotels)
  const highestPrice = getHighestPrice(hotels)
  const stayDates = getStayDates(checkIn, checkOut)
  const shouldFilterByAvailability =
    stayDates.length > 0 && !isAvailabilityLoading && !availabilityError
  const filteredHotels = filterHotels(
    hotels,
    selectedRegion,
    selectedCity,
    selectedRating,
    selectedServices,
    maxPrice,
    filterSearchText,
    adults,
    children,
    shouldFilterByAvailability ? availabilityByRoomType : {},
    shouldFilterByAvailability ? stayDates : [],
  )
  const sortedHotels = sortHotels(filteredHotels, sortBy)
  const totalPages = Math.ceil(sortedHotels.length / HOTELS_PER_PAGE)
  const firstHotelIndex = (currentPage - 1) * HOTELS_PER_PAGE
  const currentHotels = sortedHotels.slice(
    firstHotelIndex,
    firstHotelIndex + HOTELS_PER_PAGE,
  )

  function handleSortChange(value) {
    setSortBy(value)
    setIsSortMenuOpen(false)
    setCurrentPage(1)
  }

  function handleRegionChange(event) {
    setSelectedRegion(event.target.value)
    setSelectedCity('all')
    setCurrentPage(1)
  }

  function handleCityChange(event) {
    setSelectedCity(event.target.value)
    setCurrentPage(1)
  }

  function handleFilterSearchChange(event) {
    setFilterSearchText(event.target.value)
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
    setSelectedRegion('all')
    setSelectedCity('all')
    setSelectedRating('all')
    setSelectedServices([])
    setFilterSearchText('')
    setMaxPrice(highestPrice)
    setCurrentPage(1)
  }

  function scrollToPageTop() {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1)
    scrollToPageTop()
  }

  function goToNextPage() {
    setCurrentPage((page) => page + 1)
    scrollToPageTop()
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
            {(urlSearchText || adults > 0 || children > 0 || checkIn || checkOut) && (
              <p className="mt-3 text-sm font-semibold text-secondary">
                Búsqueda:{' '}
                {urlSearchText && <span>{urlSearchText}</span>}
                {(adults > 0 || children > 0) && (
                  <span>
                    {' '}
                    · {adults || 0} adultos, {children || 0} niños
                  </span>
                )}
                {(checkIn || checkOut) && (
                  <span>
                    {' '}
                    · {checkIn || 'sin entrada'} - {checkOut || 'sin salida'}
                  </span>
                )}
              </p>
            )}
          </div>

          <div
            className="relative flex items-center gap-3 text-sm font-semibold text-secondary"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsSortMenuOpen(false)
              }
            }}
          >
            <span>Ordenar por</span>
            <button
              className="flex min-w-48 cursor-pointer items-center justify-between gap-3 rounded-lg border border-outline-variant bg-surface px-3 py-2 text-left text-on-surface outline-none transition hover:border-primary focus:border-primary"
              onClick={() => setIsSortMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <span>
                {sortBy === 'rating' ? 'Mejor valoración' : 'Precio más bajo'}
              </span>
              <FaChevronDown
                className={`h-3 w-3 transition-transform ${
                  isSortMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isSortMenuOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_12px_30px_rgba(19,27,46,0.18)]">
                <button
                  className="block w-full cursor-pointer px-4 py-3 text-left text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                  onClick={() => handleSortChange('rating')}
                  type="button"
                >
                  Mejor valoración
                </button>
                <button
                  className="block w-full cursor-pointer px-4 py-3 text-left text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                  onClick={() => handleSortChange('price')}
                  type="button"
                >
                  Precio más bajo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="w-full shrink-0 md:sticky md:top-28 md:max-h-[calc(100vh-8rem)] md:w-72 md:self-start md:overflow-y-auto">
            <div className="space-y-8 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
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
                  htmlFor="hotel-search-filter"
                >
                  Hotel o destino
                </label>
                <input
                  className="mt-3 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-on-surface outline-none transition placeholder:text-secondary/70 focus:border-primary"
                  id="hotel-search-filter"
                  onChange={handleFilterSearchChange}
                  placeholder="Nombre, ciudad o destino"
                  type="search"
                  value={filterSearchText}
                />
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
                  htmlFor="region-filter"
                >
                  Comunidad autónoma
                </label>
                <select
                  className="mt-3 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-on-surface outline-none focus:border-primary"
                  id="region-filter"
                  onChange={handleRegionChange}
                  value={selectedRegion}
                >
                  <option value="all">Todas las comunidades</option>
                  {availableRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="text-sm font-bold text-on-surface"
                  htmlFor="city-filter"
                >
                  Ciudad
                </label>
                <select
                  className="mt-3 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-on-surface outline-none focus:border-primary"
                  id="city-filter"
                  onChange={handleCityChange}
                  value={selectedCity}
                >
                  <option value="all">Todas las ciudades</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-bold text-on-surface">
                  Estrellas del hotel
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

            {stayDates.length > 0 && availabilityError && (
              <p className="mb-6 rounded-xl border border-error bg-error-container p-4 text-sm font-semibold text-error">
                {availabilityError}
              </p>
            )}

            {stayDates.length > 0 && isAvailabilityLoading && (
              <p className="mb-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm font-semibold text-secondary">
                Comprobando disponibilidad para las fechas seleccionadas...
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
                    <HotelListCard
                      hotel={hotel}
                      isFavorite={favoriteIds.has(Number(hotel.id))}
                      key={hotel.id}
                      onFavoriteToggle={canUseFavorites ? toggleFavorite : null}
                    />
                  ))}
                </div>
              )}
          </div>
        </div>

        {!isLoading &&
          !error &&
          hotels.length > 0 &&
          sortedHotels.length > 0 &&
          totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3 md:ml-80">
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
      </section>
    </Layout>
  )
}
