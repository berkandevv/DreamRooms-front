import { getAuthHeaders } from './authService'

const API_BASE_URL = 'http://localhost:8000/api/customer'

async function parseResponse(response) {
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo gestionar el favorito')
  }

  return result
}

export async function getCustomerFavorites() {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  })
  const result = await parseResponse(response)

  return result.data || []
}

export async function addCustomerFavorite(hotelId) {
  const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/favorite`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  })

  return parseResponse(response)
}

export async function removeCustomerFavorite(hotelId) {
  const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/favorite`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'DELETE',
  })

  return parseResponse(response)
}
