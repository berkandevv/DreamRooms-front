import { getAuthHeaders } from './authService'
import { API_BASE_URL } from '../config/api'
import { requestJson } from './apiClient'

const CUSTOMER_API_URL = `${API_BASE_URL}/customer`

// Obtiene los hoteles favoritos del cliente autenticado
export async function getCustomerFavorites() {
  const result = await requestJson(`${CUSTOMER_API_URL}/favorites`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  }, 'No se pudo gestionar el favorito')

  return result.data || []
}

// Añade un hotel a los favoritos del cliente
export async function addCustomerFavorite(hotelId) {
  return requestJson(`${CUSTOMER_API_URL}/hotels/${hotelId}/favorite`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  }, 'No se pudo gestionar el favorito')
}

// Elimina un hotel de los favoritos del cliente
export async function removeCustomerFavorite(hotelId) {
  return requestJson(`${CUSTOMER_API_URL}/hotels/${hotelId}/favorite`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'DELETE',
  }, 'No se pudo gestionar el favorito')
}
