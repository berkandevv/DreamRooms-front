import { CheckboxInput, SelectInput, TextArea, TextInput } from "../OwnerUi"
import ImageUploadFields from "./ImageUploadFields"
import ServiceCheckboxGroup from "./ServiceCheckboxGroup"

// Campos comunes de un hotel, reutilizados al crear y al editar
// `showImageUpload` muestra la subida de foto (solo en la creación)
export default function HotelFormFields({
  form,
  onChange,
  services,
  showImageUpload = false,
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          label="Nombre"
          name="name"
          onChange={onChange}
          required
          value={form.name}
        />
        <SelectInput
          label="Estado"
          name="status"
          onChange={onChange}
          value={form.status}
        >
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="inactive">Inactivo</option>
        </SelectInput>
        <TextInput
          label="Estrellas"
          max="5"
          min="1"
          name="stars"
          onChange={onChange}
          required
          type="number"
          value={form.stars}
        />
        <TextInput
          label="Email de contacto"
          name="email"
          onChange={onChange}
          type="email"
          value={form.email}
        />
        <TextInput
          label="Teléfono"
          name="phone"
          onChange={onChange}
          value={form.phone}
        />
        <TextInput
          label="País"
          name="country"
          onChange={onChange}
          required
          value={form.country}
        />
        <TextInput
          label="Región"
          name="region"
          onChange={onChange}
          value={form.region}
        />
        <TextInput
          label="Ciudad"
          name="city"
          onChange={onChange}
          required
          value={form.city}
        />
        <TextInput
          label="Dirección"
          name="address"
          onChange={onChange}
          required
          value={form.address}
        />
        <TextInput
          label="Código postal"
          name="postal_code"
          onChange={onChange}
          value={form.postal_code}
        />
      </div>

      <TextArea
        label="Descripción"
        name="description"
        onChange={onChange}
        value={form.description}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <TextInput
          label="Check-in"
          name="check_in_time"
          onChange={onChange}
          type="time"
          value={form.check_in_time}
        />
        <TextInput
          label="Check-out"
          name="check_out_time"
          onChange={onChange}
          type="time"
          value={form.check_out_time}
        />
        <TextInput
          label="Impuestos %"
          max="100"
          min="0"
          name="tax_rate_percent"
          onChange={onChange}
          step="0.01"
          type="number"
          value={form.tax_rate_percent}
        />
        <TextInput
          label="Descuento %"
          max="100"
          min="0"
          name="discount_rate_percent"
          onChange={onChange}
          step="0.01"
          type="number"
          value={form.discount_rate_percent}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <CheckboxInput
          checked={form.pets_allowed}
          label="Mascotas permitidas"
          name="pets_allowed"
          onChange={onChange}
        />
        <CheckboxInput
          checked={form.smoking_allowed}
          label="Fumadores permitidos"
          name="smoking_allowed"
          onChange={onChange}
        />
      </div>

      {showImageUpload && (
        <ImageUploadFields
          formData={form}
          label="Foto del hotel"
          onChange={onChange}
        />
      )}

      <ServiceCheckboxGroup
        label="Servicios del hotel"
        onChange={onChange}
        selectedIds={form.service_ids}
        services={services}
      />
    </>
  );
}
