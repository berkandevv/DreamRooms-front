export const initialAvailabilityForm = {
  from: '',
  to: '',
  available_units: 1,
  price: '',
  currency: 'EUR',
  status: 'open',
  min_stay_nights: 1,
}

// Crea los registros de disponibilidad para un rango de fechas
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
