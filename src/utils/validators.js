/**
 * Reglas de validación reutilizables para formularios.
 */
export const getRules = () => {
  return {
    required: [(value) => !!value || 'Campo requerido'],
    requiredNotNull: [(value) => value != null || 'Campo requerido'],

    textRequired: [
      (value) => !!value || 'Campo requerido',
      (value) => (value && value.trim().length >= 2) || 'Mínimo 2 caracteres',
    ],
    textOptional: [
      (value) => {
        if (value) return value.length >= 2 || 'Mínimo 2 caracteres'
        return true
      },
    ],

    emailRequired: [
      (value) => !!value || 'Campo requerido',
      (value) => (value && value.length <= 65) || 'Máximo 65 caracteres',
      (value) => /.+@.+\..+/.test(value) || 'Formato inválido',
    ],
    emailOptional: [
      (value) => {
        if (value) return value.length <= 65 || 'Máximo 65 caracteres'
        return true
      },
      (value) => {
        if (value) return /.+@.+\..+/.test(value) || 'Formato inválido'
        return true
      },
    ],

    passwordRequired: [
      (value) => !!value || 'Campo requerido',
      (value) => value.length >= 8 || 'Mínimo 8 caracteres',
      (value) => value.length <= 30 || 'Máximo 30 caracteres',
      (value) => /(?=.*[A-Z])/.test(value) || 'Al menos una mayúscula',
      (value) => /(?=.*[a-z])/.test(value) || 'Al menos una minúscula',
      (value) => /(?=.*[0-9])/.test(value) || 'Al menos un número',
      (value) => /(?=.*[!@$%*])/.test(value) || 'Al menos un carácter especial (! @ $ % *)',
    ],

    fileRequired: [
      (value) => !!value || 'Campo requerido',
      (value) => value.size <= 1048576 || 'Máximo 1MB',
    ],
    fileOptional: [
      (value) => {
        if (value) return value.size <= 1048576 || 'Máximo 1MB'
        return true
      },
    ],

    imageRequired: [
      (value) => !!value || 'Campo requerido',
      (value) => value.size <= 2097152 || 'Máximo 2MB',
    ],
    imageOptional: [
      (value) => {
        if (value) return value.size <= 2097152 || 'Máximo 2MB'
        return true
      },
    ],

    fiscalCodeRequired: [
      (value) => !!value || 'Campo requerido',
      (value) => value.length <= 13 || 'Máximo 13 caracteres',
      (value) => /^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/.test(value) || 'Formato inválido',
    ],
    fiscalCodeOptional: [
      (value) => {
        if (value) return value.length <= 13 || 'Máximo 13 caracteres'
        return true
      },
      (value) => {
        if (value) return /^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/.test(value) || 'Formato inválido'
        return true
      },
    ],

    zipRequired: [
      (value) => !!value || 'Campo requerido',
      (value) => /^\d{5}$/.test(value) || 'Ingresar 5 dígitos',
    ],
    zipOptional: [
      (value) => {
        if (value) return /^\d{5}$/.test(value) || 'Ingresar 5 dígitos'
        return true
      },
    ],

    phoneRequired: [
      (value) => !!value || 'Campo requerido',
      (value) => /^\d{10}$/.test(value) || 'Ingresar 10 dígitos',
    ],
    phoneOptional: [
      (value) => {
        if (value) return /^\d{10}$/.test(value) || 'Ingresar 10 dígitos'
        return true
      },
    ],
  }
}
