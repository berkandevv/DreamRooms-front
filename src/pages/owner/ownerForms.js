export const bookingStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
export const paymentStatuses = ['pending', 'partial', 'paid', 'failed', 'refunded']

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
  pets_allowed: false,
  smoking_allowed: false,
}

export const initialRoomTypeForm = {
  name: '',
  description: '',
  capacity_adults: 2,
  capacity_children: 0,
  size_m2: '',
  bed_type: '',
  base_price: '',
  currency: 'EUR',
  total_units: 1,
  status: 'active',
}

export const initialAvailabilityForm = {
  from: '',
  to: '',
  available_units: 1,
  price: '',
  currency: 'EUR',
  status: 'open',
  min_stay_nights: 1,
}

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
    smoking_allowed: formData.smoking_allowed,
  }
}

export function buildRoomTypePayload(formData) {
  return {
    ...formData,
    base_price: Number(formData.base_price),
    capacity_adults: Number(formData.capacity_adults),
    capacity_children: Number(formData.capacity_children),
    total_units: Number(formData.total_units),
  }
}

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
    name: hotel.name || '',
    pets_allowed: Boolean(hotel.pets_allowed),
    phone: hotel.contact?.phone || '',
    postal_code: hotel.location?.postal_code || '',
    region: hotel.location?.region || '',
    smoking_allowed: Boolean(hotel.smoking_allowed),
    stars: hotel.stars || 3,
    status: hotel.status || 'draft',
    tax_rate_percent: hotel.pricing?.tax_rate_percent || 0,
  }
}

export function mapRoomTypeToForm(roomType) {
  if (!roomType) {
    return initialRoomTypeForm
  }

  return {
    base_price: roomType.base_price || '',
    bed_type: roomType.bed_type || '',
    capacity_adults: roomType.capacity_adults || 2,
    capacity_children: roomType.capacity_children || 0,
    currency: roomType.currency || 'EUR',
    description: roomType.description || '',
    name: roomType.name || '',
    size_m2: roomType.size_m2 || '',
    status: roomType.status || 'active',
    total_units: roomType.total_units || 1,
  }
}

export function buildAvailabilityItems(formData) {
  const startDate = new Date(`${formData.from}T00:00:00`)
  const endDate = new Date(`${formData.to}T00:00:00`)
  const items = []

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate < startDate
  ) {
    return items
  }

  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    items.push({
      available_units: Number(formData.available_units),
      currency: formData.currency,
      date: currentDate.toISOString().slice(0, 10),
      min_stay_nights: Number(formData.min_stay_nights),
      price: Number(formData.price),
      status: formData.status,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return items
}
