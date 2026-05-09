export function formatServices(services) {
  if (!services) {
    return []
  }

  if (Array.isArray(services)) {
    return services.flatMap((service) => {
      if (typeof service === 'string') {
        return service
      }

      if (Array.isArray(service)) {
        return formatServices(service)
      }

      if (typeof service === 'object') {
        return (
          service.name ||
          service.title ||
          service.label ||
          service.service?.name ||
          service.service?.title ||
          []
        )
      }

      return []
    })
  }

  if (typeof services === 'object') {
    if (Array.isArray(services.data)) {
      return formatServices(services.data)
    }

    if (Array.isArray(services.services)) {
      return formatServices(services.services)
    }

    if (services.name || services.title || services.label) {
      return [services.name || services.title || services.label]
    }

    return []
  }

  if (typeof services === 'string') {
    try {
      const parsedServices = JSON.parse(services)

      if (Array.isArray(parsedServices)) {
        return formatServices(parsedServices)
      }
    } catch {

    }

    return services
      .split(',')
      .map((service) => service.trim())
      .filter(Boolean)
  }

  return []
}
