import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function PartnerCTA() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    const params = new URLSearchParams({
      account_type: 'owner',
    })

    if (email) {
      params.set('email', email)
    }

    navigate(`/register?${params.toString()}`)
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-outline-variant bg-surface-container p-8 md:flex-row">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl font-bold text-on-surface">
            Colabora con Dream Rooms
          </h2>
          <p className="mt-2 text-secondary">
            Gestiona tu propiedad y llega a nuevos viajeros desde una plataforma
            sencilla
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
          onSubmit={handleSubmit}
        >
          <input
            className="min-w-0 rounded-lg border border-outline bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-primary sm:min-w-72"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email de empresa"
            type="email"
            value={email}
          />
          <button
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary transition hover:opacity-90"
            type="submit"
          >
            Empezar
          </button>
        </form>
      </div>
    </section>
  )
}
