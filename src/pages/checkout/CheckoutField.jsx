// Campo de texto reutilizable de los formularios del checkout
export default function CheckoutField({
  hint,
  label,
  max,
  min,
  name,
  onChange,
  required = false,
  type = "text",
  value,
}) {
  return (
    <label>
      <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </span>
      <input
        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        max={max}
        min={min}
        name={name}
        onChange={onChange}
        required={required}
        type={type}
        value={value}
      />
      {hint && (
        <span className="mt-1 block text-xs text-secondary">{hint}</span>
      )}
    </label>
  );
}
