export const initialHotelForm = {
  name: '',
  description: '',
  stars: 3,
  status: 'draft',
  country: '',
  region: '',
  city: '',
  address: '',
  postal_code: '',
  email: '',
  phone: '',
  check_in_time: '15:00',
  check_out_time: '11:00',
  tax_rate_percent: 0,
  discount_rate_percent: 0,
  currency: 'EUR',
  currency_symbol: '€',
  image: null,
  image_alt_text: '',
  image_is_cover: true,
  pets_allowed: false,
  service_ids: [],
  smoking_allowed: false,
}

// Prepara los datos de un hotel para enviarlos a la API
export function buildHotelPayload(formData) {
  return {
    name: formData.name,
    description: formData.description,
    stars: Number(formData.stars),
    status: formData.status,
    location: {
      address: formData.address,
      city: formData.city,
      country: formData.country,
      postal_code: formData.postal_code,
      region: formData.region,
    },
    contact: {
      address: formData.address,
      email: formData.email,
      phone: formData.phone,
    },
    check_in_time: formData.check_in_time,
    check_out_time: formData.check_out_time,
    pricing: {
      currency: formData.currency,
      currency_symbol: formData.currency_symbol,
      discount_rate_percent: Number(formData.discount_rate_percent),
      tax_rate_percent: Number(formData.tax_rate_percent),
    },
    pets_allowed: formData.pets_allowed,
    service_ids: formData.service_ids.map(Number),
    smoking_allowed: formData.smoking_allowed,
  }
}

// Convierte los datos de un hotel al formato del formulario
export function mapHotelToForm(hotel) {
  if (!hotel) {
    return initialHotelForm
  }

  return {
    address: hotel.location?.address || hotel.contact?.address || '',
    check_in_time: hotel.check_in_time || '15:00',
    check_out_time: hotel.check_out_time || '11:00',
    city: hotel.location?.city || '',
    country: hotel.location?.country || '',
    currency: hotel.pricing?.currency || hotel.currency || 'EUR',
    currency_symbol: hotel.pricing?.currency_symbol || hotel.currency_symbol || '€',
    description: hotel.description || '',
    discount_rate_percent: hotel.pricing?.discount_rate_percent || 0,
    email: hotel.contact?.email || '',
    image: null,
    image_alt_text: '',
    image_is_cover: true,
    name: hotel.name || '',
    pets_allowed: Boolean(hotel.pets_allowed),
    phone: hotel.contact?.phone || '',
    postal_code: hotel.location?.postal_code || '',
    region: hotel.location?.region || '',
    service_ids: (hotel.services || []).map((service) => service.id),
    smoking_allowed: Boolean(hotel.smoking_allowed),
    stars: hotel.stars || 3,
    status: hotel.status || 'draft',
    tax_rate_percent: hotel.pricing?.tax_rate_percent || 0,
  }
}
