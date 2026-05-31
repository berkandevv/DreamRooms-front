import {
  FaChevronRight,
  FaDatabase,
  FaLock,
  FaShieldAlt,
  FaUserCheck,
} from 'react-icons/fa'
import { Link } from 'react-router'
import Layout from '../components/Layout'

const cityImage = '/images/static-pages/privacy-city.jpg'

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <section className="bg-surface py-12">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <article className="rounded-lg border border-outline-variant bg-surface-container-lowest p-7 shadow-sm md:p-10">
            <h1 className="text-4xl font-bold text-primary">
              Política de privacidad
            </h1>
            <p className="mt-3 text-sm text-secondary">
              Última actualización: Noviembre 2024
            </p>

            <PolicySection icon={FaDatabase} title="Recopilación de información">
              <p>
                En Dream Rooms recopilamos la información necesaria para operar
                reservas, inventario, pagos y cuentas de usuario de forma segura.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Datos de contacto del huésped y del propietario.</li>
                <li>Información de propiedades, habitaciones y disponibilidad.</li>
                <li>Registros de reservas, pagos y actividad dentro de la plataforma.</li>
              </ul>
            </PolicySection>

            <PolicySection icon={FaUserCheck} title="Uso de datos">
              <p>
                Utilizamos los datos para mantener la integridad de la plataforma
                y mejorar la operación diaria de propietarios y huéspedes.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoBox
                  body="Ajustes proactivos en disponibilidad, tarifas y visualización del inventario."
                  title="Optimización operativa"
                />
                <InfoBox
                  body="Alertas de seguridad, confirmaciones de reserva y comunicaciones esenciales."
                  title="Comunicación crítica"
                />
              </div>
              <div className="relative mt-8 overflow-hidden rounded-lg">
                <img
                  alt="Vista urbana nocturna desde un hotel"
                  className="h-64 w-full object-cover"
                  src={cityImage}
                />
                <div className="absolute inset-0 bg-primary/35" />
                <p className="absolute bottom-6 left-6 right-6 text-lg font-semibold italic text-on-primary">
                  La integridad de tus datos sostiene una experiencia hotelera
                  fiable.
                </p>
              </div>
            </PolicySection>

            <PolicySection icon={FaShieldAlt} title="Protección de la información">
              <p>
                Aplicamos medidas técnicas y organizativas para proteger la
                información frente al acceso no autorizado.
              </p>
              <div className="mt-5 border-l-4 border-primary bg-surface-container-low p-5">
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <FaLock className="mt-1 h-4 w-4 shrink-0" />
                    Cifrado para datos en tránsito y controles de acceso por rol.
                  </li>
                  <li className="flex gap-3">
                    <FaLock className="mt-1 h-4 w-4 shrink-0" />
                    Auditorías periódicas de seguridad y revisión de permisos.
                  </li>
                  <li className="flex gap-3">
                    <FaLock className="mt-1 h-4 w-4 shrink-0" />
                    Monitorización de actividad para detectar usos anómalos.
                  </li>
                </ul>
              </div>
            </PolicySection>

            <PolicySection icon={FaUserCheck} title="Tus derechos">
              <p>
                Puedes solicitar acceso, rectificación, portabilidad o eliminación
                de tus datos personales cuando corresponda.
              </p>
              <div className="mt-5 space-y-3">
                {['Acceso y rectificación', 'Portabilidad de datos', 'Solicitud de eliminación'].map(
                  (item) => (
                    <Link
                      className="flex items-center justify-between rounded-lg border border-outline-variant px-4 py-4 font-semibold text-primary transition hover:border-primary"
                      key={item}
                      to="/contact"
                    >
                      {item}
                      <FaChevronRight className="h-3 w-3" />
                    </Link>
                  ),
                )}
              </div>
              <p className="mt-5">
                Para cualquier consulta relacionada con privacidad, escríbenos a{' '}
                <a className="font-semibold underline" href="mailto:berkanraimov@gmail.com">
                  berkanraimov@gmail.com
                </a>
              </p>
            </PolicySection>
          </article>
        </div>
      </section>
    </Layout>
  )
}

function PolicySection({ children, icon: Icon, title }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
      </div>
      <div className="pl-0 leading-8 text-on-surface-variant md:pl-13">
        {children}
      </div>
    </section>
  )
}

function InfoBox({ body, title }) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-low p-5">
      <h3 className="font-bold text-primary">{title}</h3>
      <p className="mt-2 leading-7 text-on-surface-variant">{body}</p>
    </div>
  )
}
