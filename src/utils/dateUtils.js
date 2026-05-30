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
