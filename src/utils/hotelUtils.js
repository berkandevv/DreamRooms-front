// Obtiene los datos de la imagen principal de un hotel
export function getHotelImage(hotel) {
  return {
    alt: hotel.cover_image?.alt_text || hotel.name,
    url: hotel.cover_image?.url,
  }
}

// Obtiene la ubicación principal de un hotel
export function getHotelLocation(hotel) {
  return {
    address: hotel.location?.address || hotel.contact?.address,
    city: hotel.location?.city || 'Ciudad no disponible',
    country: hotel.location?.country || 'País no disponible',
  }
}

// Convierte la categoría del hotel en estrellas visibles
export function getHotelStars(stars) {
  return '★'.repeat(Number(stars) || 0) || 'Sin estrellas'
}
