import { formatPrice } from '../../../utils/formatPrice'
import { getLocationText } from '../ownerHelpers'
import { PanelCard, StatCard, StatusBadge } from '../OwnerUi'

// Vista de resumen: métricas principales y tabla de hoteles gestionados
export default function DashboardView({ hotels, setActiveView, stats }) {
  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard label="Hoteles" value={hotels.length} />
          <StatCard label="Publicados" value={stats.activeHotels} />
          <StatCard label="Pendientes" value={stats.pendingBookings} />
          <StatCard label="Ingresos" value={formatPrice(stats.revenue)} />
        </div>

        <PanelCard
          action="Añadir hotel"
          onAction={() => setActiveView('new-property')}
          title="Hoteles gestionados"
        >
          <div className="overflow-hidden rounded-lg border border-outline-variant">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-high text-on-surface">
                <tr>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Reservas</th>
                  <th className="px-4 py-3 text-right">Precio desde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                {hotels.map((hotel) => (
                  <tr className="hover:bg-surface-container-low" key={hotel.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {hotel.cover_image?.url && (
                          <img
                            alt={hotel.cover_image.alt_text || hotel.name}
                            className="h-12 w-12 rounded-lg object-cover"
                            src={hotel.cover_image.url}
                          />
                        )}
                        <div>
                          <p className="font-bold text-primary">{hotel.name}</p>
                          <p className="text-xs text-secondary">
                            {getLocationText(hotel) || 'Ubicación pendiente'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={hotel.status} />
                    </td>
                    <td className="px-4 py-3">{hotel.bookings_count || 0}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatPrice(hotel.starting_price, hotel.currency_symbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </section>
    </div>
  )
}
