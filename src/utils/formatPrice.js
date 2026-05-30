// Formatea un importe con su símbolo de moneda
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
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: shouldShowDecimals ? 2 : 0,
    minimumFractionDigits: shouldShowDecimals ? 2 : 0,
  }).format(formattedNumber)

  return `${formattedPrice}${currencySymbol}`
}
