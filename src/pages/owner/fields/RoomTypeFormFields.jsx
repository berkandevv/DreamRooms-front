import { SelectInput, TextArea, TextInput } from "../OwnerUi"
import ImageUploadFields from "./ImageUploadFields"
import ServiceCheckboxGroup from "./ServiceCheckboxGroup"

// Campos comunes de un tipo de habitación, reutilizados al crear y al editar.
// `showImageUpload` muestra la subida de foto (solo en la creación) y
// `showStatusAndCurrency` muestra estado y moneda (solo en la edición).
export default function RoomTypeFormFields({
  form,
  onChange,
  services,
  showImageUpload = false,
  showStatusAndCurrency = false,
}) {
  return (
    <>
      <TextInput
        label="Nombre"
        name="name"
        onChange={onChange}
        required
        value={form.name}
      />
      <TextArea
        label="Descripción"
        name="description"
        onChange={onChange}
        value={form.description}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TextInput
          label="Adultos"
          min="1"
          name="capacity_adults"
          onChange={onChange}
          required
          type="number"
          value={form.capacity_adults}
        />
        <TextInput
          label="Niños"
          min="0"
          name="capacity_children"
          onChange={onChange}
          required
          type="number"
          value={form.capacity_children}
        />
        <TextInput
          label="m²"
          min="0"
          name="size_m2"
          onChange={onChange}
          step="1"
          type="number"
          value={form.size_m2}
        />
        <TextInput
          label="Unidades"
          min="1"
          name="total_units"
          onChange={onChange}
          required
          type="number"
          value={form.total_units}
        />
        <TextInput
          label="Tipo de cama"
          name="bed_type"
          onChange={onChange}
          value={form.bed_type}
        />
        <TextInput
          label="Precio base"
          min="0"
          name="base_price"
          onChange={onChange}
          required
          step="0.01"
          type="number"
          value={form.base_price}
        />
        <TextInput
          label="Cancelación gratuita (horas)"
          max="8760"
          min="0"
          name="free_cancellation_hours"
          onChange={onChange}
          placeholder="Sin límite"
          type="number"
          value={form.free_cancellation_hours}
        />
        {showStatusAndCurrency && (
          <>
            <SelectInput
              label="Estado"
              name="status"
              onChange={onChange}
              value={form.status}
            >
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </SelectInput>
            <TextInput
              label="Moneda"
              name="currency"
              onChange={onChange}
              value={form.currency}
            />
          </>
        )}
      </div>

      <p className="text-xs leading-5 text-secondary">
        Déjalo vacío para permitir cancelación gratuita sin fecha límite. Usa 0
        para permitirla hasta la hora exacta del check-in.
      </p>

      {showImageUpload && (
        <ImageUploadFields
          formData={form}
          label="Foto de la habitación"
          onChange={onChange}
        />
      )}

      <ServiceCheckboxGroup
        label="Servicios de la habitación"
        onChange={onChange}
        selectedIds={form.service_ids}
        services={services}
      />
    </>
  );
}
