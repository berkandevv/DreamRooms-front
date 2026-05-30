// Obtiene la etiqueta visible de un método de pago
export function getPaymentMethodLabel(paymentMethod) {
  const labels = {
    card: 'Pago con tarjeta',
    hotel: 'Pago en hotel',
    manual: 'Manual',
  }

  return labels[paymentMethod?.toLowerCase()] || 'No indicado'
}
