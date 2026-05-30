const API_BASE_URL = 'http://localhost:8000/api/room-types'

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

// Obtiene la disponibilidad pública de un tipo de habitación
export async function getRoomTypeAvailability(roomTypeId, params = {}) {
  const response = await fetch(
    `${API_BASE_URL}/${roomTypeId}/availability${buildQuery(params)}`,
  )
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo cargar la disponibilidad')
  }

  return result.data
}
