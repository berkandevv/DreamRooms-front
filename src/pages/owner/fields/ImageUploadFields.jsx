import { TextInput } from "../OwnerUi"

// Campos para subir una imagen (archivo, texto alternativo y portada)
export default function ImageUploadFields({ formData, label, onChange }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          {label}
        </span>
        <input
          accept="image/*"
          className="mt-2 block w-full text-sm text-secondary file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-primary"
          name="image"
          onChange={onChange}
          type="file"
        />
      </label>
      <TextInput
        label="Texto alternativo"
        name="image_alt_text"
        onChange={onChange}
        placeholder="Ej. Fachada del hotel al atardecer"
        value={formData.image_alt_text}
      />
      <p className="mt-2 text-xs leading-5 text-secondary">
        Describe brevemente lo que aparece en la imagen. Ayuda a personas que
        usan lectores de pantalla y se muestra si la foto no carga.
      </p>
      <p className="mt-3 text-xs leading-5 text-secondary">
        Solo se admite una foto. Si subes una nueva, sustituirá a la actual.
      </p>
    </div>
  );
}
