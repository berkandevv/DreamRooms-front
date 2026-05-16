import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginUser } from '../services/authService'

const initialFormData = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [rememberSession, setRememberSession] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const result = await loginUser(formData)

      if (!rememberSession) {
        const token = result.token || result.access_token || result.data?.token
        const user = result.user || result.data?.user

        sessionStorage.setItem('auth_token', token)
        sessionStorage.setItem('token_type', result.token_type || 'Bearer')

        if (user) {
          sessionStorage.setItem('auth_user', JSON.stringify(user))
        }

        localStorage.removeItem('auth_token')
        localStorage.removeItem('token_type')
        localStorage.removeItem('auth_user')
      }

      navigate('/')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen bg-surface text-on-surface">
      <section className="flex w-full flex-col justify-center px-6 py-10 md:px-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Link className="text-2xl font-bold text-primary" to="/">
              Dream Rooms
            </Link>
          </div>

          <header className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-on-surface">
              Iniciar sesión
            </h1>
            <p className="text-on-surface-variant">
              Accede a tu cuenta de Dream Rooms
            </p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              autoComplete="email"
              label="Correo electrónico"
              name="email"
              onChange={handleInputChange}
              placeholder="nombre@email.com"
              required
              type="email"
              value={formData.email}
            />

            <div className="space-y-2">
              <label
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                htmlFor="password"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 pr-24 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  id="password"
                  name="password"
                  onChange={handleInputChange}
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                  type="button"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-3 text-sm font-semibold text-on-surface-variant">
                <input
                  checked={rememberSession}
                  className="h-4 w-4 accent-primary"
                  onChange={(event) =>
                    setRememberSession(event.target.checked)
                  }
                  type="checkbox"
                />
                Recordarme
              </label>

              <a
                className="text-sm font-semibold text-primary hover:underline"
                href="#"
              >
                ¿Olvidé mi contraseña?
              </a>
            </div>

            {error && (
              <p className="rounded-lg border border-error bg-error-container p-3 text-sm font-semibold text-error">
                {error}
              </p>
            )}

            <button
              className="w-full rounded-lg bg-primary px-4 py-4 font-semibold text-on-primary shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <footer className="mt-10 border-t border-outline-variant/40 pt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              ¿No tienes una cuenta?{' '}
              <Link
                className="font-bold text-primary hover:underline"
                to="/register"
              >
                Regístrate
              </Link>
            </p>
          </footer>
        </div>
      </section>

      <section className="relative hidden w-1/2 overflow-hidden bg-primary-container lg:flex">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-overlay"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyV4mLzwCrs5mZ8AFOlmqIUmKNfvZz0QJE4M-sq_hHk5zSFkA4Qw5l1mlKUkRlSfWXgovkZXJPteiDvdrNK77vJPPhaREtzX-ccDq1ty4-crYfiAjl5xZLpXBHJXuWuXoNCrqFEVq9lam2JypdxY5AWBnkYQfLtD9cO5zJ3OT5r3vWtkWXYxboekrXG67o15kOUJvrL9cXCMWQdHBNVRqoK_OQAIxtlAVuhtyRq2NajVUfOkXbjpuN7OuRBDnDfW835Kkf8WmpgcE"
        />
        <div className="relative z-10 flex h-full w-full flex-col justify-between bg-gradient-to-t from-black/70 via-black/20 to-transparent p-16 text-white">
          <Link className="text-2xl font-bold text-white" to="/">
            Dream Rooms
          </Link>

          <div className="max-w-lg">
            <h2 className="mb-4 text-5xl font-bold leading-tight">
              Bienvenido de nuevo
            </h2>
            <p className="text-lg leading-8 text-white/90">
              Tu próximo refugio te espera. Accede para gestionar tus reservas
              y preferencias.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function FormField({
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
