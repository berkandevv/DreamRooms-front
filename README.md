# Dream Rooms Front

Frontend de Dream Rooms, una aplicación web para buscar hoteles, consultar habitaciones, crear reservas y gestionar alojamientos desde un panel de propietario.

El proyecto está hecho con React, Vite, React Router y Tailwind CSS.

> La forma recomendada de levantar todo el entorno (frontend, API y panel) es el
> repositorio principal con Docker. Estas instrucciones son para arrancar **solo
> el frontend a mano**, sin Docker, clonando este repositorio por separado.

## Funcionalidades principales

- Listado de hoteles con filtros por comunidad autónoma, ciudad, estrellas, precio y servicios
- Detalle de hotel con habitaciones, servicios, reseñas y comprobación de disponibilidad
- Checkout para crear reservas
- Registro e inicio de sesión de clientes y propietarios
- Página de reservas del cliente
- Panel de propietario para gestionar hoteles, habitaciones, disponibilidad, reservas y pagos
- Páginas informativas: contacto, ayuda, privacidad, condiciones y sobre nosotros

## Requisitos

- Node.js
- npm
- Backend/API de Dream Rooms levantado en `http://localhost:8000/api`

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación se abrirá normalmente en:

```txt
http://localhost:5173
```

## Scripts disponibles

```bash
npm run dev
```

Arranca el servidor de desarrollo con Vite

```bash
npm run build
```

Genera la versión de producción

```bash
npm run preview
```

Previsualiza la versión generada para producción

```bash
npm run lint
```

Revisa el código con ESLint

## Estructura del proyecto

```txt
src/
  components/       Componentes reutilizables de la interfaz
  config/           Configuración compartida, como la URL base de la API
  pages/            Páginas principales de la aplicación
  pages/bookings/   Componentes y helpers de reservas del cliente
  pages/hotels/     Lógica reutilizable del catálogo de hoteles
  pages/owner/      Componentes, formularios y helpers del panel de propietario
  services/         Funciones que se comunican con la API
  utils/            Funciones pequeñas para formatear, calcular o reutilizar lógica
```

## Servicios

Los archivos de `src/services` centralizan las llamadas al backend:

- `authService.js`: autenticación, sesión y usuario actual
- `hotelService.js`: hoteles y reseñas públicas
- `roomTypeService.js`: disponibilidad de habitaciones
- `customerBookingService.js`: reservas del cliente
- `ownerService.js`: panel de propietario

## Notas

La URL base de la API está centralizada en `src/config/api.js`. Si el backend cambia de puerto o dominio, solo hay que actualizar esa constante.
