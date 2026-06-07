import { isStayBookableWithOverbooking } from "../../utils/availabilityUtils"
import { formatDate } from "../../utils/dateUtils"
import { pluralize } from "../../utils/textUtils"

// Muestra el resultado de la comprobación de disponibilidad noche a noche
export default function AvailabilityResult({
  error,
  isLoading,
  paymentMethod,
  quote,
  stayDates,
  unitsBooked,
}) {
  if (stayDates.length === 0) {
    return (
      <div className="mt-5 rounded-lg border border-outline-variant bg-surface p-4 text-sm font-semibold text-secondary">
        Selecciona check-in y check-out para comprobar la disponibilidad diaria.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-5 rounded-lg border border-outline-variant bg-surface p-4 text-sm font-semibold text-secondary">
        Comprobando disponibilidad para {stayDates.length}{" "}
        {pluralize(stayDates.length, "noche", "noches")}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 rounded-lg border border-error bg-error-container p-4 text-sm font-semibold text-error">
        {error}
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="mt-5 rounded-lg border border-outline-variant bg-surface p-4 text-sm font-semibold text-secondary">
        Preparando la comprobación de disponibilidad...
      </div>
    );
  }

  const isAvailable = quote.is_available === true;
  // Sin cupo libre pero reservable con pago en hotel (overbooking)
  const isOverbookable =
    !isAvailable &&
    paymentMethod === "hotel" &&
    isStayBookableWithOverbooking(quote);
  const checkedNights = quote.stay_dates || stayDates;
  const dailyAvailability = quote.daily_available_units || [];
  const availabilityByDate = new Map(
    dailyAvailability.map((dayAvailability) => [
      dayAvailability.date,
      dayAvailability,
    ]),
  );

  return (
    <div
      className={`mt-5 rounded-lg border p-4 ${
        isAvailable
          ? "border-[#A7F3D0] bg-[#ECFDF5]"
          : isOverbookable
            ? "border-[#FCD34D] bg-[#FFFBEB]"
            : "border-error bg-error-container"
      }`}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p
            className={`text-base font-bold ${
              isAvailable
                ? "text-[#047857]"
                : isOverbookable
                  ? "text-[#92400E]"
                  : "text-error"
            }`}
          >
            {isAvailable
              ? "Disponible para las fechas seleccionadas"
              : isOverbookable
                ? "Sin cupo inmediato · reservable con pago en el hotel"
                : "No disponible para toda la estancia"}
          </p>
          <p className="mt-1 text-sm font-semibold text-secondary">
            Se comprueban las noches del {formatDate(stayDates[0])} al{" "}
            {formatDate(stayDates[stayDates.length - 1])}. El día de salida no
            cuenta como noche.
          </p>
        </div>
        <span
          className={`w-fit whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
            isAvailable
              ? "bg-[#D1FAE5] text-[#047857]"
              : isOverbookable
                ? "bg-[#FDE68A] text-[#92400E]"
                : "bg-error text-on-primary"
          }`}
        >
          {quote.nights || checkedNights.length}{" "}
          {pluralize(quote.nights || checkedNights.length, "noche", "noches")} ·{" "}
          {unitsBooked} {pluralize(unitsBooked, "habitación", "habitaciones")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-surface-container-lowest p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary">
            Disponibles para toda la estancia
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">
            {quote.available_units_for_stay ?? 0}
          </p>
        </div>
        <div className="rounded-lg bg-surface-container-lowest p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary">
            Quedarían tras reservar
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">
            {quote.remaining_units_after_booking ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {checkedNights.map((date) => {
          const dayAvailability = availabilityByDate.get(date);
          const dayIsAvailable =
            dayAvailability?.status === "open" &&
            Number(dayAvailability.available_units) >= unitsBooked;

          return (
            <div
              className="grid grid-cols-1 gap-2 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm sm:grid-cols-[1fr_auto] sm:items-center"
              key={date}
            >
              <div>
                <p className="font-semibold text-on-surface">
                  Noche del {formatDate(date)}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-secondary">
                  {dayAvailability
                    ? `${dayAvailability.available_units || 0} habitaciones libres`
                    : "No existe disponibilidad para esa noche"}
                </p>
                {date === stayDates[0] && dayAvailability?.min_stay_nights && (
                  <p className="mt-1 text-xs font-bold text-secondary">
                    Mínimo desde check-in: {dayAvailability.min_stay_nights}{" "}
                    {pluralize(
                      Number(dayAvailability.min_stay_nights),
                      "noche",
                      "noches",
                    )}
                  </p>
                )}
              </div>
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${
                  dayIsAvailable
                    ? "bg-[#D1FAE5] text-[#047857]"
                    : "bg-error-container text-error"
                }`}
              >
                {dayIsAvailable ? "Disponible" : "No disponible"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
