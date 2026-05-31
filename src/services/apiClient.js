// Obtiene el mensaje de una respuesta con error
export function getApiErrorMessage(result, fallbackMessage) {
  const validationMessage = Object.values(result?.errors || {})
    .flat()
    .find(Boolean)

  return validationMessage || result?.message || fallbackMessage
}

// Ejecuta una petición y transforma su respuesta JSON
export async function requestJson(url, options = {}, fallbackErrorMessage) {
  const response = await fetch(url, options)
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(getApiErrorMessage(result, fallbackErrorMessage))
  }

  return result
}
