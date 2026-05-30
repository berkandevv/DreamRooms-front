export function getIntegerSquareMeters(value) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? Math.trunc(numericValue) : ''
}

export function formatSquareMeters(value, fallback = '-') {
  const integerValue = getIntegerSquareMeters(value)

  return integerValue === '' ? fallback : integerValue
}
