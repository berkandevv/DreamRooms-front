import { getAuthHeaders } from './authService'

const API_BASE_URL = 'http://localhost:8000/api/owner'

// Centraliza las peticiones privadas del panel de propietario
async function requestOwner(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...getAuthHeaders(),
      ...options.headers,
    },
  })
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo completar la operación')
  }

  return result.data
}

// Convierte un objeto de filtros en una query string
function buildQuery(params) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

// Obtiene los hoteles gestionados por el propietario
export function getOwnerHotels() {
  return requestOwner('/hotels')
}

// Obtiene el detalle de un hotel del propietario
export function getOwnerHotel(hotelId) {
  return requestOwner(`/hotels/${hotelId}`)
}

// Crea un nuevo hotel para el propietario
export function createOwnerHotel(hotelData) {
  return requestOwner('/hotels', {
    body: JSON.stringify(hotelData),
    method: 'POST',
  })
}

export function uploadOwnerHotelImage(hotelId, imageData) {
  return requestOwner(`/hotels/${hotelId}/images`, {
    body: imageData,
    method: 'POST',
  })
}

// Actualiza los datos de un hotel del propietario
export function updateOwnerHotel(hotelId, hotelData) {
  return requestOwner(`/hotels/${hotelId}`, {
    body: JSON.stringify(hotelData),
    method: 'PUT',
  })
}

// Obtiene las reservas del propietario aplicando filtros opcionales
export function getOwnerBookings(filters = {}) {
  return requestOwner(`/bookings${buildQuery(filters)}`)
}

// Obtiene el detalle de una reserva del propietario
export function getOwnerBooking(bookingId) {
  return requestOwner(`/bookings/${bookingId}`)
}

// Cambia el estado de una reserva
export function updateOwnerBookingStatus(bookingId, status) {
  return requestOwner(`/bookings/${bookingId}/status`, {
    body: JSON.stringify({ status }),
    method: 'PUT',
  })
}

// Registra un pago manual en una reserva
export function createOwnerBookingPayment(bookingId, paymentData) {
  return requestOwner(`/bookings/${bookingId}/payments`, {
    body: JSON.stringify(paymentData),
    method: 'POST',
  })
}

// Obtiene los tipos de habitación de un hotel
export function getOwnerRoomTypes(hotelId) {
  return requestOwner(`/hotels/${hotelId}/room-types`)
}

// Obtiene el detalle de un tipo de habitación
export function getOwnerRoomType(roomTypeId) {
  return requestOwner(`/room-types/${roomTypeId}`)
}

// Crea un nuevo tipo de habitación para un hotel
export function createOwnerRoomType(hotelId, roomTypeData) {
  return requestOwner(`/hotels/${hotelId}/room-types`, {
    body: JSON.stringify(roomTypeData),
    method: 'POST',
  })
}

export function uploadOwnerRoomTypeImage(roomTypeId, imageData) {
  return requestOwner(`/room-types/${roomTypeId}/images`, {
    body: imageData,
    method: 'POST',
  })
}

// Actualiza un tipo de habitación existente
export function updateOwnerRoomType(roomTypeId, roomTypeData) {
  return requestOwner(`/room-types/${roomTypeId}`, {
    body: JSON.stringify(roomTypeData),
    method: 'PUT',
  })
}

// Obtiene la disponibilidad de un tipo de habitación
export function getOwnerRoomTypeAvailability(roomTypeId, from, to) {
  return requestOwner(
    `/room-types/${roomTypeId}/availability${buildQuery({ from, to })}`,
  )
}

// Actualiza la disponibilidad de varias fechas a la vez
export function bulkUpdateOwnerAvailability(roomTypeId, items) {
  return requestOwner(`/room-types/${roomTypeId}/availability/bulk`, {
    body: JSON.stringify({ items }),
    method: 'POST',
  })
}

// Obtiene los servicios disponibles para hoteles o habitaciones
export function getOwnerServices(scope = '') {
  return requestOwner(`/services${buildQuery({ scope })}`)
}
