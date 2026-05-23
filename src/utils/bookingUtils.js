export function getBookingAmounts(roomType, hotel, nights, unitsBooked) {
  const basePrice = Number(roomType?.base_price)
  const taxRate = Number(hotel?.pricing?.tax_rate_percent) || 0
  const discountRate = Number(hotel?.pricing?.discount_rate_percent) || 0

  if (!basePrice || !nights) {
    return {
      discount: 0,
      discountRate,
      subtotal: 0,
      taxes: 0,
      taxRate,
      total: 0,
    }
  }

  const subtotal = basePrice * nights * unitsBooked
  const discount = subtotal * (discountRate / 100)
  const taxableAmount = subtotal - discount
  const taxes = taxableAmount * (taxRate / 100)
  const total = taxableAmount + taxes

  return {
    discount,
    discountRate,
    subtotal,
    taxes,
    taxRate,
    total,
  }
}
