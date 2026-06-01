import { getIntegerSquareMeters } from '../../../utils/formatSquareMeters'

export const initialRoomTypeForm = {
  name: '',
  description: '',
  capacity_adults: 2,
  capacity_children: 0,
  size_m2: '',
  bed_type: '',
  base_price: '',
  free_cancellation_hours: '',
  currency: 'EUR',
  image: null,
  image_alt_text: '',
  image_is_cover: true,
  service_ids: [],
  total_units: 1,
  status: 'active',
}

// Prepara los datos de una habitación para enviarlos a la API
export function buildRoomTypePayload(formData) {
  const {
    image,
    image_alt_text,
    image_is_cover,
    ...roomTypeData
  } = formData

  void image
  void image_alt_text
  void image_is_cover

  return {
    ...roomTypeData,
    base_price: Number(roomTypeData.base_price),
    capacity_adults: Number(roomTypeData.capacity_adults),
    capacity_children: Number(roomTypeData.capacity_children),
    free_cancellation_hours:
      roomTypeData.free_cancellation_hours === ''
        ? null
        : Number(roomTypeData.free_cancellation_hours),
    service_ids: roomTypeData.service_ids.map(Number),
    size_m2: getIntegerSquareMeters(roomTypeData.size_m2),
    total_units: Number(roomTypeData.total_units),
  }
}

// Convierte los datos de una habitación al formato del formulario
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
    free_cancellation_hours: roomType.free_cancellation_hours ?? '',
    image: null,
    image_alt_text: '',
    image_is_cover: true,
    name: roomType.name || '',
    service_ids: (roomType.services || []).map((service) => service.id),
    size_m2: getIntegerSquareMeters(roomType.size_m2),
    status: roomType.status || 'active',
    total_units: roomType.total_units || 1,
  }
}
