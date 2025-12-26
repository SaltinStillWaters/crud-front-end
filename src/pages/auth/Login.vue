<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-form ref="formRef" @submit.prevent="submit" :loading="loading">
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field v-model="form.email" :rules="rules.email" density="compact" placeholder="Email address"
          prepend-inner-icon="mdi-email-outline" variant="outlined">
        </v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password

          <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
            Forgot login password?</a>
        </div>

        <v-text-field v-model="form.password" :rules="rules.password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>

        <v-card class="mb-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours.
          </v-card-text>
        </v-card>

        <v-btn type="submit" class="mb-8" color="white" size="large" variant="tonal" :loading="loading">
          Log In
        </v-btn>

        <v-card-text class="text-center">
          <v-btn variant="text" color="primary" to="/auth/register" size="small">
            Don't have an account?
            <v-icon icon="mdi-chevron-right" />
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { api, web } from '@/utils/axios';
import { isEmail, required } from '@/utils/rules';
import type { VForm } from 'vuetify/components';
import Cookies from 'js-cookie';
import { useSnackbarStore } from '@/utils/snackbar';

export default {
  data: () => ({
    loading: false,
    rules: {
      email: [required(), isEmail()],
      password: [required()]
    },
    form: {
      email: '',
      password: ''
    },
    visible: false,
  }),
  computed: {
    snackbar() {
      return useSnackbarStore()
    }
  },
  methods: {
    async submit() {
      try {
        this.loading = true
        const form = this.$refs.formRef as VForm | undefined;
        if (!form) return

        const { valid } = await form.validate()
        if (!valid) return

        const res = await web.get('/sanctum/csrf-cookie');

        const token = Cookies.get('XSRF-TOKEN')
        if (!token) return

        await api.post('/auth/login', this.form)
        this.snackbar.success('Logged in successfully!')
        this.$router.push(`/products/showall`)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
