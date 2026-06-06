import { getAuthHeaders } from './authService'
import { API_BASE_URL } from '../config/api'
import { requestJson } from './apiClient'

const API_URL = `${API_BASE_URL}/customer/bookings`

// Obtiene todas las reservas del cliente autenticado
export async function getCustomerBookings() {
  const result = await requestJson(API_URL, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  }, 'No se pudieron cargar tus reservas')

  return result.data
}

// Obtiene el detalle de una reserva concreta del cliente
export async function getCustomerBooking(bookingId) {
  const result = await requestJson(`${API_URL}/${bookingId}`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  }, 'No se pudo cargar la reserva')

  return result.data
}

// Crea una nueva reserva para el cliente
export async function createCustomerBooking(bookingData) {
  const result = await requestJson(API_URL, {
    body: JSON.stringify(bookingData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  }, 'No se pudo crear la reserva')

  return result.data
}

// Publica una reseña de una reserva completada
export async function createCustomerBookingReview(bookingId, reviewData) {
  // Se envía como FormData para poder adjuntar la foto opcional del comentario
  const formData = new FormData()
  formData.append('rating', reviewData.rating)

  if (reviewData.comment) {
    formData.append('comment', reviewData.comment)
  }

  if (reviewData.image) {
    formData.append('image', reviewData.image)
  }

  const result = await requestJson(`${API_URL}/${bookingId}/review`, {
    body: formData,
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  }, 'No se pudo enviar el comentario')

  return result.data
}

// Cancela una reserva del cliente autenticado
export async function cancelCustomerBooking(bookingId) {
  const result = await requestJson(`${API_URL}/${bookingId}/cancel`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  }, 'No se pudo cancelar la reserva')

  return result.data
}
