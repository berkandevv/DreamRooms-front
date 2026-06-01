import { CheckboxInput } from '../OwnerUi'

// Grupo de casillas para seleccionar los servicios asociados
export default function ServiceCheckboxGroup({ label, onChange, selectedIds, services }) {
  if (services.length === 0) {
    return null
  }

  return (
    <fieldset className="rounded-lg border border-outline-variant bg-surface p-4">
      <legend className="px-1 text-xs font-bold uppercase tracking-wider text-secondary">
        {label}
      </legend>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <CheckboxInput
            checked={selectedIds.some((serviceId) => Number(serviceId) === Number(service.id))}
            key={service.id}
            label={service.name}
            name="service_ids"
            onChange={onChange}
            value={service.id}
          />
        ))}
      </div>
    </fieldset>
  )
}
