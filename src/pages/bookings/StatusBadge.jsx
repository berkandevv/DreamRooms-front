import { getStatusLabel } from './bookingHelpers'

export default function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase()
  const isCancelled = normalizedStatus === 'cancelled'
  const isConfirmed = normalizedStatus === 'confirmed'

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
        isCancelled
          ? 'bg-error-container text-error'
          : isConfirmed
            ? 'bg-on-tertiary-container/10 text-on-tertiary-container'
            : 'bg-secondary-container text-secondary'
      }`}
    >
      {getStatusLabel(status)}
    </span>
  )
}
