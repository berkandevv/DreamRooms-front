import { useEffect, useState } from 'react'
import { FaBars, FaChevronDown, FaTimes } from 'react-icons/fa'
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

// Enlaces principales del catálogo público
const NAV_LINKS = [
  ['/', 'Inicio', true],
  ['/hotels', 'Hoteles', false],
  ['/about', 'Nosotros', false],
  ['/help', 'Ayuda', false],
]

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  // Estilo compartido por los botones de acción del header
  const actionButtonClass =
    'rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-surface hover:shadow-md'

  // Cierra la sesión y vuelve al acceso
  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      await logoutUser()
    } finally {
      setIsMenuOpen(false)
      setIsMobileMenuOpen(false)
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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
        <Link
          aria-label="Dream Rooms"
          onClick={() => setIsMobileMenuOpen(false)}
          to="/"
        >
          <BrandLogo />
        </Link>

        {/* Enlaces centrales: solo en escritorio amplio */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(([to, label, end]) => (
            <NavLink className={navLinkClass} end={end} key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Acciones: solo en escritorio amplio */}
        {isAuthenticated ? (
          <div className="hidden items-center gap-3 lg:flex">
            {isOwner && (
              <Link className={actionButtonClass} to="/owner">
                Mi panel
              </Link>
            )}

            {isCustomer && (
              <>
                <Link className={actionButtonClass} to="/favorites">
                  Favoritos
                </Link>
                <Link className={actionButtonClass} to="/my-bookings">
                  Mis reservas
                </Link>
              </>
            )}

            <div className="relative">
              <button
                className="flex max-w-48 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-80"
                onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                type="button"
              >
                <span className="truncate">{displayName}</span>
                <FaChevronDown
                  className={`h-3 w-3 shrink-0 transition-transform ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_12px_30px_rgba(19,27,46,0.18)]">
                  <Link
                    className="block w-full px-4 py-3 text-left text-sm font-semibold text-secondary transition hover:bg-surface-container"
                    onClick={() => setIsMenuOpen(false)}
                    to="/account"
                  >
                    Mi cuenta
                  </Link>
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
          <div className="hidden items-center gap-3 lg:flex">
            <Link className={actionButtonClass} to="/login">
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

        {/* Botón de menú: tablet y móvil */}
        <button
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-primary shadow-sm transition hover:border-primary lg:hidden"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="h-4 w-4" />
          ) : (
            <FaBars className="h-4 w-4" />
          )}
        </button>
      </nav>

      {/* Panel desplegable de navegación para tablet y móvil */}
      {isMobileMenuOpen && (
        <div className="border-t border-outline-variant bg-surface-container-low lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-5 py-4 md:px-8">
            {NAV_LINKS.map(([to, label, end]) => (
              <NavLink
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'text-secondary hover:bg-surface-container-high hover:text-primary'
                  }`
                }
                end={end}
                key={to}
                onClick={() => setIsMobileMenuOpen(false)}
                to={to}
              >
                {label}
              </NavLink>
            ))}

            <div className="my-2 border-t border-outline-variant" />

            {isAuthenticated ? (
              <>
                <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                  {displayName}
                </p>
                {isOwner && (
                  <Link
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-container-high hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                    to="/owner"
                  >
                    Mi panel
                  </Link>
                )}
                {isCustomer && (
                  <>
                    <Link
                      className="block rounded-lg px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-container-high hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                      to="/favorites"
                    >
                      Favoritos
                    </Link>
                    <Link
                      className="block rounded-lg px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-container-high hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                      to="/my-bookings"
                    >
                      Mis reservas
                    </Link>
                  </>
                )}
                <Link
                  className="block rounded-lg px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-container-high hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="/account"
                >
                  Mi cuenta
                </Link>
                <button
                  className="block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-error transition hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  type="button"
                >
                  {isLoggingOut ? 'Saliendo...' : 'Salir'}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-1 pt-1">
                <Link
                  className={`${actionButtonClass} text-center`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="/login"
                >
                  Iniciar sesión
                </Link>
                <Link
                  className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-on-primary transition hover:opacity-80"
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="/register"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
