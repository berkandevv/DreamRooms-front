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
              Última actualización: 31 de mayo de 2026
            </p>

            <PolicySection icon={FaDatabase} title="Recopilación de información">
              <p>
                En Dream Rooms recopilamos la información necesaria para operar
                las cuentas, reservas y funciones de gestión de la plataforma.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Nombre, email y teléfono opcional de la cuenta.</li>
                <li>Información de propiedades, habitaciones y disponibilidad.</li>
                <li>Datos de reservas, huéspedes, pagos, favoritos y reseñas, incluidas las fotos que subas con tus comentarios.</li>
              </ul>
            </PolicySection>

            <PolicySection icon={FaUserCheck} title="Uso de datos">
              <p>
                Utilizamos los datos para prestar las funciones solicitadas por
                viajeros y propietarios dentro de Dream Rooms.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoBox
                  body="Consulta de disponibilidad, creación y gestión de reservas y publicación de reseñas."
                  title="Gestión de estancias"
                />
                <InfoBox
                  body="Administración de alojamientos, habitaciones, disponibilidad y pagos manuales."
                  title="Panel de propietario"
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
                  Utilizamos la información necesaria para prestar las
                  funciones disponibles en la plataforma.
                </p>
              </div>
            </PolicySection>

            <PolicySection icon={FaShieldAlt} title="Protección de la información">
              <p>
                Limitamos el acceso a las funciones privadas mediante
                autenticación y permisos según el tipo de cuenta.
              </p>
              <div className="mt-5 border-l-4 border-primary bg-surface-container-low p-5">
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <FaLock className="mt-1 h-4 w-4 shrink-0" />
                    Acceso a la API privada mediante token de autenticación.
                  </li>
                  <li className="flex gap-3">
                    <FaLock className="mt-1 h-4 w-4 shrink-0" />
                    Separación de permisos para cuentas de cliente y propietario.
                  </li>
                  <li className="flex gap-3">
                    <FaLock className="mt-1 h-4 w-4 shrink-0" />
                    Revocación del token al cerrar sesión y de todos los tokens
                    al desactivar la cuenta.
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
