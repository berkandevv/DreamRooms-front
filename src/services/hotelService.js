const API_URL = 'http://localhost:8000/api/hotels'

export async function getHotels() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los hoteles')
  }

  const result = await response.json()

  return result.data
}

export async function getHotelBySlug(slug) {
  const response = await fetch(`${API_URL}/${slug}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar el detalle del hotel')
  }

  const result = await response.json()

  return result.data
}

export async function getHotelReviews(slug) {
  const response = await fetch(`${API_URL}/${slug}/reviews`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las reseñas')
  }

  const result = await response.json()

  return result.data
}
