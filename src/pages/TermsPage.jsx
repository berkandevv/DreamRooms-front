import { FaClock } from 'react-icons/fa'
import Layout from '../components/Layout'

const termsImage =
  'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1600'

const sections = [
  'Aceptación de términos',
  'Uso de la plataforma',
  'Reservas y pagos',
  'Cancelaciones',
]

export default function TermsPage() {
  return (
    <Layout>
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-primary md:text-5xl">
              Términos y condiciones
            </h1>
            <p className="mt-5 text-lg leading-8 text-on-surface-variant">
              Estos términos regulan el uso de Dream Rooms como plataforma de
              gestión de inventario, reservas y operaciones para alojamientos.
            </p>
            <p className="mt-5 flex items-center gap-3 text-sm font-semibold text-primary">
              <FaClock className="h-4 w-4" />
              Última actualización: 24 de Mayo, 2024
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <nav className="sticky top-24 space-y-4 border-l border-outline-variant pl-5 text-sm font-semibold text-secondary">
                {sections.map((section, index) => (
                  <a
                    className="block hover:text-primary"
                    href={`#term-${index + 1}`}
                    key={section}
                  >
                    {index + 1}. {section}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="space-y-9">
              <section id="term-1">
                <h2 className="text-2xl font-bold text-primary">
                  1. Aceptación de términos
                </h2>
                <div className="mt-4 space-y-4 leading-8 text-on-surface-variant">
                  <p>
                    Al acceder o utilizar los servicios proporcionados por Dream
                    Rooms, aceptas estos términos en su totalidad. Si no estás de
                    acuerdo con alguna parte, no debes utilizar la plataforma.
                  </p>
                  <p>
                    Dream Rooms puede actualizar estos términos para reflejar
                    mejoras operativas, cambios legales o nuevas funcionalidades.
                  </p>
                </div>
              </section>

              <section
                className="rounded-lg border border-outline-variant bg-surface-container-lowest p-7 shadow-sm"
                id="term-2"
              >
                <h2 className="text-2xl font-bold text-primary">
                  2. Uso de la plataforma
                </h2>
                <p className="mt-4 leading-8 text-on-surface-variant">
                  Dream Rooms está diseñada para la gestión profesional de
                  inventario hotelero. El usuario se compromete a:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-on-surface-variant">
                  <li>Mantener la confidencialidad de sus credenciales.</li>
                  <li>Publicar información veraz sobre disponibilidad y tarifas.</li>
                  <li>No usar la plataforma para actividades ilícitas.</li>
                  <li>Cargar imágenes y descripciones que representen fielmente cada alojamiento.</li>
                </ul>
              </section>

              <section id="term-3">
                <h2 className="text-2xl font-bold text-primary">
                  3. Reservas y pagos
                </h2>
                <p className="mt-4 leading-8 text-on-surface-variant">
                  El sistema procesa reservas en tiempo real. Al confirmar una
                  reserva, el usuario acepta las condiciones comerciales visibles
                  durante el flujo de compra.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TermBox
                    body="Se aplicará una tarifa de gestión sobre el valor total de cada reserva confirmada."
                    title="Comisiones"
                  />
                  <TermBox
                    body="Las liquidaciones se realizarán tras la validación del check-out del huésped."
                    title="Ciclo de pago"
                  />
                </div>
              </section>

              <section id="term-4">
                <h2 className="text-2xl font-bold text-primary">
                  4. Cancelaciones
                </h2>
                <p className="mt-4 leading-8 text-on-surface-variant">
                  Nuestra política de cancelación protege al operador y al
                  huésped, manteniendo la estabilidad financiera del inventario.
                </p>
                <div className="mt-5 rounded-lg border border-secondary-container bg-secondary-container/35 p-7 leading-8 text-on-surface-variant">
                  <p className="font-semibold italic text-primary">
                    Las cancelaciones con menos de 48 horas de antelación pueden
                    estar sujetas a penalización.
                  </p>
                  <p className="mt-4">
                    En caso de fuerza mayor o incidencias técnicas, Dream Rooms
                    actuará como mediador para resolver la situación con datos de
                    reserva completos.
                  </p>
                </div>
              </section>

              <div className="relative overflow-hidden rounded-lg">
                <img
                  alt="Lobby elegante de hotel"
                  className="h-90 w-full object-cover"
                  src={termsImage}
                />
                <div className="absolute inset-0 bg-primary/35" />
                <p className="absolute bottom-7 left-7 right-7 max-w-xl text-2xl font-bold leading-8 text-on-primary">
                  Comprometidos con la excelencia en la gestión hospitalaria.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function TermBox({ body, title }) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5">
      <h3 className="font-bold text-primary">{title}</h3>
      <p className="mt-2 leading-7 text-on-surface-variant">{body}</p>
    </div>
  )
}
