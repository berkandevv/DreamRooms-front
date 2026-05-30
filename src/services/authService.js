import { API_BASE_URL } from '../config/api'

const AUTH_API_URL = `${API_BASE_URL}/auth`
export const AUTH_SESSION_CHANGED_EVENT = 'auth-session-changed'

// Avisa a la interfaz cuando cambia la sesión del usuario
function notifyAuthSessionChanged() {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT))
}

// Devuelve el token de autenticación guardado en la sesión
export function getAuthToken() {
  return sessionStorage.getItem('auth_token')
}

// Devuelve el tipo de token usado para autorizar peticiones
export function getTokenType() {
  return sessionStorage.getItem('token_type') || 'Bearer'
}

// Recupera los datos del usuario autenticado guardados en sesión
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

// Borra todos los datos de autenticación guardados
export function clearAuthSession() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('auth_user')
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('token_type')
  sessionStorage.removeItem('auth_user')
  notifyAuthSessionChanged()
}

// Guarda los datos básicos del usuario autenticado
export function setAuthenticatedUser(user) {
  if (!user) {
    return
  }

  sessionStorage.setItem('auth_user', JSON.stringify(user))
  notifyAuthSessionChanged()
}

// Guarda el token y los datos del usuario después de iniciar sesión o registrarse
function saveAuthSession(result, fallbackUserData = {}) {
  const token = result.token || result.access_token || result.data?.token
  const user = result.user || result.data?.user || result.data

  if (!token) {
    throw new Error('La respuesta de autenticación no incluye token')
  }

  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('auth_user')

  sessionStorage.setItem('auth_token', token)
  sessionStorage.setItem('token_type', result.token_type || 'Bearer')

  if (user) {
    setAuthenticatedUser({
      ...fallbackUserData,
      ...user,
    })
  } else if (Object.keys(fallbackUserData).length > 0) {
    setAuthenticatedUser(fallbackUserData)
  } else {
    notifyAuthSessionChanged()
  }
}

// Prepara las cabeceras de autorización para las peticiones privadas
export function getAuthHeaders() {
  const token = getAuthToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `${getTokenType()} ${token}`,
  }
}

// Registra un nuevo usuario y guarda su sesión
export async function registerUser(userData) {
  const response = await fetch(`${AUTH_API_URL}/register`, {
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

  saveAuthSession(result, {
    account_type: userData.account_type,
    email: userData.email,
    name: userData.name,
  })

  return result
}

// Inicia sesión con email y contraseña
export async function loginUser(credentials) {
  const response = await fetch(`${AUTH_API_URL}/login`, {
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

  saveAuthSession(result, {
    email: credentials.email,
  })

  return result
}

// Pide al backend los datos actualizados del usuario autenticado
export async function getAuthenticatedProfile() {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo cargar el perfil')
  }

  setAuthenticatedUser(result.data)

  return result.data
}

// Cierra la sesión en el backend y limpia los datos locales
export async function logoutUser() {
  const response = await fetch(`${AUTH_API_URL}/logout`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    method: 'POST',
  })

  clearAuthSession()

  if (!response.ok) {
    const result = await response.json().catch(() => ({}))

    throw new Error(result.message || 'No se pudo cerrar sesión')
  }
}
