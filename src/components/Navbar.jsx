import { Link, NavLink } from 'react-router'

export default function Navbar() {
  const navLinkClass = ({ isActive }) => {
    if (isActive) {
      return 'border-b-2 border-primary pb-1 font-semibold text-primary'
    }

    return 'border-b-2 border-transparent pb-1 text-secondary transition hover:text-primary'
  }

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
          <NavLink className={navLinkClass} to="/my-bookings">
            Mis reservas
          </NavLink>
          <a
            className="border-b-2 border-transparent pb-1 text-secondary transition hover:text-primary"
            href="#"
          >
            Nosotros
          </a>
        </div>

        <Link
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-80"
          to="/login"
        >
          Iniciar sesión / Registrarse
        </Link>
      </nav>
    </header>
  )
}
