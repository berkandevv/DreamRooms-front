export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-outline-variant bg-surface-container-low/95 shadow-[0_10px_32px_rgba(19,27,46,0.14)] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a className="text-xl font-bold text-primary" href="#">
          Dream Rooms
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a className="border-b-2 border-primary pb-1 font-semibold text-primary" href="#">
            Hoteles
          </a>
          <a className="text-secondary transition hover:text-primary" href="#">
            Promociones
          </a>
          <a className="text-secondary transition hover:text-primary" href="#">
            Nosotros
          </a>
        </div>

        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-80"
          type="button"
        >
          Dashboard
        </button>
      </nav>
    </header>
  )
}
