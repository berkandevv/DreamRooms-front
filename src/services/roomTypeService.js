const API_BASE_URL = 'http://localhost:8000/api/room-types'

export async function getRoomTypeAvailability(roomTypeId) {
  const response = await fetch(`${API_BASE_URL}/${roomTypeId}/availability`)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo cargar la disponibilidad')
  }

  return result.data
}
