const inputClassNames = {
  date: 'cursor-pointer rounded-md bg-surface-container-low px-2 py-1 text-sm [color-scheme:light]',
  default: 'p-0 placeholder:text-outline',
}

export default function HeroSearchField({
  label,
  name,
  onChange,
  type = 'text',
  value,
  ...inputProps
}) {
  const inputClassName =
    type === 'date' ? inputClassNames.date : inputClassNames.default

  return (
    <label className="px-4 py-2 md:border-r md:border-outline-variant">
      <span className="block text-xs font-bold uppercase text-secondary">
        {label}
      </span>
      <input
        className={`mt-1 w-full border-0 text-on-surface outline-none ${inputClassName}`}
        name={name}
        onChange={onChange}
        type={type}
        value={value}
        {...inputProps}
      />
    </label>
  )
}
