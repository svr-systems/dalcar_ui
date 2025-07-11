/**
 * Genera una cadena de fecha y hora actual con separadores personalizados.
 * @param {string} dateSep - Separador entre año, mes y día (por defecto: '-')
 * @param {string} dateTimeSep - Separador entre fecha y hora (por defecto: ' ')
 * @param {string} timeSep - Separador entre horas, minutos y segundos (por defecto: ':')
 * @returns {string} Fecha y hora en formato YYYY-MM-DD HH:MM:SS (según separadores)
 */
export const getDateTime = (dateSep = '-', dateTimeSep = ' ', timeSep = ':') => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const datePart = [year, month, day].join(dateSep)
  const timePart = [hours, minutes, seconds].join(timeSep)

  return `${datePart}${dateTimeSep}${timePart}`
}

/**
 * Formatea un valor numérico como monto en USD con dos decimales.
 * Si el valor es nulo o vacío, retorna -.
 *
 * @param {number|string|null} value - Valor numérico a formatear
 * @returns {string} Monto formateado como moneda en USD (ej: $1,234.56)
 */
export const getAmountFormat = (value) => {
  const numeric = parseFloat(value)

  if (isNaN(numeric)) {
    return '-'
  }

  return numeric.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Formatea un valor numérico como porcentaje.
 * Si el valor es nulo o vacío, retorna -.
 *
 * @param {number|string|null} value - Valor numérico a formatear como porcentaje
 * @returns {string} Porcentaje formateado (ej: '25%') o '-' si no es válido
 */
export const getPercentFormat = (value) => {
  const numeric = parseFloat(value)

  if (isNaN(numeric)) {
    return '-'
  }

  return `${numeric}%`
}
