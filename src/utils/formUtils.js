// Añade o elimina un identificador de una selección múltiple
export function toggleSelectedId(selectedIds, id, isSelected) {
  const normalizedId = Number(id)

  if (isSelected) {
    return [...new Set([...selectedIds, normalizedId])]
  }

  return selectedIds.filter((selectedId) => Number(selectedId) !== normalizedId)
}

// Obtiene el valor correcto según el tipo de campo de formulario
function getFormFieldValue(currentForm, target) {
  const { checked, files, name, type, value } = target

  if (name === 'service_ids') {
    return toggleSelectedId(currentForm.service_ids, value, checked)
  }

  if (type === 'file') {
    return files[0] || null
  }

  return type === 'checkbox' ? checked : value
}

// Actualiza un formulario controlado a partir del evento de un campo
export function updateFormFromEvent(setForm, event) {
  const { name } = event.target

  setForm((currentForm) => ({
    ...currentForm,
    [name]: getFormFieldValue(currentForm, event.target),
  }))
}
