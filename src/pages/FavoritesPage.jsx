import { Link } from 'react-router'
import HotelCard from '../components/HotelCard'
import Layout from '../components/Layout'
import { useCustomerFavorites } from '../hooks/useCustomerFavorites'

export default function FavoritesPage() {
  const {
    canUseFavorites,
    favoriteHotels,
    favoriteIds,
    favoritesError,
    isLoadingFavorites,
    toggleFavorite,
  } = useCustomerFavorites()

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold text-on-surface">Mis favoritos</h1>
            <p className="mt-2 text-secondary">
              Hoteles guardados para consultar y reservar más tarde.
            </p>
          </div>

          <Link
            className="inline-flex h-11 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest px-4 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-surface"
            to="/hotels"
          >
            Explorar hoteles
          </Link>
        </div>

        {!canUseFavorites && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
            <p>Inicia sesión como cliente para ver tus hoteles favoritos.</p>
            <Link
              className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:opacity-90"
              to="/login"
            >
              Iniciar sesión
            </Link>
          </div>
        )}

        {canUseFavorites && isLoadingFavorites && (
          <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
            Cargando favoritos...
          </p>
        )}

        {canUseFavorites && favoritesError && (
          <p className="rounded-xl border border-error bg-error-container p-6 text-center text-error">
            {favoritesError}
          </p>
        )}

        {canUseFavorites &&
          !isLoadingFavorites &&
          !favoritesError &&
          favoriteHotels.length === 0 && (
            <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
              Todavía no has guardado ningún hotel como favorito.
            </p>
          )}

        {canUseFavorites &&
          !isLoadingFavorites &&
          !favoritesError &&
          favoriteHotels.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favoriteHotels.map((hotel) => (
                <HotelCard
                  hotel={hotel}
                  isFavorite={favoriteIds.has(Number(hotel.id))}
                  key={hotel.id}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
            </div>
          )}
      </section>
    </Layout>
  )
}
