import { formatDate } from '../utils/dateUtils'

export default function ReviewsSection({ reviews, error }) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
      <h2 className="text-3xl font-bold text-on-surface">Reseñas</h2>

      {error && <p className="mt-4 text-error">{error}</p>}

      {!error && reviews.length === 0 && (
        <p className="mt-4 text-secondary">
          Este hotel todavía no tiene reseñas.
        </p>
      )}

      {!error && reviews.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article
              className="rounded-xl border border-outline-variant bg-surface p-5"
              key={review.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-on-surface">
                    {review.user?.name || 'Usuario'}
                  </h3>
                  <p className="mt-1 text-sm text-secondary">
                    {formatDate(review.created_at, 'Fecha no disponible')}
                  </p>
                </div>
                <p className="font-semibold text-on-surface">
                  <span className="text-[#10B981]">☆</span> {review.rating}
                </p>
              </div>

              <p className="mt-4 leading-6 text-on-surface-variant">
                {review.comment || 'Sin comentario.'}
              </p>

              {review.image_url && (
                <img
                  alt="Foto del comentario"
                  className="mt-4 max-h-56 w-full rounded-lg border border-outline-variant object-cover"
                  src={review.image_url}
                />
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
