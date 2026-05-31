import { useEffect, useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router'
import { getAuthToken } from '../services/authService'
import {
  bulkUpdateOwnerAvailability,
  createOwnerBookingPayment,
  createOwnerHotel,
  createOwnerRoomType,
  getOwnerBookings,
  getOwnerHotel,
  getOwnerHotels,
  getOwnerRoomType,
  getOwnerRoomTypeAvailability,
  getOwnerRoomTypes,
  getOwnerServices,
  updateOwnerBookingStatus,
  updateOwnerHotel,
  updateOwnerRoomType,
  uploadOwnerHotelImage,
  uploadOwnerRoomTypeImage,
} from '../services/ownerService'
import { formatPrice } from '../utils/formatPrice'
import { formatSquareMeters } from '../utils/formatSquareMeters'
import { updateFormFromEvent } from '../utils/formUtils'
import {
  bookingStatuses,
  buildAvailabilityItems,
  buildHotelPayload,
  buildImageFormData,
  buildRoomTypePayload,
  initialAvailabilityForm,
  initialHotelForm,
  initialRoomTypeForm,
  mapHotelToForm,
  mapRoomTypeToForm,
  paymentStatuses,
} from './owner/ownerForms'
import {
  getLocationText,
  getTotalBookingAmount,
  getStatusLabel,
} from './owner/ownerHelpers'
import BookingRow from './owner/BookingRow'
import AvailabilityPreview from './owner/AvailabilityPreview'
import OwnerShell from './owner/OwnerShell'
import {
  getAvailabilityPreviewRange,
  getAvailabilityRanges,
  getSpecialAvailabilityDays,
} from './owner/availabilityHelpers'
import {
  CheckboxInput,
  Metric,
  PanelCard,
  PrimaryButton,
  SelectInput,
  StatCard,
  StatusBadge,
  TextArea,
  TextInput,
} from './owner/OwnerUi'

const OWNER_ACTIVE_VIEW_STORAGE_KEY = 'owner_active_view'
const ownerViews = new Set([
  'dashboard',
  'inventory',
  'bookings',
  'new-property',
  'settings',
])

// Obtiene la vista inicial guardada del panel
function getInitialOwnerView() {
  const storedView = sessionStorage.getItem(OWNER_ACTIVE_VIEW_STORAGE_KEY)

  return ownerViews.has(storedView) ? storedView : 'dashboard'
}

// Filtra los servicios disponibles para una sección
function getServicesForScope(services, scope) {
  return services.filter((service) => {
    return service.scope === scope || service.scope === 'both'
  })
}

// Sustituye un elemento de una lista por su versión actualizada
function replaceItemById(items, updatedItem) {
  return items.map((item) => {
    return String(item.id) === String(updatedItem.id) ? updatedItem : item
  })
}

export default function OwnerPanelPage() {
  const [activeView, setActiveView] = useState(getInitialOwnerView)
  const [hotels, setHotels] = useState([])
  const [bookings, setBookings] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [availabilityPreview, setAvailabilityPreview] = useState([])
  const [isAvailabilityPreviewLoading, setIsAvailabilityPreviewLoading] =
    useState(false)
  const [availabilityPreviewError, setAvailabilityPreviewError] = useState('')
  const [hotelServices, setHotelServices] = useState([])
  const [roomTypeServices, setRoomTypeServices] = useState([])
  const [selectedHotelId, setSelectedHotelId] = useState('')
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState('')
  const [bookingHotelFilter, setBookingHotelFilter] = useState('')
  const [bookingFilters, setBookingFilters] = useState({
    payment_status: '',
    status: '',
  })
  const [hotelForm, setHotelForm] = useState(initialHotelForm)
  const [roomTypeForm, setRoomTypeForm] = useState(initialRoomTypeForm)
  const [editHotelForm, setEditHotelForm] = useState(initialHotelForm)
  const [editRoomTypeForm, setEditRoomTypeForm] = useState(initialRoomTypeForm)
  const [availabilityForm, setAvailabilityForm] = useState(initialAvailabilityForm)
  const [closeDate, setCloseDate] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(getAuthToken()))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const isAuthenticated = Boolean(getAuthToken())

  // Calcula las métricas principales del panel
  const stats = useMemo(() => {
    const activeHotels = hotels.filter((hotel) => hotel.status === 'published').length
    const pendingBookings = bookings.filter(
      (booking) => booking.status === 'pending',
    ).length
    const confirmedBookings = bookings.filter(
      (booking) => booking.status === 'confirmed',
    ).length
    const revenue = bookings.reduce((total, booking) => {
      return total + (Number(booking.amounts?.total) || 0)
    }, 0)

    return { activeHotels, confirmedBookings, pendingBookings, revenue }
  }, [bookings, hotels])

  useEffect(() => {
    sessionStorage.setItem(OWNER_ACTIVE_VIEW_STORAGE_KEY, activeView)
  }, [activeView])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    Promise.all([
      getOwnerHotels(),
      getOwnerBookings(),
      getOwnerServices(),
    ])
      .then(([hotelData, bookingData, serviceData]) => {
        setHotels(hotelData)
        setBookings(bookingData)
        setHotelServices(getServicesForScope(serviceData, 'hotel'))
        setRoomTypeServices(getServicesForScope(serviceData, 'room_type'))
        setSelectedHotelId(hotelData[0]?.id || '')
        setEditHotelForm(mapHotelToForm(hotelData[0]))
        setError('')
      })
      .catch((loadError) => {
        setError(loadError.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isAuthenticated])

  useEffect(() => {
    if (!selectedHotelId) {
      return
    }

    getOwnerRoomTypes(selectedHotelId)
      .then((data) => {
        setRoomTypes(data)
        setSelectedRoomTypeId(data[0]?.id || '')
        setEditRoomTypeForm(mapRoomTypeToForm(data[0]))
      })
      .catch((loadError) => {
        setError(loadError.message)
      })
  }, [selectedHotelId])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    getOwnerBookings({
      hotel_id: bookingHotelFilter,
      ...bookingFilters,
    })
      .then((data) => {
        setBookings(data)
      })
      .catch((loadError) => {
        setError(loadError.message)
      })
  }, [bookingFilters, bookingHotelFilter, isAuthenticated])

  useEffect(() => {
    if (!selectedRoomTypeId) {
      return
    }

    let shouldIgnoreResponse = false
    const previewRange = getAvailabilityPreviewRange()

    Promise.resolve()
      .then(() => {
        if (shouldIgnoreResponse) {
          return []
        }

        setIsAvailabilityPreviewLoading(true)
        setAvailabilityPreviewError('')

        return getOwnerRoomTypeAvailability(
          selectedRoomTypeId,
          previewRange.from,
          previewRange.to,
        )
      })
      .then((data) => {
        if (shouldIgnoreResponse) {
          return
        }

        setAvailabilityPreview(data)
      })
      .catch((loadError) => {
        if (shouldIgnoreResponse) {
          return
        }

        setAvailabilityPreview([])
        setAvailabilityPreviewError(loadError.message)
      })
      .finally(() => {
        if (!shouldIgnoreResponse) {
          setIsAvailabilityPreviewLoading(false)
        }
      })

    return () => {
      shouldIgnoreResponse = true
    }
  }, [selectedRoomTypeId])

  // Actualiza el formulario de creación de hoteles
  function updateHotelForm(event) {
    updateFormFromEvent(setHotelForm, event)
  }

  // Actualiza el formulario de creación de habitaciones
  function updateRoomTypeForm(event) {
    updateFormFromEvent(setRoomTypeForm, event)
  }

  // Actualiza el formulario de disponibilidad
  function updateAvailabilityForm(event) {
    updateFormFromEvent(setAvailabilityForm, event)
  }

  // Actualiza la fecha que se va a cerrar
  function updateCloseDate(event) {
    setCloseDate(event.target.value)
  }

  // Actualiza el formulario de edición del hotel
  function updateEditHotelForm(event) {
    updateFormFromEvent(setEditHotelForm, event)
  }

  // Actualiza el formulario de edición de la habitación
  function updateEditRoomTypeForm(event) {
    updateFormFromEvent(setEditRoomTypeForm, event)
  }

  // Cambia el hotel seleccionado en el panel
  function handleSelectedHotelChange(hotelId) {
    const hotel = hotels.find((currentHotel) => {
      return String(currentHotel.id) === String(hotelId)
    })

    setSelectedHotelId(hotelId)
    setEditHotelForm(mapHotelToForm(hotel))
  }

  // Cambia la habitación seleccionada en el panel
  function handleSelectedRoomTypeChange(roomTypeId) {
    const roomType = roomTypes.find((currentRoomType) => {
      return String(currentRoomType.id) === String(roomTypeId)
    })

    setSelectedRoomTypeId(roomTypeId)
    setEditRoomTypeForm(mapRoomTypeToForm(roomType))
  }

  // Recarga el resumen de disponibilidad mostrado en inventario
  async function refreshAvailabilityPreview(roomTypeId) {
    const previewRange = getAvailabilityPreviewRange()
    const previewData = await getOwnerRoomTypeAvailability(
      roomTypeId,
      previewRange.from,
      previewRange.to,
    )

    setAvailabilityPreview(previewData)
  }

  // Crea un hotel y sube su imagen si existe
  async function handleCreateHotel(event) {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const createdHotel = await createOwnerHotel(buildHotelPayload(hotelForm))
      const imageFormData = buildImageFormData(hotelForm, createdHotel.name)
      const hotel = imageFormData
        ? await uploadOwnerHotelImage(createdHotel.id, imageFormData).then(() =>
            getOwnerHotel(createdHotel.id),
          )
        : createdHotel

      setHotels((currentHotels) => [hotel, ...currentHotels])
      setSelectedHotelId(hotel.id)
      setHotelForm(initialHotelForm)
      setMessage('Hotel creado correctamente.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Crea una habitación y sube su imagen si existe
  async function handleCreateRoomType(event) {
    event.preventDefault()

    if (!selectedHotelId) {
      setError('Selecciona un hotel antes de crear una habitación.')
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      const createdRoomType = await createOwnerRoomType(
        selectedHotelId,
        buildRoomTypePayload(roomTypeForm),
      )
      const imageFormData = buildImageFormData(roomTypeForm, createdRoomType.name)
      const roomType = imageFormData
        ? await uploadOwnerRoomTypeImage(createdRoomType.id, imageFormData).then(() =>
            getOwnerRoomType(createdRoomType.id),
          )
        : createdRoomType

      setRoomTypes((currentRoomTypes) => [roomType, ...currentRoomTypes])
      setSelectedRoomTypeId(roomType.id)
      setRoomTypeForm(initialRoomTypeForm)
      setMessage('Tipo de habitación creado correctamente.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Guarda los cambios realizados en un hotel
  async function handleUpdateHotel(event) {
    event.preventDefault()

    if (!selectedHotelId) {
      setError('Selecciona un hotel para editar.')
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      const updatedHotel = await updateOwnerHotel(
        selectedHotelId,
        buildHotelPayload(editHotelForm),
      )
      setHotels((currentHotels) => replaceItemById(currentHotels, updatedHotel))
      setEditHotelForm(mapHotelToForm(updatedHotel))
      setMessage('Hotel actualizado correctamente.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Guarda los cambios realizados en una habitación
  async function handleUpdateRoomType(event) {
    event.preventDefault()

    if (!selectedRoomTypeId) {
      setError('Selecciona una habitación para editar.')
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      const updatedRoomType = await updateOwnerRoomType(
        selectedRoomTypeId,
        buildRoomTypePayload(editRoomTypeForm),
      )
      setRoomTypes((currentRoomTypes) => {
        return replaceItemById(currentRoomTypes, updatedRoomType)
      })
      setEditRoomTypeForm(mapRoomTypeToForm(updatedRoomType))
      setMessage('Habitación actualizada correctamente.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Guarda la disponibilidad de un rango de fechas
  async function handleBulkAvailability(event) {
    event.preventDefault()

    if (!selectedRoomTypeId) {
      setError('Selecciona un tipo de habitación antes de actualizar inventario.')
      return
    }

    const items = buildAvailabilityItems(availabilityForm)

    if (items.length === 0) {
      setError('Revisa el rango de fechas de disponibilidad.')
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      await bulkUpdateOwnerAvailability(selectedRoomTypeId, items)
      await refreshAvailabilityPreview(selectedRoomTypeId)
      setMessage('Disponibilidad actualizada correctamente.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Cierra una fecha concreta para nuevas reservas
  async function handleCloseDate(event) {
    event.preventDefault()

    if (!selectedRoomTypeId) {
      setError('Selecciona un tipo de habitación antes de cerrar una fecha.')
      return
    }

    if (!closeDate) {
      setError('Selecciona la fecha que quieres cerrar.')
      return
    }

    const selectedRoomType = roomTypes.find((roomType) => {
      return String(roomType.id) === String(selectedRoomTypeId)
    })
    const existingDay = availabilityPreview.find((dayAvailability) => {
      return dayAvailability.date === closeDate
    })

    setIsSaving(true)
    setMessage('')

    try {
      await bulkUpdateOwnerAvailability(selectedRoomTypeId, [
        {
          available_units: 0,
          currency: selectedRoomType?.currency || availabilityForm.currency || 'EUR',
          date: closeDate,
          min_stay_nights: Number(existingDay?.min_stay_nights) || 1,
          price: Number(existingDay?.price || selectedRoomType?.base_price) || 0,
          status: 'closed',
        },
      ])
      await refreshAvailabilityPreview(selectedRoomTypeId)
      setCloseDate('')
      setMessage('Fecha cerrada correctamente.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Actualiza el estado de una reserva
  async function handleStatusChange(bookingId, status) {
    setIsSaving(true)
    setMessage('')

    try {
      const updatedBooking = await updateOwnerBookingStatus(bookingId, status)
      setBookings((currentBookings) => {
        return replaceItemById(currentBookings, updatedBooking)
      })
      setMessage('Estado de reserva actualizado.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Registra un pago manual para una reserva
  async function handleCreatePayment(booking) {
    const amount = getTotalBookingAmount(booking)

    setIsSaving(true)
    setMessage('')

    try {
      const updatedBooking = await createOwnerBookingPayment(booking.id, {
        amount: Number(amount),
        currency: booking.amounts?.currency || 'EUR',
        metadata: [],
        provider: 'manual',
        status: 'paid',
        transaction_reference: `HOTEL-${booking.booking_reference || booking.id}`,
      })
      setBookings((currentBookings) => {
        return replaceItemById(currentBookings, updatedBooking)
      })
      setMessage('Pago registrado correctamente.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <OwnerShell activeView={activeView} setActiveView={setActiveView}>
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Panel de propietario</h1>
          <p className="mt-3 text-secondary">
            Inicia sesión con una cuenta de propietario para gestionar hoteles,
            inventario y reservas
          </p>
          <Link
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 font-semibold text-on-primary"
            to="/login"
          >
            Iniciar sesión
          </Link>
        </section>
      </OwnerShell>
    )
  }

  return (
    <OwnerShell activeView={activeView} setActiveView={setActiveView}>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mi panel</h1>
          <p className="mt-1 text-secondary">
            Gestiona propiedades, reservas, pagos e inventario desde una sola vista
          </p>
        </div>
        <button
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 font-semibold text-on-primary transition hover:opacity-90"
          onClick={() => setActiveView('new-property')}
          type="button"
        >
          <FaPlus className="h-4 w-4" />
          Añadir hotel
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-error bg-error-container p-3 text-sm font-semibold text-error">
          {error}
        </p>
      )}

      {message && (
        <p className="mb-4 rounded-lg border border-outline-variant bg-secondary-container p-3 text-sm font-semibold text-on-secondary-fixed">
          {message}
        </p>
      )}

      {isLoading ? (
        <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-secondary">
          Cargando panel...
        </p>
      ) : (
        <>
          {activeView === 'dashboard' && (
            <DashboardView
              hotels={hotels}
              setActiveView={setActiveView}
              stats={stats}
            />
          )}

          {activeView === 'inventory' && (
            <InventoryView
              availabilityForm={availabilityForm}
              availabilityPreview={availabilityPreview}
              availabilityPreviewError={availabilityPreviewError}
              hotels={hotels}
              isAvailabilityPreviewLoading={isAvailabilityPreviewLoading}
              isSaving={isSaving}
              closeDate={closeDate}
              onAvailabilitySubmit={handleBulkAvailability}
              onCloseDateSubmit={handleCloseDate}
              onCreateRoomType={handleCreateRoomType}
              onHotelChange={handleSelectedHotelChange}
              onRoomTypeChange={handleSelectedRoomTypeChange}
              roomTypeServices={roomTypeServices}
              roomTypeForm={roomTypeForm}
              roomTypes={roomTypes}
              selectedHotelId={selectedHotelId}
              selectedRoomTypeId={selectedRoomTypeId}
              updateAvailabilityForm={updateAvailabilityForm}
              updateCloseDate={updateCloseDate}
              updateRoomTypeForm={updateRoomTypeForm}
            />
          )}

          {activeView === 'bookings' && (
            <BookingsView
              bookingFilters={bookingFilters}
              bookings={bookings}
              hotels={hotels}
              isSaving={isSaving}
              onCreatePayment={handleCreatePayment}
              onFilterChange={setBookingFilters}
              onStatusChange={handleStatusChange}
              selectedHotelId={bookingHotelFilter}
              setSelectedHotelId={setBookingHotelFilter}
            />
          )}

          {activeView === 'new-property' && (
            <NewPropertyView
              hotelForm={hotelForm}
              hotelServices={hotelServices}
              isSaving={isSaving}
              onSubmit={handleCreateHotel}
              updateHotelForm={updateHotelForm}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              editHotelForm={editHotelForm}
              editRoomTypeForm={editRoomTypeForm}
              hotels={hotels}
              hotelServices={hotelServices}
              isSaving={isSaving}
              onHotelChange={handleSelectedHotelChange}
              onRoomTypeChange={handleSelectedRoomTypeChange}
              onUpdateHotel={handleUpdateHotel}
              onUpdateRoomType={handleUpdateRoomType}
              roomTypes={roomTypes}
              roomTypeServices={roomTypeServices}
              selectedHotelId={selectedHotelId}
              selectedRoomTypeId={selectedRoomTypeId}
              updateEditHotelForm={updateEditHotelForm}
              updateEditRoomTypeForm={updateEditRoomTypeForm}
            />
          )}
        </>
      )}
    </OwnerShell>
  )
}

function DashboardView({ hotels, setActiveView, stats }) {
  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard label="Hoteles" value={hotels.length} />
          <StatCard label="Publicados" value={stats.activeHotels} />
          <StatCard label="Pendientes" value={stats.pendingBookings} />
          <StatCard label="Ingresos" value={formatPrice(stats.revenue)} />
        </div>

        <PanelCard
          action="Añadir hotel"
          onAction={() => setActiveView('new-property')}
          title="Hoteles gestionados"
        >
          <div className="overflow-hidden rounded-lg border border-outline-variant">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-high text-on-surface">
                <tr>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Reservas</th>
                  <th className="px-4 py-3 text-right">Precio desde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                {hotels.map((hotel) => (
                  <tr className="hover:bg-surface-container-low" key={hotel.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {hotel.cover_image?.url && (
                          <img
                            alt={hotel.cover_image.alt_text || hotel.name}
                            className="h-12 w-12 rounded-lg object-cover"
                            src={hotel.cover_image.url}
                          />
                        )}
                        <div>
                          <p className="font-bold text-primary">{hotel.name}</p>
                          <p className="text-xs text-secondary">
                            {getLocationText(hotel) || 'Ubicación pendiente'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={hotel.status} />
                    </td>
                    <td className="px-4 py-3">{hotel.bookings_count || 0}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatPrice(hotel.starting_price, hotel.currency_symbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </section>
    </div>
  )
}

function InventoryView({
  availabilityForm,
  availabilityPreview,
  availabilityPreviewError,
  closeDate,
  hotels,
  isAvailabilityPreviewLoading,
  isSaving,
  onAvailabilitySubmit,
  onCloseDateSubmit,
  onCreateRoomType,
  onHotelChange,
  onRoomTypeChange,
  roomTypeForm,
  roomTypeServices,
  roomTypes,
  selectedHotelId,
  selectedRoomTypeId,
  updateAvailabilityForm,
  updateCloseDate,
  updateRoomTypeForm,
}) {
  const selectedRoomType = roomTypes.find((roomType) => {
    return String(roomType.id) === String(selectedRoomTypeId)
  })
  const availabilityRanges = getAvailabilityRanges(availabilityPreview)
  const specialAvailabilityDays = getSpecialAvailabilityDays(
    availabilityPreview,
    selectedRoomType,
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="space-y-6 lg:col-span-8">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-primary">Inventario</h2>
            <p className="text-secondary">
              Gestiona tipos de habitación, precios y disponibilidad
            </p>
          </div>
          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 outline-none focus:border-primary"
            onChange={(event) => onHotelChange(event.target.value)}
            value={selectedHotelId}
          >
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {roomTypes.map((roomType) => (
            <article
              className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_8px_24px_rgba(19,27,46,0.08)]"
              key={roomType.id}
            >
              {roomType.cover_image?.url && (
                <img
                  alt={roomType.cover_image.alt_text || roomType.name}
                  className="h-40 w-full object-cover"
                  src={roomType.cover_image.url}
                />
              )}
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary">
                      {roomType.name}
                    </h3>
                    <p className="text-sm text-secondary">
                      {roomType.bed_type || 'Cama sin definir'} ·{' '}
                      {formatSquareMeters(roomType.size_m2)} m²
                    </p>
                  </div>
                  <StatusBadge status={roomType.status} />
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <Metric label="Unidades" value={roomType.total_units || 0} />
                  <Metric
                    label="Capacidad"
                    value={`${roomType.capacity_adults || 0}+${roomType.capacity_children || 0}`}
                  />
                  <Metric
                    label="Precio"
                    value={formatPrice(
                      roomType.base_price,
                      roomType.currency_symbol,
                    )}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <AvailabilityPreview
          availabilityDays={availabilityPreview}
          availabilityError={availabilityPreviewError}
          availabilityRanges={availabilityRanges}
          isLoading={isAvailabilityPreviewLoading}
          selectedRoomType={selectedRoomType}
          specialAvailabilityDays={specialAvailabilityDays}
        />
      </section>

      <aside className="space-y-6 lg:col-span-4">
        <PanelCard title="Crear habitación">
          <form className="space-y-3" onSubmit={onCreateRoomType}>
            <TextInput
              label="Nombre"
              name="name"
              onChange={updateRoomTypeForm}
              required
              value={roomTypeForm.name}
            />
            <TextArea
              label="Descripción"
              name="description"
              onChange={updateRoomTypeForm}
              value={roomTypeForm.description}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Adultos"
                min="1"
                name="capacity_adults"
                onChange={updateRoomTypeForm}
                type="number"
                value={roomTypeForm.capacity_adults}
              />
              <TextInput
                label="Niños"
                min="0"
                name="capacity_children"
                onChange={updateRoomTypeForm}
                type="number"
                value={roomTypeForm.capacity_children}
              />
              <TextInput
                label="m²"
                min="0"
                name="size_m2"
                onChange={updateRoomTypeForm}
                step="1"
                type="number"
                value={roomTypeForm.size_m2}
              />
              <TextInput
                label="Unidades"
                min="1"
                name="total_units"
                onChange={updateRoomTypeForm}
                type="number"
                value={roomTypeForm.total_units}
              />
            </div>
            <TextInput
              label="Tipo de cama"
              name="bed_type"
              onChange={updateRoomTypeForm}
              value={roomTypeForm.bed_type}
            />
            <TextInput
              label="Precio base"
              min="0"
              name="base_price"
              onChange={updateRoomTypeForm}
              required
              step="0.01"
              type="number"
              value={roomTypeForm.base_price}
            />
            <ImageUploadFields
              formData={roomTypeForm}
              label="Foto de la habitación"
              onChange={updateRoomTypeForm}
            />
            <ServiceCheckboxGroup
              label="Servicios de la habitación"
              onChange={updateRoomTypeForm}
              selectedIds={roomTypeForm.service_ids}
              services={roomTypeServices}
            />
            <PrimaryButton disabled={isSaving}>Crear habitación</PrimaryButton>
          </form>
        </PanelCard>

        <PanelCard title="Cerrar una fecha">
          <form className="space-y-3" onSubmit={onCloseDateSubmit}>
            <SelectInput
              label="Tipo de habitación"
              name="room_type_id"
              onChange={(event) => onRoomTypeChange(event.target.value)}
              value={selectedRoomTypeId}
            >
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </SelectInput>
            <TextInput
              label="Fecha"
              name="close_date"
              onChange={updateCloseDate}
              required
              type="date"
              value={closeDate}
            />
            <PrimaryButton disabled={isSaving || !selectedRoomTypeId}>
              Cerrar fecha
            </PrimaryButton>
          </form>
        </PanelCard>

        <PanelCard title="Disponibilidad por rango o temporada">
          <p className="mb-4 text-sm text-secondary">
            Aplica unidades, precio, estado y mínimo de noches a un periodo
            completo.
          </p>
          <form className="space-y-3" onSubmit={onAvailabilitySubmit}>
            <SelectInput
              label="Tipo de habitación"
              name="room_type_id"
              onChange={(event) => onRoomTypeChange(event.target.value)}
              value={selectedRoomTypeId}
            >
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </SelectInput>
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Desde"
                name="from"
                onChange={updateAvailabilityForm}
                required
                type="date"
                value={availabilityForm.from}
              />
              <TextInput
                label="Hasta"
                name="to"
                onChange={updateAvailabilityForm}
                required
                type="date"
                value={availabilityForm.to}
              />
              <TextInput
                label="Unidades"
                min="0"
                name="available_units"
                onChange={updateAvailabilityForm}
                type="number"
                value={availabilityForm.available_units}
              />
              <TextInput
                label="Precio"
                min="0"
                name="price"
                onChange={updateAvailabilityForm}
                step="0.01"
                type="number"
                value={availabilityForm.price}
              />
              <TextInput
                label="Mín. noches"
                min="1"
                name="min_stay_nights"
                onChange={updateAvailabilityForm}
                type="number"
                value={availabilityForm.min_stay_nights}
              />
            </div>
            <SelectInput
              label="Estado"
              name="status"
              onChange={updateAvailabilityForm}
              value={availabilityForm.status}
            >
              <option value="open">Abierto</option>
              <option value="blocked">Bloqueado</option>
              <option value="closed">Cerrado</option>
            </SelectInput>
            <PrimaryButton disabled={isSaving}>Aplicar cambios</PrimaryButton>
          </form>
        </PanelCard>
      </aside>
    </div>
  )
}

function BookingsView({
  bookingFilters,
  bookings,
  hotels,
  isSaving,
  onCreatePayment,
  onFilterChange,
  onStatusChange,
  selectedHotelId,
  setSelectedHotelId,
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-primary">Reservas</h2>
        <p className="text-secondary">
          Filtra, confirma estancias y registra pagos internos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 md:grid-cols-3">
        <SelectInput
          label="Hotel"
          name="hotel_id"
          onChange={(event) => setSelectedHotelId(event.target.value)}
          value={selectedHotelId}
        >
          <option value="">Todos los hoteles</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          label="Estado"
          name="status"
          onChange={(event) =>
            onFilterChange((currentFilters) => ({
              ...currentFilters,
              status: event.target.value,
            }))
          }
          value={bookingFilters.status}
        >
          <option value="">Todos</option>
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          label="Pago"
          name="payment_status"
          onChange={(event) =>
            onFilterChange((currentFilters) => ({
              ...currentFilters,
              payment_status: event.target.value,
            }))
          }
          value={bookingFilters.payment_status}
        >
          <option value="">Todos</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </SelectInput>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingRow
            booking={booking}
            disabled={isSaving}
            key={booking.id}
            onCreatePayment={onCreatePayment}
            onStatusChange={onStatusChange}
          />
        ))}
        {bookings.length === 0 && (
          <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
            No hay reservas con esos filtros.
          </p>
        )}
      </div>
    </section>
  )
}

function ImageUploadFields({ formData, label, onChange }) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface p-4">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          {label}
        </span>
        <input
          accept="image/*"
          className="mt-2 block w-full text-sm text-secondary file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-primary"
          name="image"
          onChange={onChange}
          type="file"
        />
      </label>
      <TextInput
        label="Texto alternativo"
        name="image_alt_text"
        onChange={onChange}
        placeholder="Ej. Fachada del hotel al atardecer"
        value={formData.image_alt_text}
      />
      <p className="mt-2 text-xs leading-5 text-secondary">
        Describe brevemente lo que aparece en la imagen. Ayuda a personas que usan
        lectores de pantalla y se muestra si la foto no carga.
      </p>
      <div className="mt-3">
        <CheckboxInput
          checked={formData.image_is_cover}
          label="Usar como portada"
          name="image_is_cover"
          onChange={onChange}
        />
      </div>
    </div>
  )
}

function ServiceCheckboxGroup({ label, onChange, selectedIds, services }) {
  if (services.length === 0) {
    return null
  }

  return (
    <fieldset className="rounded-lg border border-outline-variant bg-surface p-4">
      <legend className="px-1 text-xs font-bold uppercase tracking-wider text-secondary">
        {label}
      </legend>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <CheckboxInput
            checked={selectedIds.some((serviceId) => Number(serviceId) === Number(service.id))}
            key={service.id}
            label={service.name}
            name="service_ids"
            onChange={onChange}
            value={service.id}
          />
        ))}
      </div>
    </fieldset>
  )
}

function NewPropertyView({
  hotelForm,
  hotelServices,
  isSaving,
  onSubmit,
  updateHotelForm,
}) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <PanelCard title="Información básica del hotel">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="Nombre"
                name="name"
                onChange={updateHotelForm}
                required
                value={hotelForm.name}
              />
              <SelectInput
                label="Estado"
                name="status"
                onChange={updateHotelForm}
                value={hotelForm.status}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="inactive">Inactivo</option>
              </SelectInput>
              <TextInput
                label="Estrellas"
                max="5"
                min="1"
                name="stars"
                onChange={updateHotelForm}
                type="number"
                value={hotelForm.stars}
              />
              <TextInput
                label="Email de contacto"
                name="email"
                onChange={updateHotelForm}
                type="email"
                value={hotelForm.email}
              />
              <TextInput
                label="Teléfono"
                name="phone"
                onChange={updateHotelForm}
                value={hotelForm.phone}
              />
              <TextInput
                label="País"
                name="country"
                onChange={updateHotelForm}
                value={hotelForm.country}
              />
              <TextInput
                label="Región"
                name="region"
                onChange={updateHotelForm}
                value={hotelForm.region}
              />
              <TextInput
                label="Ciudad"
                name="city"
                onChange={updateHotelForm}
                value={hotelForm.city}
              />
              <TextInput
                label="Dirección"
                name="address"
                onChange={updateHotelForm}
                value={hotelForm.address}
              />
              <TextInput
                label="Código postal"
                name="postal_code"
                onChange={updateHotelForm}
                value={hotelForm.postal_code}
              />
            </div>
            <TextArea
              label="Descripción"
              name="description"
              onChange={updateHotelForm}
              value={hotelForm.description}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <TextInput
                label="Check-in"
                name="check_in_time"
                onChange={updateHotelForm}
                type="time"
                value={hotelForm.check_in_time}
              />
              <TextInput
                label="Check-out"
                name="check_out_time"
                onChange={updateHotelForm}
                type="time"
                value={hotelForm.check_out_time}
              />
              <TextInput
                label="Impuestos %"
                min="0"
                name="tax_rate_percent"
                onChange={updateHotelForm}
                step="0.01"
                type="number"
                value={hotelForm.tax_rate_percent}
              />
              <TextInput
                label="Descuento %"
                min="0"
                name="discount_rate_percent"
                onChange={updateHotelForm}
                step="0.01"
                type="number"
                value={hotelForm.discount_rate_percent}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <CheckboxInput
                checked={hotelForm.pets_allowed}
                label="Mascotas permitidas"
                name="pets_allowed"
                onChange={updateHotelForm}
              />
              <CheckboxInput
                checked={hotelForm.smoking_allowed}
                label="Fumadores permitidos"
                name="smoking_allowed"
                onChange={updateHotelForm}
              />
            </div>
            <ImageUploadFields
              formData={hotelForm}
              label="Foto del hotel"
              onChange={updateHotelForm}
            />
            <ServiceCheckboxGroup
              label="Servicios del hotel"
              onChange={updateHotelForm}
              selectedIds={hotelForm.service_ids}
              services={hotelServices}
            />
            <PrimaryButton disabled={isSaving}>Crear hotel</PrimaryButton>
          </form>
        </PanelCard>
      </div>

      <aside className="lg:col-span-4">
        <div className="rounded-xl border border-outline-variant bg-primary-container p-6 text-primary-fixed shadow-lg">
          <h3 className="text-2xl font-bold text-white">Publicación</h3>
          <p className="mt-3 text-sm leading-6 text-primary-fixed-dim">
            Crea primero la ficha del hotel. Después podrás añadir tipos de
            habitación y disponibilidad desde Inventario.
          </p>
        </div>
      </aside>
    </section>
  )
}

function SettingsView({
  editHotelForm,
  editRoomTypeForm,
  hotels,
  hotelServices,
  isSaving,
  onHotelChange,
  onRoomTypeChange,
  onUpdateHotel,
  onUpdateRoomType,
  roomTypes,
  roomTypeServices,
  selectedHotelId,
  selectedRoomTypeId,
  updateEditHotelForm,
  updateEditRoomTypeForm,
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Ajustes</h2>
        <p className="mt-1 text-secondary">
          Edita hoteles ya creados y tipos de habitación existentes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PanelCard title="Editar hotel">
          <form className="space-y-5" onSubmit={onUpdateHotel}>
            <SelectInput
              label="Hotel"
              name="hotel_id"
              onChange={(event) => onHotelChange(event.target.value)}
              value={selectedHotelId}
            >
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </SelectInput>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="Nombre"
                name="name"
                onChange={updateEditHotelForm}
                required
                value={editHotelForm.name}
              />
              <SelectInput
                label="Estado"
                name="status"
                onChange={updateEditHotelForm}
                value={editHotelForm.status}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="inactive">Inactivo</option>
              </SelectInput>
              <TextInput
                label="Estrellas"
                max="5"
                min="1"
                name="stars"
                onChange={updateEditHotelForm}
                type="number"
                value={editHotelForm.stars}
              />
              <TextInput
                label="Email"
                name="email"
                onChange={updateEditHotelForm}
                type="email"
                value={editHotelForm.email}
              />
              <TextInput
                label="Teléfono"
                name="phone"
                onChange={updateEditHotelForm}
                value={editHotelForm.phone}
              />
              <TextInput
                label="Ciudad"
                name="city"
                onChange={updateEditHotelForm}
                value={editHotelForm.city}
              />
              <TextInput
                label="Región"
                name="region"
                onChange={updateEditHotelForm}
                value={editHotelForm.region}
              />
              <TextInput
                label="País"
                name="country"
                onChange={updateEditHotelForm}
                value={editHotelForm.country}
              />
              <TextInput
                label="Dirección"
                name="address"
                onChange={updateEditHotelForm}
                value={editHotelForm.address}
              />
              <TextInput
                label="Código postal"
                name="postal_code"
                onChange={updateEditHotelForm}
                value={editHotelForm.postal_code}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="Check-in"
                name="check_in_time"
                onChange={updateEditHotelForm}
                type="time"
                value={editHotelForm.check_in_time}
              />
              <TextInput
                label="Check-out"
                name="check_out_time"
                onChange={updateEditHotelForm}
                type="time"
                value={editHotelForm.check_out_time}
              />
              <TextInput
                label="Impuestos %"
                min="0"
                name="tax_rate_percent"
                onChange={updateEditHotelForm}
                step="0.01"
                type="number"
                value={editHotelForm.tax_rate_percent}
              />
              <TextInput
                label="Descuento %"
                min="0"
                name="discount_rate_percent"
                onChange={updateEditHotelForm}
                step="0.01"
                type="number"
                value={editHotelForm.discount_rate_percent}
              />
            </div>

            <TextArea
              label="Descripción"
              name="description"
              onChange={updateEditHotelForm}
              value={editHotelForm.description}
            />

            <div className="flex flex-wrap gap-4">
              <CheckboxInput
                checked={editHotelForm.pets_allowed}
                label="Mascotas permitidas"
                name="pets_allowed"
                onChange={updateEditHotelForm}
              />
              <CheckboxInput
                checked={editHotelForm.smoking_allowed}
                label="Fumadores permitidos"
                name="smoking_allowed"
                onChange={updateEditHotelForm}
              />
            </div>

            <ServiceCheckboxGroup
              label="Servicios del hotel"
              onChange={updateEditHotelForm}
              selectedIds={editHotelForm.service_ids}
              services={hotelServices}
            />

            <PrimaryButton disabled={isSaving || !selectedHotelId}>
              Guardar hotel
            </PrimaryButton>
          </form>
        </PanelCard>

        <PanelCard title="Editar habitación">
          <form className="space-y-5" onSubmit={onUpdateRoomType}>
            <SelectInput
              label="Habitación"
              name="room_type_id"
              onChange={(event) => onRoomTypeChange(event.target.value)}
              value={selectedRoomTypeId}
            >
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </SelectInput>

            <TextInput
              label="Nombre"
              name="name"
              onChange={updateEditRoomTypeForm}
              required
              value={editRoomTypeForm.name}
            />
            <TextArea
              label="Descripción"
              name="description"
              onChange={updateEditRoomTypeForm}
              value={editRoomTypeForm.description}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="Adultos"
                min="1"
                name="capacity_adults"
                onChange={updateEditRoomTypeForm}
                type="number"
                value={editRoomTypeForm.capacity_adults}
              />
              <TextInput
                label="Niños"
                min="0"
                name="capacity_children"
                onChange={updateEditRoomTypeForm}
                type="number"
                value={editRoomTypeForm.capacity_children}
              />
              <TextInput
                label="m²"
                min="0"
                name="size_m2"
                onChange={updateEditRoomTypeForm}
                step="1"
                type="number"
                value={editRoomTypeForm.size_m2}
              />
              <TextInput
                label="Unidades"
                min="1"
                name="total_units"
                onChange={updateEditRoomTypeForm}
                type="number"
                value={editRoomTypeForm.total_units}
              />
              <TextInput
                label="Tipo de cama"
                name="bed_type"
                onChange={updateEditRoomTypeForm}
                value={editRoomTypeForm.bed_type}
              />
              <TextInput
                label="Precio base"
                min="0"
                name="base_price"
                onChange={updateEditRoomTypeForm}
                step="0.01"
                type="number"
                value={editRoomTypeForm.base_price}
              />
              <SelectInput
                label="Estado"
                name="status"
                onChange={updateEditRoomTypeForm}
                value={editRoomTypeForm.status}
              >
                <option value="active">Activa</option>
                <option value="inactive">Inactiva</option>
                <option value="draft">Borrador</option>
              </SelectInput>
              <TextInput
                label="Moneda"
                name="currency"
                onChange={updateEditRoomTypeForm}
                value={editRoomTypeForm.currency}
              />
            </div>

            <ServiceCheckboxGroup
              label="Servicios de la habitación"
              onChange={updateEditRoomTypeForm}
              selectedIds={editRoomTypeForm.service_ids}
              services={roomTypeServices}
            />

            <PrimaryButton disabled={isSaving || !selectedRoomTypeId}>
              Guardar habitación
            </PrimaryButton>
          </form>
        </PanelCard>
      </div>
    </section>
  )
}
