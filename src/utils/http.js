// Genera headers HTTP con o sin token, y tipo de contenido adecuado
export const getHdrs = (token = null, useFormData = false) => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': useFormData ? 'multipart/form-data' : 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return { headers }
}

// Extrae la propiedad 'data' de la respuesta API
export const getRsp = (response) => {
  return response.data
}

// Devuelve mensaje de error y muestra detalles en consola
export const getErr = (error) => {
  const msg = error.response?.data?.msg || 'Error desconocido'
  const details = error.response?.data?.data || {}

  if (import.meta.env.VITE_LOG_ERRORS === 'true') {
    console.error(details)
  }

  return msg
}
