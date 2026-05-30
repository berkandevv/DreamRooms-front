import { getAuthHeaders } from './authService'
import { API_BASE_URL } from '../config/api'

const API_URL = `${API_BASE_URL}/customer/bookings`

// Obtiene el mensaje más útil de una respuesta con error
function getErrorMessage(result, fallbackMessage) {
  const validationMessage = Object.values(result.errors || {})
    .flat()
    .find(Boolean)

  return validationMessage || result.message || fallbackMessage
}

// Obtiene todas las reservas del cliente autenticado
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

// Obtiene el detalle de una reserva concreta del cliente
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

// Crea una nueva reserva para el cliente
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
    throw new Error(getErrorMessage(result, 'No se pudo crear la reserva'))
  }

  return result.data
}

// Publica una reseña de una reserva completada
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
    throw new Error(getErrorMessage(result, 'No se pudo publicar el comentario'))
  }

  return result.data
}

// Cancela una reserva del cliente autenticado
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
