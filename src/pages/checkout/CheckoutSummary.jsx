import { formatDate } from "../../utils/dateUtils"
import { formatPrice } from "../../utils/formatPrice"
import { getFreeCancellationPolicyText } from "../../utils/cancellationUtils"

// Resumen lateral con el desglose de precios y el botón de confirmación
export default function CheckoutSummary({
  currencySymbol,
  freeCancellationHours,
  hotel,
  isAvailabilityLoading,
  isBooked,
  isSubmitting,
  nights,
  paymentMethod,
  quote,
  roomType,
  shouldBlockReservation,
  stayData,
}) {
  return (
    <aside className="h-fit overflow-hidden rounded-xl border border-outline-variant bg-surface-container-highest shadow-[0_8px_24px_rgba(19,27,46,0.10)] lg:sticky lg:top-24">
      {roomType.cover_image?.url && (
        <div className="h-44 overflow-hidden">
          <img
            alt={roomType.cover_image?.alt_text || roomType.name}
            className="h-full w-full object-cover"
            src={roomType.cover_image.url}
          />
        </div>
      )}
      <div className="space-y-5 p-6">
        <div>
          <p className="text-sm font-semibold text-secondary">{hotel.name}</p>
          <h2 className="mt-1 text-2xl font-bold text-on-surface">
            {roomType.name}
          </h2>
        </div>

        <div className="space-y-3 border-y border-outline-variant py-5 text-sm">
          <SummaryRow label="Check-in" value={formatDate(stayData.check_in)} />
          <SummaryRow
            label="Check-out"
            value={formatDate(stayData.check_out)}
          />
          <SummaryRow label="Noches" value={nights || "-"} />
          <SummaryRow
            label="Ocupación"
            value={`${stayData.adults_count} adultos, ${stayData.children_count} niños`}
          />
          <SummaryRow label="Habitaciones" value={stayData.units_booked} />
          <SummaryRow
            label="Precio base"
            value={`${formatPrice(roomType.base_price, currencySymbol, {
              decimals: true,
            })}/noche`}
          />
          <SummaryRow
            label="Subtotal"
            value={formatPrice(quote.subtotal, currencySymbol, {
              decimals: true,
            })}
          />
          {quote.discount > 0 && (
            <SummaryRow
              label={`Descuento (${quote.discountRate}%)`}
              value={`-${formatPrice(quote.discount, currencySymbol, {
                decimals: true,
              })}`}
            />
          )}
          <SummaryRow
            label={`Tasas (${quote.taxRate}%)`}
            value={formatPrice(quote.taxes, currencySymbol, {
              decimals: true,
            })}
          />
        </div>

        <div className="flex items-end justify-between gap-4">
          <span className="text-lg font-bold text-primary">Total</span>
          <span className="text-3xl font-bold text-primary">
            {formatPrice(quote.total, currencySymbol, {
              decimals: true,
            })}
          </span>
        </div>

        <p className="rounded-lg bg-surface-container p-3 text-xs font-semibold text-secondary">
          Total estimado con las tasas y descuentos configurados por el hotel
        </p>

        <p className="rounded-lg bg-surface-container p-3 text-xs font-semibold text-secondary">
          {getFreeCancellationPolicyText(freeCancellationHours)}
        </p>

        <button
          className="h-12 w-full cursor-pointer rounded-lg bg-primary px-4 font-semibold text-on-primary shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={
            isBooked ||
            isSubmitting ||
            isAvailabilityLoading ||
            shouldBlockReservation
          }
          type="submit"
        >
          {isBooked
            ? "Reserva confirmada"
            : isSubmitting
              ? "Confirmando reserva..."
              : isAvailabilityLoading
                ? "Comprobando disponibilidad..."
                : paymentMethod === "card"
                  ? "Ir al pago"
                  : "Confirmar reserva"}
        </button>

        <p className="text-center text-xs font-semibold text-secondary">
          {paymentMethod === "card"
            ? "Pago con tarjeta: confirmación inmediata"
            : "Pago en hotel: la reserva queda pendiente"}
        </p>
      </div>
    </aside>
  );
}

// Fila de etiqueta y valor dentro del resumen
function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-semibold text-on-surface">{value}</span>
    </div>
  );
}
