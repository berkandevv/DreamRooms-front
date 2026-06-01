import HotelFormFields from '../fields/HotelFormFields'
import { PanelCard, PrimaryButton } from '../OwnerUi'

// Vista para crear un nuevo hotel
export default function NewPropertyView({
  hotelForm,
  hotelServices,
  isSaving,
  onSubmit,
  updateHotelForm,
}) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-12">
        <h2 className="text-2xl font-bold text-primary">Nuevo hotel</h2>
        <p className="mt-1 text-secondary">
          Crea la ficha inicial de una nueva propiedad
        </p>
      </div>

      <div className="lg:col-span-8">
        <PanelCard title="Información básica del hotel">
          <form className="space-y-5" onSubmit={onSubmit}>
            <HotelFormFields
              form={hotelForm}
              onChange={updateHotelForm}
              services={hotelServices}
              showImageUpload
            />
            <PrimaryButton disabled={isSaving}>Crear hotel</PrimaryButton>
          </form>
        </PanelCard>
      </div>

      <aside className="lg:col-span-4">
        <div className="rounded-xl border border-outline-variant bg-primary-container p-6 text-primary-fixed shadow-lg">
          <h3 className="text-2xl font-bold text-white">Publicación</h3>
          <p className="mt-3 text-sm leading-6 text-primary-fixed-dim">
            Crea primero la ficha del hotel. Después podrás añadir tipos de
            habitación y disponibilidad desde Inventario.
          </p>
        </div>
      </aside>
    </section>
  )
}
