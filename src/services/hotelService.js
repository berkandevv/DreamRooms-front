import { API_BASE_URL } from '../config/api'
import { requestJson } from './apiClient'

const API_URL = `${API_BASE_URL}/hotels`

// Obtiene el listado público de hoteles
export async function getHotels() {
  const result = await requestJson(API_URL, {}, 'No se pudieron cargar los hoteles')

  return result.data
}

// Obtiene el detalle público de un hotel por su slug
export async function getHotelBySlug(slug) {
  const result = await requestJson(
    `${API_URL}/${slug}`,
    {},
    'No se pudo cargar el detalle del hotel',
  )

  return result.data
}

// Obtiene las reseñas públicas de un hotel
export async function getHotelReviews(slug) {
  const result = await requestJson(
    `${API_URL}/${slug}/reviews`,
    {},
    'No se pudieron cargar las reseñas',
  )

  return result.data
}
