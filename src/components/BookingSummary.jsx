import PricePerNight from './PricePerNight'

export default function BookingSummary({
  availabilityChecked = false,
  checkIn,
  checkOut,
  hotel,
  isCheckingAvailability,
  onCheckAvailability,
  startingPrice = null,
}) {
  const hasAvailablePrice = startingPrice != null
  const displayedPrice = hasAvailablePrice ? startingPrice : hotel.starting_price
  const noAvailability = availabilityChecked && !hasAvailablePrice
  return (
    <aside className="h-fit rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(19,27,46,0.10)] lg:sticky lg:top-24">
      <h2 className="text-2xl font-bold text-on-surface">Resumen</h2>

      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-outline-variant bg-surface p-3">
            <p className="text-xs font-semibold uppercase text-secondary">
              Check-in
            </p>
            <p className="mt-1 font-semibold text-on-surface">
              {checkIn || hotel.check_in_time || 'No disponible'}
            </p>
          </div>
          <div className="rounded-lg border border-outline-variant bg-surface p-3">
            <p className="text-xs font-semibold uppercase text-secondary">
              Check-out
            </p>
            <p className="mt-1 font-semibold text-on-surface">
              {checkOut || hotel.check_out_time || 'No disponible'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary-container px-3 py-1 text-sm font-semibold text-on-secondary-fixed">
            {hotel.pets_allowed ? 'Mascotas permitidas' : 'Sin mascotas'}
          </span>
          <span className="rounded-full bg-secondary-container px-3 py-1 text-sm font-semibold text-on-secondary-fixed">
            {hotel.smoking_allowed ? 'Fumadores permitido' : 'No fumadores'}
          </span>
        </div>

        <div className="border-t border-outline-variant pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-secondary">
                {hasAvailablePrice && availabilityChecked
                  ? 'Desde · disponible'
                  : 'Desde'}
              </p>
              {noAvailability ? (
                <p className="mt-1 text-xl font-bold text-error">
                  Sin disponibilidad
                </p>
              ) : (
                <PricePerNight
                  className="text-3xl"
                  currencySymbol={hotel.currency_symbol}
                  price={displayedPrice}
                />
              )}
            </div>
          </div>

          <button
            className="mt-5 h-12 w-full cursor-pointer rounded-lg bg-primary px-4 font-semibold uppercase tracking-wide text-on-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-on-surface-variant hover:shadow-xl active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            disabled={isCheckingAvailability}
            onClick={onCheckAvailability}
            type="button"
          >
            {isCheckingAvailability
              ? 'Comprobando...'
              : 'Comprobar disponibilidad'}
          </button>
        </div>
      </div>
    </aside>
  )
}
