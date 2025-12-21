export const required = () => 
    (v: any) => {
        if (v === 0 || v === '0') return true
        return !!v || 'Required'
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