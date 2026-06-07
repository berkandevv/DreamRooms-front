// Comprueba si una estancia se puede reservar permitiendo overbooking.
// El pago en hotel no consume inventario, así que solo bloquean las fechas
// realmente no reservables: sin calendario, cerradas o por debajo de la estancia mínima.
// La falta de cupo (insufficient_dates) no impide reservar con pago en hotel.
export function isStayBookableWithOverbooking(quote) {
  if (!quote) {
    return false
  }

  if (quote.is_available === true) {
    return true
  }

  const issues = quote.availability_issues

  if (!issues) {
    return false
  }

  return (
    (issues.missing_dates?.length ?? 0) === 0 &&
    (issues.closed_dates?.length ?? 0) === 0 &&
    (issues.min_stay_violations?.length ?? 0) === 0
  )
}
