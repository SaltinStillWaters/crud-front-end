import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    show: false,
    text: '',
    color: 'success',
    timeout: 3000,
  }),

  actions: {
    open({ text = '', color = 'success', timeout = 3000 }) {
      this.text = text
      this.color = color
      this.timeout = timeout
      this.show = true
    },

    success(text: string) {
      this.open({ text, color: 'success' })
    },

    error(text: string) {
      this.open({ text, color: 'error' })
    },
  },
})
