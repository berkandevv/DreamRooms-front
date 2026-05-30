export default function AuthFormField({
  autoComplete,
  label,
  name,
  onChange,
  placeholder = '',
  required = false,
  type = 'text',
  value,
}) {
  return (
    <div className="space-y-2">
      <label
        className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        id={name}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  )
}
