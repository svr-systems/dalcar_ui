export const APP_NAME = 'Frontend-Template'
export const APP_VERSION = '1.25.0711'

// URL base de la API
const URL = 'https://solmetec.mx/app'
// const URL = "http://127.0.0.1:8000";

export const URL_API = URL + '/api'

// Genera headers HTTP dinámicos, con o sin token, y con el tipo de contenido adecuado según el caso.
export const getHdrs = (token = null, form_data = false) => {
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
  }

  if (form_data) {
    headers['Content-Type'] = 'multipart/form-data'
  } else {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = 'Bearer ' + token
  }

  return { headers }
}

// Devuelve 'data' de la respuesta API
export const getRsp = (rsp) => {
  return rsp.data
}

// Devuelve un id en b64
export const getEncodeId = (id) => {
  return window.btoa(id)
}

// Devuelve un id en b64
export const getDecodeId = (id) => {
  return window.atob(id)
}

// Captura y muestra en consola los errores devueltos por la API.
export const getErr = (obj) => {
  const err = {
    msg: obj.response.data.msg,
    err: obj.response.data.data,
  }

  console.log(err.err)

  return err.msg
}

// Devuelve el año actual
export const getCurrentYear = () => {
  return new Date().getFullYear()
}

// Genera fechas con hora utilizando diferentes separadores de ser requerido (ej. "2025-06-13 08:24:05")
export const getDateTime = (sprDate = '-', sprBwn = ' ', sprTime = ':') => {
  let dt = new Date()

  return (
    dt.getFullYear().toString().padStart(4, '0') +
    sprDate +
    (dt.getMonth() + 1).toString().padStart(2, '0') +
    sprDate +
    dt.getDate().toString().padStart(2, '0') +
    sprBwn +
    dt.getHours().toString().padStart(2, '0') +
    sprTime +
    dt.getMinutes().toString().padStart(2, '0') +
    sprTime +
    dt.getSeconds().toString().padStart(2, '0')
  )
}

// Devuelve reglas de validación para formularios
export const getRules = () => {
  return {
    rqd: [(v) => !!v || 'Campo requerido'],
    rqd_nn: [(v) => v != null || 'Campo requerido'],
    txt_rqd: [
      (v) => !!v || 'Campo requerido',
      (v) => (v && v.trim().length >= 2) || 'Mínimo 2 caracteres',
    ],
    txt: [
      (v) => {
        if (v) return (v && v.length >= 2) || 'Mínimo 2 caracteres'
        else return true
      },
    ],
    email_rqd: [
      (v) => !!v || 'Campo requerido',
      (v) => (v && v.length <= 65) || 'Máximo 65 caracteres',
      (v) => /.+@.+\..+/.test(v) || 'Formato invalido',
    ],
    email: [
      (v) => {
        if (v) return (v && v.length <= 65) || 'Máximo 65 caracteres'
        else return true
      },
      (v) => {
        if (v) return /.+@.+\..+/.test(v) || 'Formato invalido'
        else return true
      },
    ],
    password_rqd: [
      (v) => !!v || 'Campo requerido',
      (v) => (v && v.length >= 8) || 'Mínimo 8 caracteres',
      (v) => (v && v.length <= 30) || 'Máximo 30 caracteres',
      (v) => /(?=.*[A-Z])/.test(v) || 'Al menos una mayúscula',
      (v) => /(?=.*[a-z])/.test(v) || 'Al menos una minúscula',
      (v) => /(?=.*[0-9])/.test(v) || 'Al menos un número',
      (v) => /(?=.*[!@$%*])/.test(v) || 'Al menos un caractere especial (! @ $ % *)',
    ],
    doc_rqd: [
      (v) => !!v || 'Campo requerido',
      (v) => (v && v.size <= 1048576) || 'El tamaño máximo de carga es de 1MB',
    ],
    doc: [
      (v) => {
        if (v) return (v && v.size <= 1048576) || 'El tamaño máximo de carga es de 1MB'
        else return true
      },
    ],
    img_rqd: [
      (v) => !!v || 'Campo requerido',
      (v) => (v && v.size <= 2097152) || 'El tamaño máximo de carga es de 2MB',
    ],
    img: [
      (v) => {
        if (v) return (v && v.size <= 2097152) || 'El tamaño máximo de carga es de 2MB'
        else return true
      },
    ],
    fiscal_code_rqd: [
      (v) => !!v || 'Campo requerido',
      (v) => (v && v.length <= 13) || 'Máximo 13 caracteres',
      (v) => /^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/.test(v) || 'Formato invalido',
    ],
    fiscal_code: [
      (v) => {
        if (v) return (v && v.length <= 13) || 'Máximo 13 caracteres'
        else return true
      },
      (v) => {
        if (v) return /^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/.test(v) || 'Formato invalido'
        else return true
      },
    ],
    zip_rqd: [(v) => !!v || 'Campo requerido', (v) => /^\d{5}$/.test(v) || 'Ingresar 5 dígitos'],
    zip: [
      (v) => {
        if (v) return /^\d{5}$/.test(v) || 'Ingresar 5 dígitos'
        else return true
      },
    ],
    phone_rqd: [
      (v) => !!v || 'Campo requerido',
      (v) => /^\d{10}$/.test(v) || 'Ingresar 10 dígitos',
    ],
    phone: [
      (v) => {
        if (v) return /^\d{10}$/.test(v) || 'Ingresar 10 dígitos'
        else return true
      },
    ],
  }
}

// Genera objeto y agrega '_method: PATCH' si no es store
export const getObj = (data, store = false) => {
  let obj = Object.assign({}, data)

  if (!store) {
    obj['_method'] = 'PATCH'
  }

  return obj
}

// Extrae múltiples archivos y los asigna como propiedades planas
export const getPropDocs = (obj, prop, subprop) => {
  obj[prop].forEach(function (item, i) {
    obj[prop + '_' + subprop + '_' + i] = item[subprop]
  })

  return obj
}

// Extrae un archivo y lo asigna como propiedad plana
export const getPropDoc = (obj, prop, subprop) => {
  obj[prop + '_' + subprop] = obj[prop][subprop]
  return obj
}

// Genera FormData a partir de un objeto
export const getFormData = (data) => {
  let form_data = new FormData()

  // Recorre propiedades del objeto
  Object.keys(data).forEach((key) => {
    if (!(data[key] instanceof File) && typeof data[key] == 'object' && data[key] != null) {
      // Serializa objetos (excepto File)
      form_data.append(key, JSON.stringify(data[key]))
    } else {
      // Agrega File u otros valores; reemplaza null o vacío con ''
      form_data.append(
        key,
        data[key] == null || (typeof data[key] == 'string' && data[key].trim() == '')
          ? ''
          : data[key],
      )
    }
  })

  return form_data
}

// Convierte una cadena base64 en un Blob descargable o visible (imágenes, PDFs, etc.)
export const getBlob = (b64, ext) => {
  const binary_string = window.atob(b64.replace(/\s/g, '')) // Elimina espacios
  const len = binary_string.length
  let bytes = new Uint8Array(len)

  // Genera arreglo de bytes desde la cadena base64
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }

  // Devuelve Blob con tipo MIME especificado
  return new Blob([bytes.buffer], {
    type: 'application/' + ext,
  })
}

// Formatea número como moneda USD con dos decimales
export const getAmountFormat = (v) => {
  return Number(parseFloat(v == null || v == '' ? 0 : v).toFixed(2)).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

// Formatea número como porcentaje; devuelve '-' si es cero o vacío
export const getPercentFormat = (v) => {
  v = parseInt(v)
  return v == null || v == 0 ? '-' : v + '%'
}
