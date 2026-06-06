const apiErrorTranslations = {
  'Account deactivated successfully.': 'Cuenta eliminada correctamente.',
  'Admin users cannot authenticate through the API.':
    'Los usuarios administradores no pueden iniciar sesión desde la web.',
  'Cancelled bookings can only receive refunded payments.':
    'Las reservas canceladas solo pueden recibir pagos reembolsados.',
  'Completed bookings cannot be cancelled.':
    'Las reservas completadas no se pueden cancelar.',
  'Logged out successfully.': 'Sesión cerrada correctamente.',
  'Not Found': 'No se ha encontrado el recurso solicitado.',
  'Only completed bookings can be reviewed.':
    'Solo se pueden comentar las reservas completadas.',
  'Only paid bookings can be completed.':
    'Solo se pueden completar las reservas pagadas.',
  'Only pay-at-hotel bookings can receive manual owner payments.':
    'Solo las reservas con pago en el hotel pueden recibir pagos manuales.',
  'Password updated successfully.': 'Contraseña actualizada correctamente.',
  'The booking is already cancelled.': 'La reserva ya está cancelada.',
  'The current password is incorrect.': 'La contraseña actual es incorrecta.',
  'The free cancellation deadline for this booking has passed.':
    'Ha pasado el plazo de cancelación gratuita de esta reserva.',
  'The number of guests cannot exceed adults_count plus children_count.':
    'El número de huéspedes no puede superar el total de adultos y niños.',
  'The payment amount must match the full booking total. Partial payments are not allowed.':
    'El importe debe coincidir con el total de la reserva. No se permiten pagos parciales.',
  'The provided credentials are incorrect.':
    'El email o la contraseña no son correctos.',
  'The selected customer is not active.':
    'La cuenta del cliente seleccionado no está activa.',
  'The selected room type does not support the requested occupancy.':
    'La habitación seleccionada no admite el número de huéspedes indicado.',
  'The selected room type is not available for the requested dates.':
    'La habitación seleccionada no está disponible para las fechas indicadas.',
  'There is no availability for every night in the selected stay.':
    'No hay disponibilidad para todas las noches de la estancia seleccionada.',
  'This action is unauthorized.': 'No tienes permisos para realizar esta acción.',
  'This booking already has a review.': 'Esta reserva ya tiene un comentario.',
  'This booking is already paid.': 'Esta reserva ya está pagada.',
  'This user account is not active.': 'Esta cuenta no está activa.',
  'Unauthenticated.': 'Debes iniciar sesión para realizar esta acción.',
  'Server Error': 'Se ha producido un error interno. Inténtalo de nuevo.',
}

const apiFieldLabels = {
  account_type: 'tipo de cuenta',
  adults_count: 'número de adultos',
  amount: 'importe',
  available_units: 'unidades disponibles',
  check_in: 'fecha de entrada',
  check_out: 'fecha de salida',
  children_count: 'número de niños',
  current_password: 'contraseña actual',
  full_name: 'nombre completo',
  email: 'email',
  guests: 'huéspedes',
  name: 'nombre',
  password: 'contraseña',
  phone: 'teléfono',
  rating: 'puntuación',
  room_type_id: 'habitación',
  status: 'estado',
  today: 'hoy',
  total_units: 'unidades totales',
}

const apiValueLabels = {
  cancelled: 'cancelada',
  completed: 'completada',
  confirmed: 'confirmada',
  pending: 'pendiente',
}

// Devuelve una etiqueta comprensible para un campo de validación de Laravel
function getApiFieldLabel(field) {
  const normalizedField = field
    .split('.')
    .at(-1)
    .replace(/ field$/, '')
    .replaceAll(' ', '_')

  return apiFieldLabels[normalizedField] || normalizedField.replaceAll('_', ' ')
}

// Traduce valores técnicos conocidos cuando aparecen dentro de un mensaje
function getApiValueLabel(value) {
  return apiValueLabels[value] || value
}

// Traduce mensajes variables generados por Laravel o por las reglas de negocio
function translateDynamicApiError(message) {
  const dynamicTranslations = [
    [
      /^Available units cannot be greater than total units \((\d+)\)\.$/,
      ([, totalUnits]) =>
        `Las unidades disponibles no pueden superar las unidades totales (${totalUnits}).`,
    ],
    [
      /^Cannot change booking status from (.+) to (.+)\.$/,
      ([, currentStatus, newStatus]) =>
        `No se puede cambiar el estado de la reserva de ${getApiValueLabel(currentStatus)} a ${getApiValueLabel(newStatus)}.`,
    ],
    [
      /^The (.+) field is required\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} es obligatorio.`,
    ],
    [
      /^The (.+) field confirmation does not match\.$/,
      ([, field]) => `La confirmación del campo ${getApiFieldLabel(field)} no coincide.`,
    ],
    [
      /^The (.+) has already been taken\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} ya está en uso.`,
    ],
    [
      /^The (.+) must be a valid email address\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} debe ser un email válido.`,
    ],
    [
      /^The (.+) must be at least (\d+) characters\.$/,
      ([, field, minimum]) =>
        `El campo ${getApiFieldLabel(field)} debe tener al menos ${minimum} caracteres.`,
    ],
    [
      /^The (.+) must not be greater than (\d+) characters\.$/,
      ([, field, maximum]) =>
        `El campo ${getApiFieldLabel(field)} no puede tener más de ${maximum} caracteres.`,
    ],
    [
      /^The (.+) must be a number\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} debe ser un número.`,
    ],
    [
      /^The (.+) must be an array\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} debe ser una lista.`,
    ],
    [
      /^The (.+) must be an integer\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} debe ser un número entero.`,
    ],
    [
      /^The (.+) must be a string\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} debe ser texto.`,
    ],
    [
      /^The (.+) must be at least (\d+(?:\.\d+)?)\.$/,
      ([, field, minimum]) =>
        `El campo ${getApiFieldLabel(field)} debe ser como mínimo ${minimum}.`,
    ],
    [
      /^The (.+) must not be greater than (\d+(?:\.\d+)?)\.$/,
      ([, field, maximum]) =>
        `El campo ${getApiFieldLabel(field)} no puede ser mayor que ${maximum}.`,
    ],
    [
      /^The (.+) must be between (\d+(?:\.\d+)?) and (\d+(?:\.\d+)?)\.$/,
      ([, field, minimum, maximum]) =>
        `El campo ${getApiFieldLabel(field)} debe estar entre ${minimum} y ${maximum}.`,
    ],
    [
      /^The (.+) must be a valid date\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} debe ser una fecha válida.`,
    ],
    [
      /^The (.+) must be a date after or equal to (.+)\.$/,
      ([, field, comparisonField]) =>
        `El campo ${getApiFieldLabel(field)} debe ser igual o posterior a ${getApiFieldLabel(comparisonField)}.`,
    ],
    [
      /^The (.+) must be a date after (.+)\.$/,
      ([, field, comparisonField]) =>
        `El campo ${getApiFieldLabel(field)} debe ser posterior a ${getApiFieldLabel(comparisonField)}.`,
    ],
    [
      /^The (.+) field must be one of: (.+)\.$/,
      ([, field, values]) =>
        `El campo ${getApiFieldLabel(field)} debe tener uno de estos valores: ${values}.`,
    ],
    [
      /^The selected (.+) is invalid\.$/,
      ([, field]) => `El campo ${getApiFieldLabel(field)} no es válido.`,
    ],
    [
      /^The (.+) field is required when (.+) is present\.$/,
      ([, field, relatedField]) =>
        `El campo ${getApiFieldLabel(field)} es obligatorio cuando se indica ${getApiFieldLabel(relatedField)}.`,
    ],
    [
      /^The selected dates require at least (\d+) nights\.$/,
      ([, minimumNights]) =>
        `Las fechas seleccionadas requieren al menos ${minimumNights} noches.`,
    ],
    [
      /^Total units cannot be lower than existing availability \((\d+)\)\.$/,
      ([, availableUnits]) =>
        `Las unidades totales no pueden ser inferiores a la disponibilidad existente (${availableUnits}).`,
    ],
  ]

  for (const [pattern, translate] of dynamicTranslations) {
    const match = message.match(pattern)

    if (match) {
      return translate(match)
    }
  }

  return message
}

// Traduce al castellano un mensaje devuelto por la API cuando existe equivalencia
export function translateApiErrorMessage(message) {
  if (typeof message !== 'string') {
    return message
  }

  return apiErrorTranslations[message] || translateDynamicApiError(message)
}

// Obtiene el mensaje de una respuesta con error
export function getApiErrorMessage(result, fallbackMessage) {
  const validationMessage = Object.values(result?.errors || {})
    .flat()
    .find(Boolean)

  return translateApiErrorMessage(
    validationMessage || result?.message || fallbackMessage,
  )
}

// Ejecuta una petición y transforma su respuesta JSON
export async function requestJson(url, options = {}, fallbackErrorMessage) {
  const response = await fetch(url, options)
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(getApiErrorMessage(result, fallbackErrorMessage))
  }

  return result
}
