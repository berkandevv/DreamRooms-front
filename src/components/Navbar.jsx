import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { Link, NavLink, useNavigate } from 'react-router'
import BrandLogo from './BrandLogo'
import {
  AUTH_SESSION_CHANGED_EVENT,
  getAuthenticatedProfile,
  getAuthenticatedUser,
  getAuthToken,
  logoutUser,
} from '../services/authService'
import { getUserRole } from '../utils/userUtils'

// Obtiene la sesión necesaria para mostrar la navegación
function getAuthSession() {
  return {
    isAuthenticated: Boolean(getAuthToken()),
    user: getAuthenticatedUser(),
  }
}

export default function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [authSession, setAuthSession] = useState(getAuthSession)
  const isAuthenticated = authSession.isAuthenticated
  const user = authSession.user
  const userRole = getUserRole(user)
  const isOwner = userRole.includes('owner')
  const isCustomer = userRole.includes('customer')
  const displayName = user?.name || user?.email || 'Tu cuenta'
  // Obtiene las clases visuales de un enlace de navegación
  const navLinkClass = ({ isActive }) => {
    if (isActive) {
      return 'border-b-2 border-primary pb-1 font-semibold text-primary'
    }

    return 'border-b-2 border-transparent pb-1 text-secondary transition hover:text-primary'
  }

  // Cierra la sesión y vuelve al acceso
  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      await logoutUser()
    } finally {
      setIsMenuOpen(false)
      setIsLoggingOut(false)
      navigate('/login')
    }
  }

  useEffect(() => {
    // Actualiza la navegación cuando cambia la sesión
    function handleAuthSessionChanged() {
      setAuthSession(getAuthSession())
    }

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleAuthSessionChanged)

    return () => {
      window.removeEventListener(
        AUTH_SESSION_CHANGED_EVENT,
        handleAuthSessionChanged,
      )
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated || (user?.name && userRole)) {
      return
    }

    let shouldIgnoreResponse = false

    getAuthenticatedProfile()
      .then((profile) => {
        if (shouldIgnoreResponse) {
          return
        }

        setAuthSession({
          isAuthenticated: true,
          user: profile,
        })
      })
      .catch(() => {})

    return () => {
      shouldIgnoreResponse = true
    }
  }, [isAuthenticated, user?.name, userRole])

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-outline-variant bg-surface-container-low/95 shadow-[0_10px_32px_rgba(19,27,46,0.14)] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link aria-label="Dream Rooms" to="/">
          <BrandLogo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink className={navLinkClass} end to="/">
            Inicio
          </NavLink>
          <NavLink className={navLinkClass} to="/hotels">
            Hoteles
          </NavLink>
          <NavLink className={navLinkClass} to="/about">
            Nosotros
          </NavLink>
          <NavLink className={navLinkClass} to="/help">
            Ayuda
          </NavLink>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {isOwner && (
              <Link
                className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-surface hover:shadow-md"
                to="/owner"
              >
                Mi panel
              </Link>
            )}

            {isCustomer && (
              <>
                <Link
                  className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-surface hover:shadow-md"
                  to="/favorites"
                >
                  Favoritos
                </Link>
                <Link
                  className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-surface hover:shadow-md"
                  to="/my-bookings"
                >
                  Mis reservas
                </Link>
              </>
            )}

            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-80"
                onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                type="button"
              >
                <span>{displayName}</span>
                <FaChevronDown
                  className={`h-3 w-3 transition-transform ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_12px_30px_rgba(19,27,46,0.18)]">
                  <button
                    className="block w-full px-4 py-3 text-left text-sm font-semibold text-error transition hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    type="button"
                  >
                    {isLoggingOut ? 'Saliendo...' : 'Salir'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-surface hover:shadow-md"
              to="/login"
            >
              Iniciar sesión
            </Link>
            <Link
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-80"
              to="/register"
            >
              Registrarse
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
