// Añade días a una fecha
function addDays(date, days) {
  const nextDate = new Date(date)

  nextDate.setDate(nextDate.getDate() + days)

  return nextDate
}

// Convierte una fecha al formato usado por los campos date
function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Obtiene la estancia mínima configurada para una fecha
export function getMinStayNights(dayAvailability) {
  return Number(dayAvailability.min_stay_nights) || 1
}

// Obtiene el rango usado en la vista previa de disponibilidad
export function getAvailabilityPreviewRange() {
  const today = new Date()
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  return {
    from: formatDateInput(startDate),
    to: formatDateInput(addDays(startDate, 90)),
  }
}

// Comprueba si dos fechas comparten la misma configuración
function isSameAvailabilityPattern(firstDay, secondDay) {
  return (
    firstDay.status === secondDay.status &&
    Number(firstDay.available_units) === Number(secondDay.available_units) &&
    Number(firstDay.price) === Number(secondDay.price) &&
    getMinStayNights(firstDay) === getMinStayNights(secondDay)
  )
}

// Agrupa fechas consecutivas con la misma configuración
export function getAvailabilityRanges(availabilityDays) {
  if (availabilityDays.length === 0) {
    return []
  }

  const sortedDays = [...availabilityDays].sort((firstDay, secondDay) => {
    return firstDay.date.localeCompare(secondDay.date)
  })
  const ranges = []

  sortedDays.forEach((dayAvailability) => {
    const currentRange = ranges.at(-1)
    const previousDate = currentRange
      ? formatDateInput(addDays(new Date(`${currentRange.to}T00:00:00`), 1))
      : ''

    if (
      currentRange &&
      previousDate === dayAvailability.date &&
      isSameAvailabilityPattern(currentRange.sample, dayAvailability)
    ) {
      currentRange.to = dayAvailability.date
      return
    }

    ranges.push({
      from: dayAvailability.date,
      sample: dayAvailability,
      to: dayAvailability.date,
    })
  })

  return ranges
}

// Comprueba si una fecha modifica la configuración habitual
export function isSpecialAvailabilityDay(dayAvailability, roomType) {
  const basePrice = Number(roomType?.base_price)
  const totalUnits = Number(roomType?.total_units)

  return (
    dayAvailability.status !== 'open' ||
    Number(dayAvailability.min_stay_nights) > 1 ||
    (Number.isFinite(basePrice) && Number(dayAvailability.price) !== basePrice) ||
    (Number.isFinite(totalUnits) &&
      Number(dayAvailability.available_units) !== totalUnits)
  )
}

// Obtiene las fechas que modifican la configuración habitual
export function getSpecialAvailabilityDays(availabilityDays, roomType) {
  return availabilityDays.filter((dayAvailability) => {
    return isSpecialAvailabilityDay(dayAvailability, roomType)
  })
}
