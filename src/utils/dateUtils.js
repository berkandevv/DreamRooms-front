// Formatea una fecha para mostrarla en castellano
export function formatDate(date, fallback = '-') {
  if (!date) {
    return fallback
  }

  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Formatea una fecha y hora para mostrarla en castellano
export function formatDateTime(date, fallback = '-') {
  if (!date) {
    return fallback
  }

  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Convierte una fecha de formulario al formato ISO
export function getIsoDate(date) {
  if (!date) {
    return ''
  }

  return new Date(`${date}T00:00:00Z`).toISOString()
}

// Obtiene todas las noches incluidas en una estancia
export function getStayDates(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return []
  }

  const startDate = new Date(`${checkIn}T00:00:00Z`)
  const endDate = new Date(`${checkOut}T00:00:00Z`)

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate <= startDate
  ) {
    return []
  }

  const dates = []
  const currentDate = new Date(startDate)

  while (currentDate < endDate) {
    dates.push(currentDate.toISOString().slice(0, 10))
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)
  }

  return dates
}
