import { Link } from 'react-router'
import AccountSecurityPanel from '../components/AccountSecurityPanel'
import Layout from '../components/Layout'
import { getAuthToken } from '../services/authService'

export default function AccountPage() {
  const isAuthenticated = Boolean(getAuthToken())

  if (!isAuthenticated) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
            <h1 className="text-3xl font-bold text-on-surface">
              Inicia sesión para gestionar tu cuenta
            </h1>
            <Link
              className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 font-semibold text-on-primary transition hover:opacity-90"
              to="/login"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary">Mi cuenta</h1>
          <p className="mt-2 text-secondary">
            Gestiona la seguridad y el estado de tu cuenta
          </p>
        </header>

        <AccountSecurityPanel />
      </section>
    </Layout>
  )
}
