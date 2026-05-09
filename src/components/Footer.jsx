export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-8 md:flex-row md:px-8">
        <div className="text-center md:text-left">
          <p className="text-xl font-bold text-primary">Dream Rooms</p>
          <p className="mt-1 text-sm text-secondary">
            © 2026 Dream Rooms. Todos los derechos reservados.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5 text-sm text-secondary">
          <a className="hover:text-primary" href="#">
            Privacidad
          </a>
          <a className="hover:text-primary" href="#">
            Condiciones
          </a>
          <a className="hover:text-primary" href="#">
            Contacto
          </a>
          <a className="hover:text-primary" href="#">
            Ayuda
          </a>
        </div>
      </div>
    </footer>
  )
}
