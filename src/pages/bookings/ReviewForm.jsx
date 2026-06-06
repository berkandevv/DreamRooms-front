import { useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { createCustomerBookingReview } from '../../services/customerBookingService'

// Comprueba si el error indica que la reserva ya tiene reseña
function isAlreadyReviewedError(error) {
  return error.message.toLowerCase().includes('already has a review')
}

export default function ReviewForm({ booking, onAlreadyReviewed, onCreated }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Envía la reseña introducida por el cliente
  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const review = await createCustomerBookingReview(booking.id, {
        comment,
        rating,
      })
      onCreated(booking.id, review)
    } catch (reviewError) {
      if (isAlreadyReviewedError(reviewError)) {
        onAlreadyReviewed(booking.id)
        return
      }

      setError(reviewError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="border-t border-outline-variant bg-surface p-5"
      onSubmit={handleSubmit}
    >
      <h4 className="font-bold text-primary">
        ¿Cómo fue tu estancia en {booking.hotel?.name || 'el hotel'}?
      </h4>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            className="text-[#10B981]"
            key={value}
            onClick={() => setRating(value)}
            type="button"
          >
            {value <= rating ? (
              <FaStar className="h-5 w-5" />
            ) : (
              <FaRegStar className="h-5 w-5" />
            )}
          </button>
        ))}
      </div>
      <textarea
        className="mt-4 h-24 w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(event) => setComment(event.target.value)}
        placeholder="Comparte tu experiencia..."
        required
        value={comment}
      />
      {error && (
        <p className="mt-3 rounded-lg border border-error bg-error-container p-3 text-sm font-semibold text-error">
          {error}
        </p>
      )}
      <p className="mt-3 text-sm font-semibold text-secondary">
        Tu comentario quedará pendiente de revisión por el administrador de la web
        antes de publicarse.
      </p>
      <div className="mt-4 flex justify-end gap-3">
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar comentario'}
        </button>
      </div>
    </form>
  )
}
