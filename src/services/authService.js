const API_URL = 'http://localhost:8000/api/auth/register'

export async function registerUser(userData) {
  const response = await fetch(API_URL, {
    body: JSON.stringify(userData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo crear la cuenta')
  }

  localStorage.setItem('auth_token', result.token)
  localStorage.setItem('token_type', result.token_type || 'Bearer')

  return result
}
