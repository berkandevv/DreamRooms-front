// Elige la forma singular o plural según la cantidad
export function pluralize(count, singular, plural) {
  return Number(count) === 1 ? singular : plural
}
