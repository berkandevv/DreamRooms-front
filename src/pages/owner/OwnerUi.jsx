import { getStatusClass } from './ownerHelpers'

// Muestra una tarjeta con una métrica del panel
export function StatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
      <p className="text-sm font-semibold text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
    </article>
  )
}

// Muestra una tarjeta contenedora del panel
export function PanelCard({ action, children, onAction, title }) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        {action && (
          <button
            className="text-sm font-semibold text-secondary underline transition hover:text-primary"
            onClick={onAction}
            type="button"
          >
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

// Muestra una etiqueta visual para estados
export function StatusBadge({ label = '', status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClass(status)}`}
    >
      {label ? `${label}: ` : ''}
      {status || 'unknown'}
    </span>
  )
}

// Muestra una métrica pequeña dentro de una tarjeta
export function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-surface-container p-3">
      <p className="text-xs font-bold uppercase tracking-widest text-secondary">
        {label}
      </p>
      <p className="mt-1 font-bold text-primary">{value}</p>
    </div>
  )
}

// Muestra un campo de texto del panel
export function TextInput({ label, name, onChange, value, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-secondary">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        name={name}
        onChange={onChange}
        value={value}
        {...props}
      />
    </label>
  )
}

// Muestra un campo de texto largo del panel
export function TextArea({ label, name, onChange, value }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-secondary">
        {label}
      </span>
      <textarea
        className="mt-2 min-h-28 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        name={name}
        onChange={onChange}
        value={value}
      />
    </label>
  )
}

// Muestra un selector del panel
export function SelectInput({ children, label, name, onChange, value }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-secondary">
        {label}
      </span>
      <select
        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        name={name}
        onChange={onChange}
        value={value}
      >
        {children}
      </select>
    </label>
  )
}

// Muestra una casilla de verificación del panel
export function CheckboxInput({ checked, label, name, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-secondary">
      <input
        checked={checked}
        className="h-4 w-4 accent-primary"
        name={name}
        onChange={onChange}
        type="checkbox"
      />
      {label}
    </label>
  )
}

// Muestra el botón principal de los formularios del panel
export function PrimaryButton({ children, disabled }) {
  return (
    <button
      className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 font-semibold text-on-primary transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  )
}
