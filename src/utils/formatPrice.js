export function formatPrice(price, currencySymbol = '€', options = {}) {
  if (price === null || price === undefined || price === '') {
    return 'Consultar'
  }

  const numericPrice = Number(price)

  if (Number.isNaN(numericPrice)) {
    return 'Consultar'
  }

  const shouldShowDecimals = options.decimals === true
  const formattedNumber = shouldShowDecimals
    ? numericPrice
    : Math.round(numericPrice)
  const hasDecimals = shouldShowDecimals && !Number.isInteger(formattedNumber)
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: hasDecimals ? 2 : 0,
    minimumFractionDigits: hasDecimals ? 2 : 0,
  }).format(formattedNumber)

  return `${formattedPrice}${currencySymbol}`
}
