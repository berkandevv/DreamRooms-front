// Obtiene el número de unidades incluidas en una reserva
export function getBookedUnits(booking) {
  return Number(booking.stay?.units_booked || booking.units_booked) || 1
}
