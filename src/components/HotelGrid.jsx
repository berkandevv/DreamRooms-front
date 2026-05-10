import HotelCard from './HotelCard'

export default function HotelGrid({ hotels, isLoading, error }) {
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
          Cargando hoteles...
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <p className="rounded-xl border border-error bg-error-container p-6 text-center text-error">
          {error}
        </p>
      </section>
    )
  }

  if (hotels.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
          No hay hoteles disponibles en este momento!
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">
            Hoteles mejor valorados
          </h2>
          <p className="mt-2 text-secondary">
            Los alojamientos con mejor puntuación de nuestros viajeros
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-container-low"
            type="button"
          >
            Filtros
          </button>
          <button
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-container-low"
            type="button"
          >
            Recomendados
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard hotel={hotel} key={hotel.id} />
        ))}
      </div>
    </section>
  )
}
