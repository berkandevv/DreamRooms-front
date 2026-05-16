import { getAuthHeaders } from './authService'

const API_BASE_URL = 'http://localhost:8000/api/owner'

async function requestOwner(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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

export function getOwnerHotels() {
  return requestOwner('/hotels')
}

export function getOwnerHotel(hotelId) {
  return requestOwner(`/hotels/${hotelId}`)
}

export function createOwnerHotel(hotelData) {
  return requestOwner('/hotels', {
    body: JSON.stringify(hotelData),
    method: 'POST',
  })
}

export function updateOwnerHotel(hotelId, hotelData) {
  return requestOwner(`/hotels/${hotelId}`, {
    body: JSON.stringify(hotelData),
    method: 'PUT',
  })
}

export function getOwnerBookings(filters = {}) {
  return requestOwner(`/bookings${buildQuery(filters)}`)
}

export function getOwnerBooking(bookingId) {
  return requestOwner(`/bookings/${bookingId}`)
}

export function updateOwnerBookingStatus(bookingId, status) {
  return requestOwner(`/bookings/${bookingId}/status`, {
    body: JSON.stringify({ status }),
    method: 'PUT',
  })
}

export function createOwnerBookingPayment(bookingId, paymentData) {
  return requestOwner(`/bookings/${bookingId}/payments`, {
    body: JSON.stringify(paymentData),
    method: 'POST',
  })
}

export function getOwnerRoomTypes(hotelId) {
  return requestOwner(`/hotels/${hotelId}/room-types`)
}

export function getOwnerRoomType(roomTypeId) {
  return requestOwner(`/room-types/${roomTypeId}`)
}

export function createOwnerRoomType(hotelId, roomTypeData) {
  return requestOwner(`/hotels/${hotelId}/room-types`, {
    body: JSON.stringify(roomTypeData),
    method: 'POST',
  })
}

export function updateOwnerRoomType(roomTypeId, roomTypeData) {
  return requestOwner(`/room-types/${roomTypeId}`, {
    body: JSON.stringify(roomTypeData),
    method: 'PUT',
  })
}

export function getOwnerRoomTypeAvailability(roomTypeId, from, to) {
  return requestOwner(
    `/room-types/${roomTypeId}/availability${buildQuery({ from, to })}`,
  )
}

export function bulkUpdateOwnerAvailability(roomTypeId, items) {
  return requestOwner(`/room-types/${roomTypeId}/availability/bulk`, {
    body: JSON.stringify({ items }),
    method: 'POST',
  })
}

export function getOwnerServices(scope = '') {
  return requestOwner(`/services${buildQuery({ scope })}`)
}
