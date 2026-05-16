const API_BASE_URL = 'http://localhost:8000/api/auth'

export function getAuthToken() {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
}

export function getTokenType() {
  return localStorage.getItem('token_type') || sessionStorage.getItem('token_type') || 'Bearer'
}

export function getAuthenticatedUser() {
  const storedUser =
    localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')

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

  localStorage.setItem('auth_token', token)
  localStorage.setItem('token_type', result.token_type || 'Bearer')

  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user))
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
