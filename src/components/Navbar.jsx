import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { Link, NavLink, useNavigate } from 'react-router'
import {
  AUTH_SESSION_CHANGED_EVENT,
  getAuthenticatedUser,
  getAuthToken,
  logoutUser,
  setAuthenticatedUser,
} from '../services/authService'
import { getCustomerBookings } from '../services/customerBookingService'

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
  const displayName = user?.name || user?.email || 'Mi perfil'
  const navLinkClass = ({ isActive }) => {
    if (isActive) {
      return 'border-b-2 border-primary pb-1 font-semibold text-primary'
    }

    return 'border-b-2 border-transparent pb-1 text-secondary transition hover:text-primary'
  }

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
    if (!isAuthenticated || user?.name) {
      return
    }

    let shouldIgnoreResponse = false

    getCustomerBookings()
      .then((bookings) => {
        if (shouldIgnoreResponse) {
          return
        }

        const customer = bookings.find((booking) => {
          return booking.customer?.name || booking.customer?.email
        })?.customer

        if (customer) {
          setAuthenticatedUser({
            email: customer.email,
            name: customer.name,
          })
        }
      })
      .catch(() => {})

    return () => {
      shouldIgnoreResponse = true
    }
  }, [isAuthenticated, user?.name])

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-outline-variant bg-surface-container-low/95 shadow-[0_10px_32px_rgba(19,27,46,0.14)] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link className="text-xl font-bold text-primary" to="/">
          Dream Rooms
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink className={navLinkClass} end to="/">
            Inicio
          </NavLink>
          <NavLink className={navLinkClass} to="/hotels">
            Hoteles
          </NavLink>
          {isAuthenticated && (
            <NavLink className={navLinkClass} to="/my-bookings">
              Mis reservas
            </NavLink>
          )}
          <a
            className="border-b-2 border-transparent pb-1 text-secondary transition hover:text-primary"
            href="#"
          >
            Nosotros
          </a>
        </div>

        {isAuthenticated ? (
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
                <Link
                  className="block px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                  onClick={() => setIsMenuOpen(false)}
                  to="/my-bookings"
                >
                  Mi perfil
                </Link>
                <button
                  className="block w-full px-4 py-3 text-left text-sm font-semibold text-error transition hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  type="button"
                >
                  {isLoggingOut ? 'Cerrando...' : 'Logout'}
                </button>
              </div>
            )}
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
