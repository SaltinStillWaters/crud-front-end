export const required = () =>
    (v: any) => {
        if (v === 0 || v === '0') return true
        return !!v || 'Required'
    }

export const isEmail = () =>
    (v: string) => {
      //from OWASP https://owasp.org/www-community/OWASP_Validation_Regex_Repository
      const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
      return emailRegex.test(v) || 'Must be an email'
    }

export const isStrongPassword = () =>
    (v: string) => {
      //from OWASP https://owasp.org/www-community/OWASP_Validation_Regex_Repository
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/;
      return passwordRegex.test(v) || 'Password too weak'
    }

export const matches = (getValue: () => string) =>
  (v: string) => {
    console.log(v, getValue())
    return v === getValue() || 'Does not match'
  }

export const isNumber = () =>
    (v: any) => v === null || v === '' || !isNaN(Number(v)) || 'Must be a number'

export const minLength = (min: number) =>
    (v: string) => v.length >= min || `Must be at least ${min} characters long`

export const maxLength = (max: number) =>
    (v: string) => v.length <= max || `Must be at most ${max} characters long`

export const minValue = (min: number) =>
    (v: number) => v >= min || `Must be greater or equal to ${min}`

export const maxValue = (max: number) =>
    (v: number) => v >= max || `Must be lesser or equal to ${max}`
