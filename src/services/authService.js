const API_BASE_URL = 'http://localhost:8000/api/auth'

export function getAuthToken() {
  return sessionStorage.getItem('auth_token')
}

export function getTokenType() {
  return sessionStorage.getItem('token_type') || 'Bearer'
}

export function getAuthenticatedUser() {
  const storedUser = sessionStorage.getItem('auth_user')

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

function saveAuthSession(result) {
  const token = result.token || result.access_token || result.data?.token
  const user = result.user || result.data?.user

  if (!token) {
    throw new Error('La respuesta de autenticación no incluye token')
  }

  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('auth_user')

  sessionStorage.setItem('auth_token', token)
  sessionStorage.setItem('token_type', result.token_type || 'Bearer')

  if (user) {
    sessionStorage.setItem('auth_user', JSON.stringify(user))
  }
}

export function getAuthHeaders() {
  const token = getAuthToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `${getTokenType()} ${token}`,
  }
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
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

  saveAuthSession(result)

  return result
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    body: JSON.stringify(credentials),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo iniciar sesión')
  }

  saveAuthSession(result)

  return result
}
