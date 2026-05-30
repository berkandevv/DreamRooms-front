import { getPaymentMethodLabel } from '../utils/paymentUtils'

export default function PaymentMethodBadge({ paymentMethod }) {
  const toneClassName = getPaymentMethodTone(paymentMethod)

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${toneClassName}`}
    >
      {getPaymentMethodLabel(paymentMethod)}
    </span>
  )
}

// Obtiene las clases visuales asociadas a un método de pago
function getPaymentMethodTone(paymentMethod) {
  const normalizedPaymentMethod = paymentMethod?.toLowerCase()

  if (normalizedPaymentMethod === 'card') {
    return 'bg-[#DBEAFE] text-[#1D4ED8]'
  }

  if (normalizedPaymentMethod === 'hotel') {
    return 'bg-[#FEF3C7] text-[#92400E]'
  }

  return 'bg-surface-container text-secondary'
}
