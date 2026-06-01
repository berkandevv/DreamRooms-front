// Datos personales del cliente vacíos por defecto
export const initialCustomerData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  notes: '',
}

// Obtiene el desglose de precios de una estancia
export function getPriceQuote(availabilityQuote, hotel) {
  return {
    discount: availabilityQuote?.discount_amount,
    discountRate: hotel?.pricing?.discount_rate_percent || 0,
    subtotal: availabilityQuote?.subtotal_amount,
    taxes: availabilityQuote?.taxes_amount,
    taxRate: hotel?.pricing?.tax_rate_percent || 0,
    total: availabilityQuote?.total_amount,
  }
}
