<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg" :loading="loading">
      <v-form ref="formRef" @submit.prevent="submit" :loading="loading">
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field v-model="form.email" :rules="rules.email" density="compact" placeholder="Email address"
          prepend-inner-icon="mdi-email-outline" variant="outlined" />

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
          <v-btn @click="redirect('/auth/forgot-password')" :loading="loading" variant="text" color="primary"
            class="text-caption">
            Forgot password
          </v-btn>
        </div>

        <v-text-field v-model="form.password" :rules="rules.password" @click:append-inner="visible = !visible"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
          variant="outlined" />

        <v-card class="mb-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, your account will be temporarily locked for three hours.
          </v-card-text>
        </v-card>

        <v-card-text class="text-center pa-0">
          <v-btn type="submit" class="mb-8" color="white" size="large" variant="tonal" :loading="loading">
            Log In
          </v-btn>
          <br>
          <v-btn @click="redirect('/auth/register')" :loading="loading" variant="text" color="primary"
            class="text-caption text-decoration-underline">
            Don't have an account?
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
    visible: false,
    rules: {
      email: [required(), isEmail()],
      password: [required()]
    },
    form: {
      email: '',
      password: ''
    },
  }),
  methods: {
    async submit() {
      try {
        const snackbar = useSnackbarStore()
        this.loading = true
        const form = this.$refs.formRef as VForm | undefined;
        if (!form) return

        const { valid } = await form.validate()
        if (!valid) return

        await web.get('/sanctum/csrf-cookie');

        const token = Cookies.get('XSRF-TOKEN')
        if (!token) return

        await api.post('/auth/login', this.form)
        snackbar.success('Logged in successfully!')
        this.$router.push(`/products/showall`)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    redirect(path: string) {
      this.loading = true
      this.$router.push(path)
        .finally(() => this.loading = false)
    }
  }
}
</script>
