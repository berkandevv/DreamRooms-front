import { API_BASE_URL } from '../config/api'
import { requestJson } from './apiClient'

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
  const result = await requestJson(`${AUTH_API_URL}/register`, {
    body: JSON.stringify(userData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }, 'No se pudo crear la cuenta')

  saveAuthSession(result, {
    account_type: userData.account_type,
    email: userData.email,
    name: userData.name,
  })

  return result
}

// Inicia sesión con email y contraseña
export async function loginUser(credentials) {
  const result = await requestJson(`${AUTH_API_URL}/login`, {
    body: JSON.stringify(credentials),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }, 'No se pudo iniciar sesión')

  saveAuthSession(result, {
    email: credentials.email,
  })

  return result
}

// Pide al backend los datos actualizados del usuario autenticado
export async function getAuthenticatedProfile() {
  const result = await requestJson(`${AUTH_API_URL}/me`, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  }, 'No se pudo cargar el perfil')

  setAuthenticatedUser(result.data)

  return result.data
}

// Actualiza la contraseña del usuario autenticado
export async function updateAuthenticatedPassword(passwordData) {
  return requestJson(`${AUTH_API_URL}/password`, {
    body: JSON.stringify(passwordData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    method: 'PUT',
  }, 'No se pudo cambiar la contraseña')
}

// Desactiva la cuenta del usuario autenticado y elimina su sesión local
export async function deactivateAuthenticatedAccount(passwordData) {
  const result = await requestJson(`${AUTH_API_URL}/account`, {
    body: JSON.stringify(passwordData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    method: 'DELETE',
  }, 'No se pudo desactivar la cuenta')

  clearAuthSession()

  return result
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
