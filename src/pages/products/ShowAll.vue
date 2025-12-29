<template>
  <v-container fluid class="d-flex justify-center align-center px-6">
    <template v-if="init">
      <v-card class="mx-auto pa-6" width="100%">
        <!-- Simulate table header -->
        <v-skeleton-loader type="heading" class="mb-4" />
        <!-- Simulate table rows -->
        <v-skeleton-loader v-for="i in 2" :key="i" type="text" class="mb-2" width="100%" height="40px" />
      </v-card>

    </template>
    <template v-else>
      <ProductsTable />
    </template>
  </v-container>
</template>

<script lang="ts">
import { authGuard, fetchUser } from '@/utils/auth';

export default {
  async created() {
    this.init = true
    await fetchUser()
    authGuard(this.$route, this.$router)
    this.init = false
  },
  data: () => ({
    init: true
  })
}
</script>
