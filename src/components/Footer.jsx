import { Link } from 'react-router'
import BrandLogo from './BrandLogo'

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-8 md:flex-row md:px-8">
        <div className="text-center md:text-left">
          <BrandLogo className="justify-center md:justify-start" />
          <p className="mt-1 text-sm text-secondary">
            © 2026 Dream Rooms. Todos los derechos reservados.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5 text-sm text-secondary">
          <Link className="hover:text-primary" to="/privacy">
            Privacidad
          </Link>
          <Link className="hover:text-primary" to="/terms">
            Condiciones
          </Link>
          <Link className="hover:text-primary" to="/contact">
            Contacto
          </Link>
          <Link className="hover:text-primary" to="/help">
            Ayuda
          </Link>
        </div>
      </div>
    </footer>
  )
}
