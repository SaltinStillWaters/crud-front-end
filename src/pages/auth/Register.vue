<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-form ref="formRef" @submit.prevent="submit" :loading="loading">
        <div class="text-subtitle-1 text-medium-emphasis">Username</div>

        <v-text-field v-model="form.name" :rules="rules.name" density="compact" placeholder="Name"
          prepend-inner-icon="mdi-email-outline" variant="outlined">
        </v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field v-model="form.email" :rules="rules.email" density="compact" placeholder="Email address"
          prepend-inner-icon="mdi-email-outline" variant="outlined">
        </v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>

        <v-text-field ref="confirmPasswordRef" v-model="form.password" :rules="rules.password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Confirm Password
        </div>

        <v-text-field v-model="form.confirmPassword" :rules="rules.confirmPassword"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>

        <v-card class="mb-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours.
          </v-card-text>
        </v-card>

        <v-btn type="submit" class="mb-8" color="white" size="large" variant="tonal" :loading="loading">
          Sign up
        </v-btn>

        <v-card-text class="text-center">
          <v-btn variant="text" color="primary" to="/auth/login" size="small">
            Already have an account? <v-icon icon="mdi-chevron-right"></v-icon>
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { api, web } from '@/utils/axios';
import { isEmail, isStrongPassword, matches, required } from '@/utils/rules';
import type { VForm, VTextField } from 'vuetify/components';
import Cookies from 'js-cookie';
import { nextTick } from 'vue';
import { useSnackbarStore } from '@/utils/snackbar';

type Rule = (v: any) => boolean | string

export default {
  data: () => ({
    loading: false,
    rules: {
      name: [required()],
      email: [required(), isEmail()],
      password: [required(), isStrongPassword()],
      confirmPassword: [] as Rule[]
    },
    form: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    visible: false,
  }),
  created() {
    this.rules.confirmPassword = [
      required(),
      matches(() => this.form.password)
    ]
  },
  computed: {
    snackbar() {
      return useSnackbarStore()
    }
  },
  watch: {
    'form.password'() {
      const temp = this.form.confirmPassword
      this.form.confirmPassword = ''

      nextTick(() => {
        this.form.confirmPassword = temp
      })
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

        await api.post('/auth/register', this.form)
        this.snackbar.success('Registered successfully!')
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
