import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import AuthFormField from '../components/AuthFormField'
import BrandLogo from '../components/BrandLogo'
import { loginUser } from '../services/authService'

const initialFormData = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [error, setError] = useState('')
  const comesFromRegister = location.state?.fromAuth === 'register'
  const enterAnimation = comesFromRegister ? 'auth-enter-left' : 'auth-enter-right'

  // Actualiza el valor de un campo del formulario
  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  // Inicia sesión con los datos introducidos
  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await loginUser(formData)
      navigate('/')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Abre el registro con una transición visual
  function handleRegisterNavigation(event) {
    event.preventDefault()
    setIsLeaving(true)

    window.setTimeout(() => {
      navigate('/register')
    }, 260)
  }

  return (
    <main
      className={`flex min-h-screen bg-surface text-on-surface ${
        isLeaving ? 'auth-exit-left' : enterAnimation
      }`}
    >
      <section className="flex w-full flex-col justify-center px-6 py-10 md:px-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Link aria-label="Dream Rooms" to="/">
              <BrandLogo />
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
            <AuthFormField
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

            <div className="flex justify-end">
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
                onClick={handleRegisterNavigation}
                to="/register"
              >
                Regístrate
              </Link>
            </p>
          </footer>
        </div>
      </section>

      <section className="relative hidden w-1/2 overflow-hidden bg-white lg:flex">
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-16 text-on-surface">
          <Link aria-label="Dream Rooms" to="/">
            <BrandLogo />
          </Link>

          <div className="mx-auto flex h-80 w-80 items-center justify-center rounded-2rem bg-white shadow-[0_24px_70px_rgba(19,27,46,0.12)]">
            <img
              alt="Dream Rooms"
              className="h-64 w-64 object-contain"
              src="/brand/logo.png"
            />
          </div>

          <div className="max-w-lg">
            <h2 className="mb-4 text-5xl font-bold leading-tight">
              Bienvenido de nuevo
            </h2>
            <p className="text-lg leading-8 text-secondary">
              Tu próximo refugio te espera. Accede para gestionar tus reservas
              y preferencias.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
