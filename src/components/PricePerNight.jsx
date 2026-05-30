import { formatPrice } from '../utils/formatPrice'

export default function PricePerNight({
  className = 'text-2xl',
  currencySymbol,
  price,
}) {
  return (
    <p className={`mt-1 font-bold text-primary ${className}`}>
      {formatPrice(price, currencySymbol)}
      <span className="text-base font-normal text-secondary">/noche</span>
    </p>
  )
}
