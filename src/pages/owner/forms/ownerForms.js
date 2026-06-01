export {
  buildAvailabilityItems,
  initialAvailabilityForm,
} from './availabilityForm'
export {
  buildHotelPayload,
  initialHotelForm,
  mapHotelToForm,
} from './hotelForm'
export {
  buildRoomTypePayload,
  initialRoomTypeForm,
  mapRoomTypeToForm,
} from './roomTypeForm'

export const bookingStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
export const paymentStatuses = ['pending', 'paid', 'failed', 'refunded']

// Prepara una imagen para subirla a la API
export function buildImageFormData(formData, fallbackAltText) {
  if (!formData.image) {
    return null
  }

  const imageFormData = new FormData()

  imageFormData.append('image', formData.image)
  imageFormData.append('alt_text', formData.image_alt_text || fallbackAltText)
  imageFormData.append('is_cover', formData.image_is_cover ? 'true' : 'false')

  return imageFormData
}
