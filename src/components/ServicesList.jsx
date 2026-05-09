import { formatServices } from '../utils/formatServices'
import { getServiceIcon } from '../utils/getServiceIcon'

export default function ServicesList({ services, variant = 'grid' }) {
  const serviceList = formatServices(services)

  if (serviceList.length === 0) {
    return (
      <p className="mt-3 text-sm text-secondary">
        No hay servicios disponibles.
      </p>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {serviceList.map((service) => (
          <span
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-outline-variant bg-surface px-3 py-1 text-sm font-semibold text-on-surface-variant"
            key={service}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-container text-primary">
              {getServiceIcon(service, 'h-3 w-3')}
            </span>
            <span>{service}</span>
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {serviceList.map((service) => (
        <div
          className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface p-3 text-center"
          key={service}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-base font-bold text-primary">
            {getServiceIcon(service, 'h-4 w-4')}
          </span>
          <span className="text-sm font-semibold leading-tight text-on-surface-variant">
            {service}
          </span>
        </div>
      ))}
    </div>
  )
}
