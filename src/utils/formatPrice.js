export function formatPrice(price, currencySymbol = '€') {
  if (price === null || price === undefined || price === '') {
    return 'Consultar'
  }

  const numericPrice = Number(price)

  if (Number.isNaN(numericPrice)) {
    return 'Consultar'
  }

  const hasDecimals = !Number.isInteger(numericPrice)
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: hasDecimals ? 2 : 0,
    minimumFractionDigits: hasDecimals ? 2 : 0,
  }).format(numericPrice)

  return `${formattedPrice}${currencySymbol}`
}
