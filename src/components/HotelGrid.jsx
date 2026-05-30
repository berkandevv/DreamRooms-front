import HotelCard from './HotelCard'

export default function HotelGrid({
  favoriteIds = new Set(),
  hotels,
  isLoading,
  error,
  onFavoriteToggle,
}) {
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

      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard
            hotel={hotel}
            isFavorite={favoriteIds.has(Number(hotel.id))}
            key={hotel.id}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </section>
  )
}
