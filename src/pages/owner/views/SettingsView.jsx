import HotelFormFields from '../fields/HotelFormFields'
import RoomTypeFormFields from '../fields/RoomTypeFormFields'
import { PanelCard, PrimaryButton, SelectInput } from '../OwnerUi'

// Vista de ajustes: editar hoteles y tipos de habitación ya existentes
export default function SettingsView({
  editHotelForm,
  editRoomTypeForm,
  hotels,
  hotelServices,
  isSaving,
  onHotelChange,
  onRoomTypeChange,
  onUpdateHotel,
  onUpdateRoomType,
  roomTypes,
  roomTypeServices,
  selectedHotelId,
  selectedRoomTypeId,
  updateEditHotelForm,
  updateEditRoomTypeForm,
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Ajustes</h2>
        <p className="mt-1 text-secondary">
          Edita hoteles ya creados y tipos de habitación existentes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PanelCard title="Editar hotel">
          <form className="space-y-5" onSubmit={onUpdateHotel}>
            <SelectInput
              label="Hotel"
              name="hotel_id"
              onChange={(event) => onHotelChange(event.target.value)}
              value={selectedHotelId}
            >
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </SelectInput>

            <HotelFormFields
              form={editHotelForm}
              onChange={updateEditHotelForm}
              services={hotelServices}
            />

            <PrimaryButton disabled={isSaving || !selectedHotelId}>
              Guardar hotel
            </PrimaryButton>
          </form>
        </PanelCard>

        <PanelCard title="Editar habitación">
          <form className="space-y-5" onSubmit={onUpdateRoomType}>
            <SelectInput
              label="Habitación"
              name="room_type_id"
              onChange={(event) => onRoomTypeChange(event.target.value)}
              value={selectedRoomTypeId}
            >
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </SelectInput>

            <RoomTypeFormFields
              form={editRoomTypeForm}
              onChange={updateEditRoomTypeForm}
              services={roomTypeServices}
              showStatusAndCurrency
            />

            <PrimaryButton disabled={isSaving || !selectedRoomTypeId}>
              Guardar habitación
            </PrimaryButton>
          </form>
        </PanelCard>
      </div>
    </section>
  )
}
