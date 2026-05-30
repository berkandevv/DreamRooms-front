import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function PartnerRegistrationForm({
  buttonLabel = 'Empezar',
  className = '',
  inputClassName = '',
}) {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  // Abre el registro de propietario con el email indicado
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
    <form className={className} onSubmit={handleSubmit}>
      <input
        className={inputClassName}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email de empresa"
        type="email"
        value={email}
      />
      <button
        className="rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary transition hover:opacity-90"
        type="submit"
      >
        {buttonLabel}
      </button>
    </form>
  )
}
