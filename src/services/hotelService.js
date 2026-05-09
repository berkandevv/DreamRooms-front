const API_URL = 'http://localhost:8000/api/hotels'

export async function getHotels() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los hoteles')
  }

  const result = await response.json()

  return result.data
}
