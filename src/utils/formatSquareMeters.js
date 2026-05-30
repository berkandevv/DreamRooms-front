// Convierte una superficie a un número entero válido
export function getIntegerSquareMeters(value) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? Math.trunc(numericValue) : ''
}

// Formatea una superficie para mostrarla en pantalla
export function formatSquareMeters(value, fallback = '-') {
  const integerValue = getIntegerSquareMeters(value)

  return integerValue === '' ? fallback : integerValue
}
