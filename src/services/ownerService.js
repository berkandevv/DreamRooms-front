import { getAuthHeaders } from './authService'
import { API_BASE_URL } from '../config/api'
import { buildQuery } from '../utils/buildQuery'
import { requestJson } from './apiClient'

const OWNER_API_URL = `${API_BASE_URL}/owner`

// Centraliza las peticiones privadas del panel de propietario
async function requestOwner(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const result = await requestJson(`${OWNER_API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...getAuthHeaders(),
      ...options.headers,
    },
  }, 'No se pudo completar la operación')

  return result.data
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

// Sube una imagen para un hotel
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

// Sube una imagen para un tipo de habitación
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
