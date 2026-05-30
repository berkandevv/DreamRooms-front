import PartnerRegistrationForm from './PartnerRegistrationForm'

export default function PartnerCTA() {
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

        <PartnerRegistrationForm
          className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
          inputClassName="min-w-0 rounded-lg border border-outline bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-primary sm:min-w-72"
        />
      </div>
    </section>
  )
}
