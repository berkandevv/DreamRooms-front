import { getAuthHeaders } from './authService'

const API_URL = 'http://localhost:8000/api/customer/bookings'

export async function getCustomerBookings() {
  const response = await fetch(API_URL, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudieron cargar tus reservas')
  }

  return result.data
}

export async function getCustomerBooking(bookingId) {
  const response = await fetch(`${API_URL}/${bookingId}`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo cargar la reserva')
  }

  return result.data
}

export async function createCustomerBooking(bookingData) {
  const response = await fetch(API_URL, {
    body: JSON.stringify(bookingData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo crear la reserva')
  }

  return result.data
}

export async function createCustomerBookingReview(bookingId, reviewData) {
  const response = await fetch(`${API_URL}/${bookingId}/review`, {
    body: JSON.stringify(reviewData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo publicar el comentario')
  }

  return result.data
}

export async function cancelCustomerBooking(bookingId) {
  const response = await fetch(`${API_URL}/${bookingId}/cancel`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo cancelar la reserva')
  }

  return result.data
}
