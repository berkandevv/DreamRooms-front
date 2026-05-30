import { getAuthHeaders } from './authService'
import { API_BASE_URL } from '../config/api'

const CUSTOMER_API_URL = `${API_BASE_URL}/customer`

// Valida y transforma una respuesta de favoritos
async function parseResponse(response) {
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo gestionar el favorito')
  }

  return result
}

// Obtiene los hoteles favoritos del cliente autenticado
export async function getCustomerFavorites() {
  const response = await fetch(`${CUSTOMER_API_URL}/favorites`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  })
  const result = await parseResponse(response)

  return result.data || []
}

// Añade un hotel a los favoritos del cliente
export async function addCustomerFavorite(hotelId) {
  const response = await fetch(`${CUSTOMER_API_URL}/hotels/${hotelId}/favorite`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  })

  return parseResponse(response)
}

// Elimina un hotel de los favoritos del cliente
export async function removeCustomerFavorite(hotelId) {
  const response = await fetch(`${CUSTOMER_API_URL}/hotels/${hotelId}/favorite`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'DELETE',
  })

  return parseResponse(response)
}
