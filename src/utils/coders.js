/**
 * Codifica un ID en base64.
 * @param {string|number} id - Identificador a codificar.
 * @returns {string} ID codificado en base64.
 */
export const getEncodeId = (id) => {
  return window.btoa(String(id))
}

/**
 * Decodifica un ID desde base64.
 * @param {string} encodedId - Identificador codificado.
 * @returns {string} ID original decodificado.
 */
export const getDecodeId = (encodedId) => {
  return window.atob(encodedId)
}

/**
 * Convierte una cadena base64 en un objeto Blob.
 * Útil para visualizar o descargar archivos (PDFs, imágenes, etc.)
 *
 * @param {string} base64 - Contenido codificado en base64.
 * @param {string} ext - Extensión del archivo (ej. 'pdf', 'jpg', 'png').
 * @returns {Blob} Objeto Blob generado con el tipo MIME correspondiente.
 */
export const getBlob = (base64, ext) => {
  const cleanedBase64 = base64.replace(/\s/g, '')
  const binary = atob(cleanedBase64)
  const byteLength = binary.length
  const byteArray = new Uint8Array(byteLength)

  for (let index = 0; index < byteLength; index++) {
    byteArray[index] = binary.charCodeAt(index)
  }

  const mimeType = `application/${ext}`

  return new Blob([byteArray], { type: mimeType })
}
