const statusLabels = {
  active: 'Activa',
  authorized: 'Autorizado',
  cancelled: 'Cancelada',
  card: 'Pago con tarjeta',
  closed: 'Cerrado',
  completed: 'Completada',
  confirmed: 'Confirmada',
  draft: 'Borrador',
  failed: 'Fallido',
  hotel: 'Pago en hotel',
  inactive: 'Inactivo',
  manual: 'Manual',
  open: 'Abierto',
  paid: 'Pagado',
  pending: 'Pendiente',
  published: 'Publicado',
  refunded: 'Reembolsado',
}

// Obtiene la etiqueta visible de un estado recibido desde la API
export function getStatusLabel(status, fallback = 'Desconocido') {
  const normalizedStatus = status?.toLowerCase()

  return statusLabels[normalizedStatus] || status || fallback
}
