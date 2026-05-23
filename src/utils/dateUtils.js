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

export function getIsoDate(date) {
  if (!date) {
    return ''
  }

  return new Date(`${date}T00:00:00Z`).toISOString()
}

export function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return 0
  }

  const startDate = new Date(`${checkIn}T00:00:00Z`)
  const endDate = new Date(`${checkOut}T00:00:00Z`)
  const difference = endDate.getTime() - startDate.getTime()

  if (Number.isNaN(difference) || difference <= 0) {
    return 0
  }

  return Math.ceil(difference / 86400000)
}
