<template>
  <v-app-bar :elevation="3">
    <template #prepend>
      <v-icon>mdi-package-variant</v-icon>
    </template>

    <v-app-bar-title>Inventory Management System</v-app-bar-title>

    <template #append v-if="user">
      <v-btn icon @click="logout" title="Logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { user } from '@/utils/auth';
import { api } from '@/utils/axios';
import { useSnackbarStore } from '@/utils/snackbar';

export default {
  data: () => ({
    loading: false
  }),
  computed: {
    user() {
      return user.value
    }
  },
  methods: {
    async logout() {
      this.loading = true
      try {
        const snackbar = useSnackbarStore()
        await api.post('/auth/logout')
        user.value = null
        snackbar.success('Logged out successfully')
        this.$router.push(`/auth/login`)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
