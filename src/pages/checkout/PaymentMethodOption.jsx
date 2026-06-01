// Opción seleccionable de forma de pago (tarjeta o pago en hotel)
export default function PaymentMethodOption({
  checked,
  description,
  label,
  name,
  onChange,
  value,
}) {
  return (
    <label
      className={`cursor-pointer rounded-xl border p-4 transition ${
        checked
          ? "border-primary bg-secondary-container"
          : "border-outline-variant bg-surface hover:border-primary"
      }`}
    >
      <span className="flex items-start gap-3">
        <input
          checked={checked}
          className="mt-1 h-4 w-4 accent-primary"
          name={name}
          onChange={onChange}
          type="radio"
          value={value}
        />
        <span>
          <span className="block font-bold text-on-surface">{label}</span>
          <span className="mt-1 block text-sm text-secondary">
            {description}
          </span>
        </span>
      </span>
    </label>
  );
}
