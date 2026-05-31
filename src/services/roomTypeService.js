import { API_BASE_URL } from '../config/api'
import { buildQuery } from '../utils/buildQuery'
import { requestJson } from './apiClient'

const ROOM_TYPES_API_URL = `${API_BASE_URL}/room-types`

// Obtiene la disponibilidad pública de un tipo de habitación
export async function getRoomTypeAvailability(roomTypeId, params = {}) {
  const result = await requestJson(
    `${ROOM_TYPES_API_URL}/${roomTypeId}/availability${buildQuery(params)}`,
    {},
    'No se pudo cargar la disponibilidad',
  )

  return result.data
}

// Obtiene el presupuesto de una estancia para un tipo de habitación
export async function getRoomTypeAvailabilityQuote(roomTypeId, params = {}) {
  const result = await requestJson(
    `${ROOM_TYPES_API_URL}/${roomTypeId}/availability/quote${buildQuery(params)}`,
    {},
    'No se pudo comprobar la estancia',
  )

  return result.data
}
