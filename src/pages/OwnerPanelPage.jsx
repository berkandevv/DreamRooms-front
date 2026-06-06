import { useEffect, useState } from 'react'
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
import { updateFormFromEvent } from '../utils/formUtils'
import {
  buildAvailabilityItems,
  buildHotelPayload,
  buildImageFormData,
  buildRoomTypePayload,
  initialAvailabilityForm,
  initialHotelForm,
  initialRoomTypeForm,
  mapHotelToForm,
  mapRoomTypeToForm,
} from './owner/forms/ownerForms'
import { getTotalBookingAmount } from './owner/ownerHelpers'
import { getAvailabilityPreviewRange } from './owner/availabilityHelpers'
import OwnerShell from './owner/OwnerShell'
import DashboardView from './owner/views/DashboardView'
import InventoryView from './owner/views/InventoryView'
import BookingsView from './owner/views/BookingsView'
import NewPropertyView from './owner/views/NewPropertyView'
import SettingsView from './owner/views/SettingsView'

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
  const activeHotels = hotels.filter((hotel) => hotel.status === 'published').length
  const pendingBookings = bookings.filter(
    (booking) => booking.status === 'pending',
  ).length
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === 'confirmed',
  ).length
  const revenue = bookings
    .filter((booking) => booking.status === 'completed')
    .reduce((total, booking) => {
      return total + (Number(booking.amounts?.total) || 0)
    }, 0)
  const stats = { activeHotels, confirmedBookings, pendingBookings, revenue }

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
      setEditHotelForm(mapHotelToForm(hotel))
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
      {activeView === 'dashboard' && (
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
      )}

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
