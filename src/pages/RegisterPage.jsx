import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { registerUser } from '../services/authService'

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
}

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const initialAccountType =
    searchParams.get('account_type') === 'owner' ? 'owner' : 'customer'
  const initialEmail = searchParams.get('email') || ''
  const [ownerEmail, setOwnerEmail] = useState(initialEmail)
  const [accountType, setAccountType] = useState(initialAccountType)
  const [formData, setFormData] = useState({
    ...initialFormData,
    email: initialEmail,
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const isOwner = accountType === 'owner'

  function handleInputChange(event) {
    const { name, value } = event.target

    if (name === 'email' && accountType === 'owner') {
      setOwnerEmail(value)
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleAccountTypeChange(type) {
    setAccountType(type)
    setFormData((currentData) => ({
      ...currentData,
      email: type === 'owner' ? ownerEmail : '',
    }))
    setError('')
    setSuccessMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!termsAccepted) {
      setError('Debes aceptar las condiciones para crear la cuenta')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      await registerUser({
        ...formData,
        account_type: accountType,
      })
      setSuccessMessage('¡Cuenta creada correctamente!')
      setFormData(initialFormData)
      setTermsAccepted(false)
    } catch (registerError) {
      setError(registerError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface text-on-surface md:flex-row">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-surface-container-low p-16 md:flex">
        <div className="relative z-10">
          <Link className="text-2xl font-bold text-primary" to="/">
            Dream Rooms
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="mb-8 text-5xl font-bold leading-tight text-on-surface">
            {isOwner
              ? 'Haz crecer tu alojamiento con una audiencia global'
              : 'Tu próxima estancia empieza con una cuenta sencilla'}
          </h1>

          <div className="space-y-8">
            <FeatureItem
              description={
                isOwner
                  ? 'Presenta tus propiedades a viajeros que buscan alojamientos cuidados'
                  : 'Descubre hoteles seleccionados y guarda tus futuras reservas'
              }
              icon="✓"
              title={isOwner ? 'Más visibilidad' : 'Estancias seleccionadas'}
            />
            <FeatureItem
              description={
                isOwner
                  ? 'Consulta actividad, reservas y rendimiento desde tu panel'
                  : 'Gestiona tus datos y reservas desde una experiencia clara'
              }
              icon="↗"
              title={isOwner ? 'Panel de gestión' : 'Reserva sin complicaciones'}
            />
            <FeatureItem
              description="Dream Rooms protege el acceso con token personal para mantener tu sesión segura"
              icon="□"
              title="Acceso seguro"
            />
          </div>
        </div>

        <p className="relative z-10 text-sm font-semibold text-on-surface-variant">
          Plataforma para viajeros y propietarios de alojamientos
        </p>

        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-10"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn_IB-fM554WFwwqEw3ij89i0scKwUlSuQAFSRWyzEMwR2GKw3hiZHIDZ76hbwViQyB4p9h4GWpRckjhDh7wlv5iCFsPt2USxDi4sg71Orh5ww5vUn20GsQ4patjBUL7OUFKQZ0_vrgfuNv0FnIBBNNQ6DUOsu8mAXAzWyUwG_i_610vyXVzJlkTbmDtWFikebuxZzx6IWA-lu6ZdXUbS-SYqFhGBebXAhTVZMLJt4HcuZG7tDXudR1SdNofz9lAU6nXWbqbxSoFk"
        />
      </section>

      <section className="flex flex-1 items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:hidden">
            <Link className="text-2xl font-bold text-primary" to="/">
              Dream Rooms
            </Link>
          </div>

          <header className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-on-surface">
              {isOwner ? 'Registro de propietario' : 'Registro de cliente'}
            </h2>
            <p className="text-on-surface-variant">
              {isOwner
                ? 'Crea tu cuenta para empezar a gestionar tus alojamientos'
                : 'Crea tu cuenta para reservar y gestionar tus estancias'}
            </p>
          </header>

          <div className="mb-8 flex max-w-xs rounded-full bg-surface-container p-1">
            <button
              className={`flex-1 rounded-full py-2 text-sm font-bold uppercase tracking-wider transition ${
                !isOwner
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
              onClick={() => handleAccountTypeChange('customer')}
              type="button"
            >
              Customer
            </button>
            <button
              className={`flex-1 rounded-full py-2 text-sm font-bold uppercase tracking-wider transition ${
                isOwner
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
              onClick={() => handleAccountTypeChange('owner')}
              type="button"
            >
              Owner
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              label="Nombre completo"
              name="name"
              onChange={handleInputChange}
              placeholder="Ej. Julia Alexandria"
              required
              value={formData.name}
            />
            <FormField
              label="Email"
              name="email"
              onChange={handleInputChange}
              placeholder="nombre@email.com"
              required
              type="email"
              value={formData.email}
            />
            <FormField
              label="Teléfono"
              name="phone"
              onChange={handleInputChange}
              placeholder="+34 600 000 000"
              required
              type="tel"
              value={formData.phone}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Contraseña"
                name="password"
                onChange={handleInputChange}
                required
                type="password"
                value={formData.password}
              />
              <FormField
                label="Confirmar"
                name="password_confirmation"
                onChange={handleInputChange}
                required
                type="password"
                value={formData.password_confirmation}
              />
            </div>

            <label className="flex items-start gap-3 py-2 text-sm leading-snug text-on-surface-variant">
              <input
                checked={termsAccepted}
                className="mt-1 h-4 w-4 accent-primary"
                onChange={(event) => setTermsAccepted(event.target.checked)}
                required
                type="checkbox"
              />
              <span>
                Acepto las condiciones del servicio y el acuerdo de uso de
                Dream Rooms
              </span>
            </label>

            {error && (
              <p className="rounded-lg border border-error bg-error-container p-3 text-sm font-semibold text-error">
                {error}
              </p>
            )}

            {successMessage && (
              <p className="rounded-lg border border-outline-variant bg-secondary-container p-3 text-sm font-semibold text-on-secondary-fixed">
                {successMessage}
              </p>
            )}

            <button
              className="w-full rounded-lg bg-primary px-4 py-4 font-semibold text-on-primary shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? 'Creando cuenta...'
                : isOwner
                  ? 'Crear cuenta de propietario'
                  : 'Crear cuenta de cliente'}
            </button>
          </form>

          <footer className="mt-10 border-t border-outline-variant/40 pt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              ¿Ya tienes cuenta?{' '}
              <Link className="font-bold text-primary hover:underline" to="/login">
                Inicia sesión
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  )
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container font-bold text-primary">
        {icon}
      </span>
      <div>
        <h3 className="mb-1 text-xl font-bold text-on-surface">{title}</h3>
        <p className="leading-relaxed text-on-surface-variant">{description}</p>
      </div>
    </div>
  )
}

function FormField({
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
