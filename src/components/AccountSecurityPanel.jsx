import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  deactivateAuthenticatedAccount,
  updateAuthenticatedPassword,
} from '../services/authService'

const initialPasswordForm = {
  current_password: '',
  password: '',
  password_confirmation: '',
}

export default function AccountSecurityPanel() {
  const navigate = useNavigate()
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm)
  const [deactivationPassword, setDeactivationPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)

  // Actualiza los datos del formulario de contraseña
  function updatePasswordForm(event) {
    const { name, value } = event.target

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  // Guarda la contraseña nueva después de validar la contraseña actual
  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setIsChangingPassword(true)
    setError('')
    setMessage('')

    try {
      await updateAuthenticatedPassword(passwordForm)
      setPasswordForm(initialPasswordForm)
      setMessage('Contraseña actualizada correctamente.')
    } catch (passwordError) {
      setError(passwordError.message)
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Desactiva la cuenta solo después de confirmarlo explícitamente
  async function handleAccountDeactivation(event) {
    event.preventDefault()

    const shouldDeactivate = window.confirm(
      '¿Seguro que quieres eliminar tu cuenta? No podrás volver a iniciar sesión.',
    )

    if (!shouldDeactivate) {
      return
    }

    setIsDeactivating(true)
    setError('')
    setMessage('')

    try {
      await deactivateAuthenticatedAccount({
        current_password: deactivationPassword,
      })
      navigate('/login', { replace: true })
    } catch (deactivationError) {
      setError(deactivationError.message)
      setIsDeactivating(false)
    }
  }

  return (
    <section className="space-y-6">
      {error && (
        <p className="rounded-lg border border-error bg-error-container p-3 text-sm font-semibold text-error">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-lg border border-outline-variant bg-secondary-container p-3 text-sm font-semibold text-on-secondary-fixed">
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
          <h2 className="text-xl font-bold text-primary">Cambiar contraseña</h2>
          <p className="mt-2 text-sm leading-6 text-secondary">
            Introduce tu contraseña actual antes de guardar una nueva.
          </p>

          <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit}>
            <PasswordInput
              autoComplete="current-password"
              label="Contraseña actual"
              name="current_password"
              onChange={updatePasswordForm}
              value={passwordForm.current_password}
            />
            <PasswordInput
              autoComplete="new-password"
              label="Nueva contraseña"
              minLength="8"
              name="password"
              onChange={updatePasswordForm}
              value={passwordForm.password}
            />
            <PasswordInput
              autoComplete="new-password"
              label="Confirmar nueva contraseña"
              minLength="8"
              name="password_confirmation"
              onChange={updatePasswordForm}
              value={passwordForm.password_confirmation}
            />
            <button
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isChangingPassword}
              type="submit"
            >
              {isChangingPassword ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-error/40 bg-error-container/30 p-5 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
          <h2 className="text-xl font-bold text-error">Eliminar cuenta</h2>

          <form className="mt-5 space-y-4" onSubmit={handleAccountDeactivation}>
            <PasswordInput
              autoComplete="current-password"
              label="Confirma tu contraseña"
              name="deactivation_password"
              onChange={(event) => setDeactivationPassword(event.target.value)}
              value={deactivationPassword}
            />
            <button
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-error px-5 font-semibold text-on-error transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeactivating}
              type="submit"
            >
              {isDeactivating ? 'Eliminando...' : 'Eliminar mi cuenta'}
            </button>
          </form>
        </article>
      </div>
    </section>
  )
}

function PasswordInput({ label, name, onChange, value, ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-secondary">
        {label}
      </span>
      <div className="relative mt-2">
        <input
          className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 pr-24 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          name={name}
          onChange={onChange}
          required
          type={showPassword ? 'text' : 'password'}
          value={value}
          {...props}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
          onClick={() => setShowPassword((isVisible) => !isVisible)}
          type="button"
        >
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </label>
  )
}
