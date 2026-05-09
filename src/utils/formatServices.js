export function formatServices(services) {
  if (!services) {
    return []
  }

  if (Array.isArray(services)) {
    return services.map((service) => {
      if (typeof service === 'string') {
        return service
      }

      return service.name || service.title || 'Servicio'
    })
  }

  if (typeof services === 'string') {
    return services
      .split(',')
      .map((service) => service.trim())
      .filter(Boolean)
  }

  return []
}
