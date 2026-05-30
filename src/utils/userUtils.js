// Obtiene el rol normalizado de un usuario
export function getUserRole(user) {
  const role =
    user?.role?.name || user?.role || user?.account_type || user?.type || ''

  return String(role).toLowerCase()
}

// Comprueba si un usuario tiene un rol concreto
export function hasUserRole(user, role) {
  return getUserRole(user).includes(role)
}
