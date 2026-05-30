import { formatServices } from '../../utils/formatServices'

// Ordena los hoteles según el criterio seleccionado
export function sortHotels(hotels, sortBy) {
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

// Obtiene las regiones disponibles sin duplicados
export function getAvailableRegions(hotels) {
  const regions = hotels.map((hotel) => hotel.location?.region).filter(Boolean)

  return [...new Set(regions)].toSorted()
}

// Obtiene las ciudades disponibles para una región
export function getAvailableCities(hotels, selectedRegion) {
  const cities = hotels
    .filter((hotel) => {
      return selectedRegion === 'all' || hotel.location?.region === selectedRegion
    })
    .map((hotel) => hotel.location?.city)
    .filter(Boolean)

  return [...new Set(cities)].toSorted()
}

// Obtiene los servicios disponibles sin duplicados
export function getAvailableServices(hotels) {
  const services = hotels.flatMap((hotel) => formatServices(hotel.services))
  const servicesByName = new Map()

  services.forEach((service) => {
    servicesByName.set(normalizeText(service), service)
  })

  return [...servicesByName.values()].toSorted()
}

// Obtiene el precio máximo disponible en el catálogo
export function getHighestPrice(hotels) {
  const prices = hotels.map((hotel) => Number(hotel.starting_price)).filter(Boolean)

  return prices.length === 0 ? 500 : Math.ceil(Math.max(...prices))
}

// Obtiene los tipos de habitación conocidos de un hotel
export function getRoomTypes(hotel, roomTypesByHotelId = {}) {
  return hotel.room_types || roomTypesByHotelId[hotel.id] || []
}

// Filtra los hoteles según los criterios seleccionados
export function filterHotels({
  adults,
  availabilityQuoteByRoomType,
  children,
  hotels,
  maxPrice,
  roomTypesByHotelId,
  searchText,
  selectedCity,
  selectedRating,
  selectedRegion,
  selectedServices,
  stayDates,
}) {
  return hotels.filter((hotel) => {
    const hotelPrice = Number(hotel.starting_price)
    const hotelServices = formatServices(hotel.services).map(normalizeText)

    return (
      hotelMatchesSearch(hotel, searchText) &&
      hotelMatchesCapacity(hotel, adults, children, roomTypesByHotelId) &&
      hotelMatchesAvailability(
        hotel,
        adults,
        children,
        availabilityQuoteByRoomType,
        stayDates,
        roomTypesByHotelId,
      ) &&
      (selectedRegion === 'all' || hotel.location?.region === selectedRegion) &&
      (selectedCity === 'all' || hotel.location?.city === selectedCity) &&
      (selectedRating === 'all' ||
        Number(hotel.stars) === Number(selectedRating)) &&
      (!hotelPrice || hotelPrice <= maxPrice) &&
      (selectedServices.length === 0 ||
        selectedServices.every((service) => {
          return hotelServices.includes(normalizeText(service))
        }))
    )
  })
}

// Normaliza un texto para compararlo sin acentos
function normalizeText(text) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// Convierte un valor a número usando un valor alternativo
function getNumericValue(value, fallback = 0) {
  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : fallback
}

// Comprueba si un hotel coincide con el texto buscado
function hotelMatchesSearch(hotel, searchText) {
  if (!searchText) {
    return true
  }

  const searchableText = [
    hotel.name,
    hotel.location?.city,
    hotel.location?.region,
    hotel.location?.country,
  ]
    .filter(Boolean)
    .map(normalizeText)
    .join(' ')

  return searchableText.includes(normalizeText(searchText))
}

// Comprueba si un hotel tiene capacidad para los huéspedes
function hotelMatchesCapacity(hotel, adults, children, roomTypesByHotelId) {
  if (!adults && !children) {
    return true
  }

  const roomTypes = getRoomTypes(hotel, roomTypesByHotelId)

  if (roomTypes.length === 0) {
    return true
  }

  return roomTypes.some((roomType) => {
    return roomTypeMatchesCapacity(roomType, adults, children)
  })
}

// Comprueba si una habitación tiene capacidad para los huéspedes
function roomTypeMatchesCapacity(roomType, adults, children) {
  return (
    getNumericValue(roomType.capacity_adults) >= adults &&
    getNumericValue(roomType.capacity_children) >= children
  )
}

// Comprueba si un hotel tiene habitaciones disponibles
function hotelMatchesAvailability(
  hotel,
  adults,
  children,
  availabilityQuoteByRoomType,
  stayDates,
  roomTypesByHotelId,
) {
  if (stayDates.length === 0) {
    return true
  }

  return getRoomTypes(hotel, roomTypesByHotelId).some((roomType) => {
    return (
      roomTypeMatchesCapacity(roomType, adults, children) &&
      availabilityQuoteByRoomType[roomType.id]?.is_available === true
    )
  })
}
