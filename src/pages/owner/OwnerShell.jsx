import {
  FaBed,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaPlus,
} from 'react-icons/fa'
import { Link } from 'react-router'
import BrandLogo from '../../components/BrandLogo'

export default function OwnerShell({ activeView, children, setActiveView }) {
  const navigationItems = [
    ['dashboard', 'Dashboard', FaChartLine],
    ['inventory', 'Inventario', FaBed],
    ['bookings', 'Reservas', FaCalendarAlt],
    ['new-property', 'Nuevo hotel', FaPlus],
    ['settings', 'Ajustes', FaCog],
  ]

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <aside className="sticky top-0 z-40 hidden h-screen w-64 shrink-0 flex-col self-start overflow-y-auto border-r border-outline-variant bg-surface-container-low p-4 lg:flex">
        <Link className="mb-8 flex items-center gap-3 px-3 py-4" to="/">
          <BrandLogo compact />
          <span>
            <span className="block text-lg font-bold text-primary">
              Dream Rooms
            </span>
            <span className="text-xs font-semibold text-secondary">
              Owner console
            </span>
          </span>
        </Link>

        <nav className="space-y-1">
          {navigationItems.map(([id, label, Icon]) => (
            <button
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                activeView === id
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-secondary hover:bg-surface-container-high hover:text-primary'
              }`}
              key={id}
              onClick={() => setActiveView(id)}
              type="button"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <Link
          className="mt-auto rounded-lg border border-outline-variant px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-container-high hover:text-primary"
          to="/"
        >
          Volver a la web
        </Link>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">{children}</div>
      </main>
    </div>
  )
}
