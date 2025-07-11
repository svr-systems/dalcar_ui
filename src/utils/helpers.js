/**
 * Devuelve el año actual.
 * @returns {number} Año actual en formato YYYY
 */
export const getCurrentYear = () => {
  return new Date().getFullYear()
}

/**
 * Retorna un objeto clonado y, si es modo edición, agrega _method: PATCH.
 * @param {Object} data - Datos originales del formulario.
 * @param {boolean} isStoreMode - Indica si es un nuevo registro (true) o edición (false).
 * @returns {Object} Objeto con los datos y, si aplica, la bandera _method.
 */
export const getObj = (data, isStoreMode = false) => {
  const obj = { ...data }
  if (!isStoreMode) obj._method = 'PATCH'
  return obj
}

/**
 * Convierte un objeto plano en una instancia de FormData.
 * Serializa objetos excepto archivos. Reemplaza null/cadenas vacías por ''.
 * @param {Object} data - Objeto de entrada
 * @returns {FormData} Instancia de FormData construida
 */
export const getFormData = (data) => {
  const formData = new FormData()

  for (const key in data) {
    const value = data[key]
    const isEmptyString = typeof value === 'string' && value.trim() === ''
    const isPlainObject = typeof value === 'object' && !(value instanceof File) && value !== null

    formData.append(
      key,
      value == null || isEmptyString ? '' : isPlainObject ? JSON.stringify(value) : value,
    )
  }

  return formData
}

/**
 * Extrae una subpropiedad de un objeto anidado y la asigna como propiedad directa.
 *
 * @param {Object} target - Objeto principal que contiene la propiedad anidada.
 * @param {string} sourceKey - Nombre de la propiedad que contiene el objeto anidado.
 * @param {string} nestedKey - Clave que se desea extraer del objeto anidado.
 * @returns {Object} Objeto actualizado con la nueva propiedad directa.
 */
export const extractNestedProp = (target, sourceKey, nestedKey) => {
  if (
    target &&
    typeof target === 'object' &&
    target[sourceKey] &&
    typeof target[sourceKey] === 'object'
  ) {
    target[`${sourceKey}_${nestedKey}`] = target[sourceKey][nestedKey]
  }

  return target
}

/**
 * Extrae una clave específica de cada objeto dentro de un arreglo anidado
 * y la asigna como propiedades planas en el objeto principal.
 *
 * @param {Object} target - Objeto principal que contiene el arreglo anidado.
 * @param {string} arrayKey - Nombre de la propiedad que contiene el arreglo de objetos.
 * @param {string} nestedKey - Clave que se desea extraer de cada objeto del arreglo.
 * @returns {Object} Objeto actualizado con las nuevas propiedades planas.
 */
export const extractMultipleNestedProps = (target, arrayKey, nestedKey) => {
  if (target && Array.isArray(target[arrayKey])) {
    target[arrayKey].forEach((item, index) => {
      if (item && item[nestedKey] !== undefined) {
        target[`${arrayKey}_${nestedKey}_${index}`] = item[nestedKey]
      }
    })
  }

  return target
}
