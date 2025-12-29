<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-card :loading="loading" class="mx-auto pa-12 pb-8" elevation="8" min-width="350" max-width="500" rounded="lg">
      <template v-if="init">
        <v-skeleton-loader type="card" class="mb-4" width="100%" />
        <v-skeleton-loader type="text, text, button" class="mb-2" width="100%"
          style="min-height: 48px; border-radius: 8px" />
        <v-skeleton-loader type="text" class="mb-2" width="100%" style="min-height: 48px; border-radius: 8px" />
        <v-skeleton-loader type="button" class="mt-4" width="100%" style="height: 48px" />
      </template>

      <template v-else>
        <v-form ref="formRef" @submit.prevent="submit" :loading="loading">
          <div class="text-subtitle-1 text-medium-emphasis">Username</div>
          <v-text-field v-model="form.name" :rules="rules.name" density="compact" placeholder="Name"
            prepend-inner-icon="mdi-email-outline" variant="outlined" />

          <div class="text-subtitle-1 text-medium-emphasis">Account</div>
          <v-text-field v-model="form.email" :rules="rules.email" density="compact" placeholder="Email address"
            prepend-inner-icon="mdi-email-outline" variant="outlined" />

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Password
          </div>
          <v-text-field v-model="form.password" :rules="rules.password"
            :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visiblePassword ? 'text' : 'password'" density="compact" placeholder="Enter your password"
            prepend-inner-icon="mdi-lock-outline" variant="outlined"
            @click:append-inner="visiblePassword = !visiblePassword"></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Confirm Password
          </div>
          <v-text-field v-model="form.password_confirm" :rules="rules.password_confirm"
            :append-inner-icon="visibleConfirm ? 'mdi-eye-off' : 'mdi-eye'" :type="visibleConfirm ? 'text' : 'password'"
            density="compact" placeholder="Re-enter password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
            @click:append-inner="visibleConfirm = !visibleConfirm"></v-text-field>


          <v-card-text class="text-center pa-0">
            <v-btn type="submit" class="mb-8" color="white" size="large" variant="tonal" :loading="loading">
              Sign up
            </v-btn>
            <br>
            <v-btn @click="redirect('/auth/login')" :loading="loading" variant="text" color="primary"
              class="text-caption">
              Already have an account?
            </v-btn>
          </v-card-text>
        </v-form>
      </template>
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
import { authGuard, fetchUser } from '@/utils/auth';

type Rule = (v: any) => boolean | string

export default {
  data: () => ({
    init: false,
    loading: false,
    visible: false,
    visiblePassword: false,
    visibleConfirm: false,
    rules: {
      name: [required()],
      email: [required(), isEmail()],
      password: [required(), isStrongPassword()],
      password_confirm: [] as Rule[]
    },
    form: {
      name: '',
      email: '',
      password: '',
      password_confirm: ''
    },
  }),
  async created() {
    console.log('checking')
    this.init = true
    await fetchUser()
    authGuard(this.$route, this.$router)
    this.init = false

    this.rules.password_confirm = [
      required(),
      matches(() => this.form.password)
    ]
  },
  watch: {
    'form.password'() {
      const temp = this.form.password_confirm
      this.form.password_confirm = ''

      nextTick(() => {
        this.form.password_confirm = temp
      })
    }
  },
  methods: {
    async submit() {
      this.loading = true
      try {
        const snackbar = useSnackbarStore()
        const form = this.$refs.formRef as VForm | undefined;
        if (!form) return

        const { valid } = await form.validate()
        if (!valid) return

        await web.get('/sanctum/csrf-cookie');

        const token = Cookies.get('XSRF-TOKEN')
        if (!token) return

        await api.post('/auth/register', this.form)

        snackbar.success('Registered successfully!')
        this.$router.push(`/products/showall`)
      } catch (err) { }
      finally {
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
