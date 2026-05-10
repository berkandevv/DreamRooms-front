export function formatPrice(price, currencySymbol = '€') {
  const numericPrice = Number(price)

  if (!numericPrice) {
    return 'Consultar'
  }

  return `${Math.round(numericPrice)}${currencySymbol}`
}
